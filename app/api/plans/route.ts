import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mapDbPlanToPlan } from "@/lib/plans";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 },
      );
    }

    const hasValidServiceRole =
      Boolean(serviceRoleKey) && serviceRoleKey !== "placeholder";

    const client = createClient(
      supabaseUrl,
      hasValidServiceRole ? serviceRoleKey! : anonKey,
      { auth: { persistSession: false } },
    );

    const { data, error } = await client
      .from("plans")
      .select(`
        *,
        plan_variants (
          id,
          plan_id,
          duration_label,
          duration_days,
          base_price,
          discounted_price,
          discount_text,
          discount_end_date,
          is_active
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch plans:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json((data ?? []).map(mapDbPlanToPlan));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load plans.";
    console.error("Unexpected plans API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
