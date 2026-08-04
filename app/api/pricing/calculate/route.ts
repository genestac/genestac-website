import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const {
      planId,
      variantId,
      discountPercentage,
    }: {
      planId: string;
      variantId?: string;
      discountPercentage?: number;
    } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { success: false, message: "planId is required." },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: plan, error } = await supabase
      .from("plans")
      .select("id, price, gst_percentage")
      .eq("id", planId)
      .single();

    if (error || !plan) {
      return NextResponse.json(
        { success: false, message: "Plan not found." },
        { status: 404 },
      );
    }

    const gstPercentage = Number(plan.gst_percentage) || 0;
    let basePrice = Number(plan.price);

    if (variantId) {
      const { data: variant } = await supabase
        .from("plan_variants")
        .select("base_price, discounted_price, discount_end_date")
        .eq("id", variantId)
        .single();

      if (variant) {
        const isDiscountActive =
          variant.discounted_price !== null &&
          variant.discounted_price !== undefined &&
          (!variant.discount_end_date || new Date(variant.discount_end_date) > new Date());
        basePrice = isDiscountActive
          ? Number(variant.discounted_price)
          : Number(variant.base_price);
      }
    }

    if (discountPercentage && discountPercentage > 0) {
      basePrice = basePrice - basePrice * (discountPercentage / 100);
    }

    const gstAmount = Math.round(basePrice * (gstPercentage / 100) * 100) / 100;
    const finalTotal = Math.round((basePrice + gstAmount) * 100) / 100;

    return NextResponse.json({
      success: true,
      basePrice,
      gstPercentage,
      gstAmount,
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
