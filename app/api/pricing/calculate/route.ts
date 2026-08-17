import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const {
      items,
      discountPercentage = 0,
    }: {
      items: any[];
      discountPercentage?: number;
    } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: true, basePrice: 0, gstPercentage: 0, gstAmount: 0, finalTotal: 0 },
        { status: 200 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let totalBasePrice = 0;
    let totalGstAmount = 0;

    for (const item of items) {
      let itemBasePrice = Number(item.price || 0);
      let itemGstPercentage = 0;

      // If it's a plan, fetch its specific details and GST
      if (item.category === "plan" && item.planId) {
        const { data: plan } = await supabase
          .from("plans")
          .select("price, gst_percentage")
          .eq("id", item.planId)
          .single();

        if (plan) {
          itemGstPercentage = Number(plan.gst_percentage) || 0;
          // Note: we trust the client's `price` or we could override with `plan.price`
          // Let's use the DB price for plans
          itemBasePrice = Number(plan.price);
        }
      }
      
      // Calculate item total for its quantity
      const itemQty = Number(item.qty || 1);
      const itemTotalBase = itemBasePrice * itemQty;
      
      totalBasePrice += itemTotalBase;
      totalGstAmount += itemTotalBase * (itemGstPercentage / 100);
    }

    if (discountPercentage > 0) {
      const discountMult = 1 - (discountPercentage / 100);
      totalBasePrice = totalBasePrice * discountMult;
      totalGstAmount = totalGstAmount * discountMult;
    }

    const finalTotal = Math.round((totalBasePrice + totalGstAmount) * 100) / 100;
    totalGstAmount = Math.round(totalGstAmount * 100) / 100;
    totalBasePrice = Math.round(totalBasePrice * 100) / 100;

    return NextResponse.json({
      success: true,
      basePrice: totalBasePrice,
      gstPercentage: totalBasePrice > 0 ? Math.round((totalGstAmount / totalBasePrice) * 100) : 0,
      gstAmount: totalGstAmount,
      finalTotal,
    });
  } catch (err) {
    console.error("Pricing calculate error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to calculate pricing." },
      { status: 500 },
    );
  }
}
