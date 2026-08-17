import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateInvoiceHtml, type InvoiceData } from "@/lib/invoice";
import Razorpay from "razorpay";

const resendApiKey = process.env.RESEND_API_KEY!;
const resendFrom = process.env.RESEND_FROM!;

export async function POST(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const body = await request.json();
    const { userId, rzpOrderId, rzpPaymentId, amount, originalAmount, planName, discountAmount } = body;

    if (!userId || !rzpOrderId || !rzpPaymentId || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch the payment record to get the internal order_id
    const { data: paymentRecord, error: paymentFetchError } = await supabaseAdmin
      .from("payments")
      .select("order_id")
      .eq("provider_order_id", rzpOrderId)
      .single();

    // Fetch the order to get server-stored tax_amount instead of trusting client
    let storedTaxAmount = 0;
    if (!paymentFetchError && paymentRecord) {
      const { data: orderRecord } = await supabaseAdmin
        .from("orders")
        .select("tax_amount")
        .eq("id", paymentRecord.order_id)
        .single();
      if (orderRecord) {
        storedTaxAmount = Number(orderRecord.tax_amount) || 0;
      }
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("Failed to fetch patient profile:", profileError);
      return NextResponse.json(
        { success: false, message: "Patient profile not found" },
        { status: 404 },
      );
    }

    const { data: addresses, error: addressError } = await supabaseAdmin
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1);

    if (addressError) {
      console.error("Failed to fetch patient address:", addressError);
    }

    const address = addresses && addresses.length > 0 ? addresses[0] : null;

    const patientAddress = address
      ? [
          address.house_no,
          address.address_line_1,
          address.address_line_2,
          address.landmark,
          address.city,
          address.state,
          address.postal_code,
          address.country,
        ]
          .filter(Boolean)
          .join(", ")
      : "N/A";

    const now = new Date();
    const invoiceNo = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${rzpPaymentId.slice(-8)}`;

    const grandTotalPaise = amount;
    const grandTotalRupees = grandTotalPaise / 100;
    const discountRupees = (discountAmount || 0) / 100;

    // Use server-stored tax amount from orders table; fall back to deriving from grand total
    const taxAmount = storedTaxAmount > 0
      ? storedTaxAmount
      : Math.round((grandTotalRupees - discountRupees) * 5 / 100 * 100) / 100;

    const servicesTotal = Math.round((grandTotalRupees - taxAmount + discountRupees) * 100) / 100;

    const consultationAmt = Math.round(servicesTotal * 0.4 * 100) / 100;
    const assessmentAmt = Math.round(servicesTotal * 0.25 * 100) / 100;
    const treatmentAmt = Math.round(servicesTotal * 0.2 * 100) / 100;
    const prescriptionAmt = Math.round((servicesTotal - consultationAmt - assessmentAmt - treatmentAmt) * 100) / 100;

    let paymentMethodStr = "Razorpay";
    try {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keyId && keySecret) {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const paymentDetails = await razorpay.payments.fetch(rzpPaymentId);
        if (paymentDetails && paymentDetails.method) {
          paymentMethodStr = `Razorpay (${paymentDetails.method.toUpperCase()})`;
        }
      }
    } catch (err) {
      console.error("Failed to fetch payment method from Razorpay:", err);
    }

    const invoiceData: InvoiceData = {
      invoice_no: invoiceNo,
      invoice_date: now.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      order_id: rzpOrderId,
      patient_id: userId.slice(0, 12),
      payment_status: "Paid",
      payment_method: paymentMethodStr,
      gstin: "06ABCFF1234G1Z5",
      patient_name: profile.name || "N/A",
      patient_age: (profile.metadata as any)?.age ? String((profile.metadata as any).age) : "N/A",
      patient_gender: (profile.metadata as any)?.gender || "N/A",
      patient_mobile: profile.phone || "N/A",
      patient_email: profile.email || "N/A",
      patient_address: patientAddress,
      doctor_name: "Dr. Chudasama Dharaba Ganpathsinh",
      doctor_reg_no: "2019042246",
      consultation_date: now.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      consultation_amount: consultationAmt,
      assessment_amount: assessmentAmt,
      treatment_amount: treatmentAmt,
      prescription_amount: prescriptionAmt,
      medical_services_total: Math.round(servicesTotal * 100) / 100,
      medicines_total: 0,
      shipping: 0,
      discount: discountRupees,
      tax: taxAmount,
      grand_total: grandTotalRupees,
      doctor_notes: "Patient has been evaluated and prescribed a personalized treatment plan. Follow-up scheduled as per protocol.",
    };

    const invoiceHtml = generateInvoiceHtml(invoiceData, `${origin}/logo.jpeg`);

    try {
      const { data: paymentRecord, error: fetchPaymentError } = await supabaseAdmin
        .from("payments")
        .select("order_id")
        .eq("provider_order_id", rzpOrderId)
        .single();

      if (fetchPaymentError || !paymentRecord) {
        console.error("Failed to find order for payment rzpOrderId:", rzpOrderId, fetchPaymentError);
      } else {
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            invoice_no: invoiceNo,
          })
          .eq("id", paymentRecord.order_id);

        if (updateError) {
          console.error("Failed to update order with invoice info:", updateError);
        }

        // --- Stock Deduction Logic ---
        const { data: orderItems, error: itemsError } = await supabaseAdmin
          .from("order_items")
          .select("item_name, quantity, item_type")
          .eq("order_id", paymentRecord.order_id);
          
        if (!itemsError && orderItems) {
          for (const item of orderItems) {
            if (item.item_type === "product") {
              const { data: inventoryItem } = await supabaseAdmin
                .from("inventory")
                .select("id, stock_quantity")
                .eq("name", item.item_name)
                .single();
                
              if (inventoryItem) {
                const newStock = Math.max(0, (inventoryItem.stock_quantity || 0) - (item.quantity || 1));
                const { error: stockUpdateError } = await supabaseAdmin
                  .from("inventory")
                  .update({ stock_quantity: newStock })
                  .eq("id", inventoryItem.id);
                  
                if (stockUpdateError) {
                  console.error(`Failed to update stock for ${item.item_name}:`, stockUpdateError);
                } else {
                  console.log(`Stock updated for ${item.item_name}: ${inventoryItem.stock_quantity} -> ${newStock}`);
                }
              }
            }
          }
        }
        // --- End Stock Deduction Logic ---
      }
    } catch (updateErr) {
      console.error("Failed to update order with invoice info:", updateErr);
    }

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const emailHtml = `
        <p>Dear ${profile.name || "Patient"},</p>
        <p>Thank you for your payment for the <strong>${planName || "Medical"}</strong> plan.</p>
        <p>Your invoice is attached below. Please keep it for your records.</p>
        <br/>
        ${invoiceHtml}
        <br/>
        <p>If you have any questions, feel free to reach out to us at support@genestac.com</p>
        <p>Warm regards,<br/>Genestac Therapeutics Team</p>
      `;

      const sendResp = await resend.emails.send({
        from: resendFrom,
        to: [profile.email],
        subject: `Invoice ${invoiceNo} - Genestac Payment Confirmation`,
        html: emailHtml,
        headers: {
          "X-Entity-Ref-ID": invoiceNo,
        },
      });

      console.log("Invoice email sent:", sendResp);
    } else {
      console.warn("RESEND_API_KEY not set — invoice email not sent");
    }

    return NextResponse.json({
      success: true,
      invoiceNo,
      message: resendApiKey
        ? "Payment recorded and invoice sent successfully"
        : "Payment recorded. Email not sent (RESEND_API_KEY not configured).",
    });
  } catch (error: any) {
    console.error("Payment completion error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}