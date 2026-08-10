import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing Razorpay signature" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { success: false, message: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    console.log("Razorpay webhook received:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      console.log("Payment successful:", {
        paymentId: payment.id,
        amount: payment.amount,
        email: payment.email,
        contact: payment.contact,
        status: payment.status,
      });

      // Update Supabase / database here
      const razorpayOrderId = payment.order_id;
      if (razorpayOrderId) {
        // 1. Find payment in DB
        const { data: dbPayment } = await supabaseAdmin
          .from("payments")
          .select("order_id, user_id")
          .eq("provider_order_id", razorpayOrderId)
          .single();

        if (dbPayment && dbPayment.order_id) {
          const orderId = dbPayment.order_id;
          const userId = dbPayment.user_id;

          // 2. Update payment and order status
          await supabaseAdmin.from("payments").update({ status: "paid" }).eq("provider_order_id", razorpayOrderId);
          await supabaseAdmin.from("orders").update({ status: "confirmed", payment_status: "paid" }).eq("id", orderId);

          // 3. Fetch order items
          const { data: items } = await supabaseAdmin
            .from("order_items")
            .select("item_type, plan_id, variant_id")
            .eq("order_id", orderId);

          // 4. Auto-assign subscription
          if (items && items.length > 0) {
            for (const item of items) {
              if ((item.item_type === "plan" || !item.item_type) && item.plan_id) {
                // Check if user already has an active subscription
                const { data: existingSub } = await supabaseAdmin
                  .from("subscriptions")
                  .select("id")
                  .eq("user_id", userId)
                  .eq("plan_id", item.plan_id)
                  .eq("status", "active")
                  .single();

                if (!existingSub) {
                  // Find variant duration
                  let months = 1;
                  if (item.variant_id) {
                    const { data: variant } = await supabaseAdmin
                      .from("plan_variants")
                      .select("duration_months")
                      .eq("id", item.variant_id)
                      .single();
                    if (variant && variant.duration_months) {
                      months = variant.duration_months;
                    }
                  }

                  const startDate = new Date();
                  const endDate = new Date();
                  endDate.setMonth(endDate.getMonth() + months);

                  await supabaseAdmin.from("subscriptions").insert({
                    user_id: userId,
                    plan_id: item.plan_id,
                    start_date: startDate.toISOString().split("T")[0],
                    end_date: endDate.toISOString().split("T")[0],
                    status: "active"
                  });
                }
              }
            }
          }
        }
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      console.log("Payment failed:", {
        paymentId: payment.id,
        amount: payment.amount,
        contact: payment.contact,
        status: payment.status,
      });

      // Mark payment failed in database
      const razorpayOrderId = payment.order_id;
      if (razorpayOrderId) {
        await supabaseAdmin.from("payments").update({ status: "failed" }).eq("provider_order_id", razorpayOrderId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Webhook error" },
      { status: 500 }
    );
  }
}