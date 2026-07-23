import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment gateway is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.",
        },
        { status: 503 },
      );
    }

    const data = await request.json();
    const {
      userId,
      originalAmount, // in rupees
      discountAmount, // in rupees
      taxAmount,      // in rupees
      grandTotal,     // in rupees
      shippingAddressId, // uuid from user_addresses
      items           // array of { item_type, item_name, quantity, unit_price, total_price }
    } = data;

    if (!userId || !grandTotal || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required order details (userId, grandTotal, items)" },
        { status: 400 },
      );
    }

    // Step 1: Create the Order (lightweight record first)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        original_amount: originalAmount || grandTotal,
        discount_amount: discountAmount || 0,
        tax_amount: taxAmount || 0,
        grand_total: grandTotal,
        shipping_address_id: shippingAddressId || null,
        status: "pending",
        payment_status: "unpaid"
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { success: false, message: "Failed to create order record: " + (orderError?.message || "Unknown error") },
        { status: 500 }
      );
    }

    // Step 2: Create Order Items + medical service breakdown for invoice
    const orderItemsPayload: any[] = [];

    for (const item of items) {
      // Add the main plan item
      orderItemsPayload.push({
        order_id: order.id,
        item_type: item.item_type || "plan",
        item_name: item.item_name,
        quantity: item.quantity || 1,
        unit_price: item.unit_price,
        total_price: item.total_price
      });

      // For plan items, add medical service breakdown so the invoice can read them from order_items
      if ((item.item_type || "plan") === "plan") {
        const baseAmount = item.unit_price || grandTotal; // plan base price in rupees
        const servicesTotal = baseAmount; // services total is the plan's pre-GST unit price
        const consultationAmt = Math.round(servicesTotal * 0.4 * 100) / 100;
        const assessmentAmt   = Math.round(servicesTotal * 0.25 * 100) / 100;
        const treatmentAmt    = Math.round(servicesTotal * 0.2 * 100) / 100;
        const prescriptionAmt = Math.round((servicesTotal - consultationAmt - assessmentAmt - treatmentAmt) * 100) / 100;

        orderItemsPayload.push(
          { order_id: order.id, item_type: "consultation", item_name: "Online Medical Consultation",         quantity: 1, unit_price: consultationAmt, total_price: consultationAmt },
          { order_id: order.id, item_type: "assessment",   item_name: "Clinical Health Assessment",          quantity: 1, unit_price: assessmentAmt,   total_price: assessmentAmt   },
          { order_id: order.id, item_type: "treatment",    item_name: "Personalized Treatment Plan",         quantity: 1, unit_price: treatmentAmt,    total_price: treatmentAmt    },
          { order_id: order.id, item_type: "prescription", item_name: "Prescription Coordination & Support", quantity: 1, unit_price: prescriptionAmt, total_price: prescriptionAmt }
        );
      }
    }

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Attempt clean up of order if items fail
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { success: false, message: "Failed to create order items: " + itemsError.message },
        { status: 500 }
      );
    }

    // Step 3: Initialize Razorpay Payment
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100), // in paise for Razorpay
      currency: "INR",
      receipt: `receipt_order_${order.id.slice(-8)}`,
      payment_capture: 1,
    });

    // Step 4: Record the Payment Attempt
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        order_id: order.id,
        user_id: userId,
        provider: "razorpay",
        provider_order_id: razorpayOrder.id,
        amount: grandTotal,
        status: "pending"
      });

    if (paymentError) {
      console.error("Error recording payment attempt:", paymentError);
      // Don't fail the checkout but log it; the client will continue to Razorpay
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
      dbOrderId: order.id,
    });
  } catch (error: any) {
    console.error("Error in checkout API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
