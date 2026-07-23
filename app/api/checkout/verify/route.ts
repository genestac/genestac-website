import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, couponId } = data;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: "Missing payment details" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!process.env.RAZORPAY_KEY_ID || !keySecret) {
      return NextResponse.json(
        { success: false, message: "Payment gateway is not configured." },
        { status: 503 }
      );
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Signature mismatch" }, { status: 400 });
    }

    // Payment is verified; update database records
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json({ success: false, message: "Server configuration key is missing." }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      serviceRoleKey,
      { auth: { persistSession: false } }
    );

    // 1. Get order_id from payments table
    const { data: paymentRecord, error: fetchPaymentError } = await supabaseAdmin
      .from("payments")
      .select("order_id")
      .eq("provider_order_id", razorpay_order_id)
      .single();

    if (fetchPaymentError || !paymentRecord) {
      console.error("Failed to find payment record for order:", razorpay_order_id, fetchPaymentError);
      return NextResponse.json({ success: false, message: "Payment record not found in database" }, { status: 404 });
    }

    // 2. Update the payments table
    const { error: paymentUpdateError } = await supabaseAdmin
      .from("payments")
      .update({
        provider_payment_id: razorpay_payment_id,
        status: "successful"
      })
      .eq("provider_order_id", razorpay_order_id);

    if (paymentUpdateError) {
      console.error("Failed to update payment status:", paymentUpdateError);
    }

    // 3. Update the orders table
    const { error: orderUpdateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed"
      })
      .eq("id", paymentRecord.order_id);

    if (orderUpdateError) {
      console.error("Failed to update order status:", orderUpdateError);
    }

    // 4. Increment Coupon Usage if a coupon was used
    if (couponId) {
      const { data: coupon, error: fetchError } = await supabaseAdmin
        .from("coupons")
        .select("usage_count")
        .eq("id", couponId)
        .single();

      if (coupon && !fetchError) {
        await supabaseAdmin
          .from("coupons")
          .update({ usage_count: (coupon.usage_count || 0) + 1 })
          .eq("id", couponId);
      } else {
        console.error("Failed to fetch coupon for increment:", fetchError);
      }
    }

    return NextResponse.json({ success: true, orderId: razorpay_order_id });
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
