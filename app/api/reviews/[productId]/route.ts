import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  // Fetch approved reviews for this product
  const { data: reviews, error } = await supabase
    .from("product_reviews")
    .select("id, created_at, reviewer_name, rating, title, body, verified_purchase, helpful_count")
    .eq("inventory_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const list = reviews || [];

  // Compute aggregate stats
  const total_count = list.length;
  const avg_rating =
    total_count > 0
      ? Math.round((list.reduce((sum, r) => sum + r.rating, 0) / total_count) * 10) / 10
      : 0;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  list.forEach((r) => { distribution[r.rating] = (distribution[r.rating] || 0) + 1; });

  return NextResponse.json({ reviews: list, avg_rating, total_count, distribution });
}
