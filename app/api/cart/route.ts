import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getClient(useServiceRole = false) {
  const key = useServiceRole && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey;
  return createClient(supabaseUrl, key);
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = getClient(true);
    const { data, error } = await admin
      .from("cart")
      .select("plan_id, added_at, plans(name, cart_name, price, is_entry_level, gst_percentage)")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Cart fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId }: { planId: string } = body;

    if (!planId) {
      return NextResponse.json({ error: "planId is required" }, { status: 400 });
    }

    const admin = getClient(true);

    const { error: deleteError } = await admin
      .from("cart")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Cart clear error:", deleteError);
    }

    const { data, error } = await admin
      .from("cart")
      .insert({ user_id: user.id, plan_id: planId })
      .select()
      .single();

    if (error) {
      console.error("Cart insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    const admin = getClient(true);
    let query = admin.from("cart").delete().eq("user_id", user.id);

    if (planId) {
      query = query.eq("plan_id", planId);
    }

    const { error } = await query;

    if (error) {
      console.error("Cart delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cart DELETE error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
