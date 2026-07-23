import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

      // TODO: Update Supabase / database here
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      console.log("Payment failed:", {
        paymentId: payment.id,
        amount: payment.amount,
        contact: payment.contact,
        status: payment.status,
      });

      // TODO: Mark payment failed in database
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