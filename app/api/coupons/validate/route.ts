import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { code, planId, variantId }: { code: string; planId: string; variantId?: string } = await request.json();
    const normalizedCode = code.trim().toUpperCase();

    if (!code || !planId) {
      return NextResponse.json(
        { success: false, message: "Coupon code and plan ID are required." },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("coupon_code", normalizedCode)
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid or non-existent coupon code." },
        { status: 200 },
      );
    }

    if (coupon.max_uses !== null && coupon.usage_count >= coupon.max_uses) {
      return NextResponse.json(
        { success: false, message: "This coupon has reached its maximum usage limit." },
        { status: 200 },
      );
    }

    const now = new Date();
    const startDate = new Date(coupon.start_date);
    if (now < startDate) {
      return NextResponse.json(
        { success: false, message: "This coupon is not active yet." },
        { status: 200 },
      );
    }
    if (coupon.end_date) {
      const endDate = new Date(coupon.end_date);
      if (now > endDate) {
        return NextResponse.json(
          { success: false, message: "This coupon has expired." },
          { status: 200 },
        );
      }
    }

    const planDiscounts = coupon.plan_discounts || {};

    let discountPercentage: number | undefined;

    if (variantId && planDiscounts[variantId]) {
      discountPercentage = planDiscounts[variantId];
    } else if (planDiscounts[planId]) {
      discountPercentage = planDiscounts[planId];
    } else {
      const { data: variants } = await supabase
        .from("plan_variants")
        .select("id")
        .eq("plan_id", planId);

      const matchedVariant = variants?.find((v) => planDiscounts[v.id]);
      if (matchedVariant) {
        discountPercentage = planDiscounts[matchedVariant.id];
      }
    }

    if (!discountPercentage || discountPercentage <= 0) {
      return NextResponse.json(
        { success: false, message: "This coupon is not valid for the selected plan." },
        { status: 200 },
      );
    }

    return NextResponse.json({
      success: true,
      percentage: discountPercentage,
      couponId: coupon.id,
      code: normalizedCode,
    });
  } catch (err) {
    console.error("Coupon validate error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to validate coupon." },
      { status: 500 },
    );
  }
}
