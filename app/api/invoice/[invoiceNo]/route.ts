import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateInvoiceHtml, type InvoiceData } from "@/lib/invoice";
import Razorpay from "razorpay";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceNo: string }> },
) {
  try {
    const { invoiceNo } = await params;
    const origin = new URL(request.url).origin;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("invoice_no", invoiceNo)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 },
      );
    }

    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("order_id", order.id)
      .single();

    const { data: orderItems } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    const { data: profile, error: profileError } = await supabaseAdmin
  .from("users")
  .select("*")
  .eq("id", order.user_id)
  .single();

if (profileError || !profile) {
  return NextResponse.json(
    { success: false, message: "Patient profile not found" },
    { status: 404 },
  );
}

// Fetch shipping/default address from the addresses table
const { data: address, error: addressError } = await supabaseAdmin
  .from("addresses")
  .select("*")
  .eq("user_id", order.user_id)
  .order("is_default", { ascending: false })
  .order("created_at", { ascending: false })
  .limit(1)
  .single();

if (addressError) {
  console.error("Invoice: failed to fetch address for user:", order.user_id, addressError);
}

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

    const now = new Date(order.created_at);
    const grandTotalRupees = order.grand_total;
    const discountRupees = order.discount_amount || 0;
    const taxAmount = order.tax_amount || 0;
    const servicesTotal = order.original_amount - discountRupees;

    const consultationItem = orderItems?.find((i) => i.item_type === "consultation");
    const assessmentItem = orderItems?.find((i) => i.item_type === "assessment");
    const treatmentItem = orderItems?.find((i) => i.item_type === "treatment");
    const prescriptionItem = orderItems?.find((i) => i.item_type === "prescription");

    const consultationAmt = consultationItem 
      ? consultationItem.unit_price 
      : Math.round(servicesTotal * 0.4 * 100) / 100;
    const assessmentAmt = assessmentItem 
      ? assessmentItem.unit_price 
      : Math.round(servicesTotal * 0.25 * 100) / 100;
    const treatmentAmt = treatmentItem 
      ? treatmentItem.unit_price 
      : Math.round(servicesTotal * 0.2 * 100) / 100;
    const prescriptionAmt = prescriptionItem 
      ? prescriptionItem.unit_price 
      : Math.round((servicesTotal - consultationAmt - assessmentAmt - treatmentAmt) * 100) / 100;

    let paymentMethodStr = "Razorpay";
    try {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keyId && keySecret && payment?.provider_payment_id) {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const paymentDetails = await razorpay.payments.fetch(payment.provider_payment_id);
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
      order_id: payment?.provider_order_id || order.id || "N/A",
      patient_id: order.user_id?.slice(0, 12) || "N/A",
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

    return new NextResponse(invoiceHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Invoice fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
