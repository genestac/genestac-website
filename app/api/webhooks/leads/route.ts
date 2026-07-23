import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cleanPhone = body.phone ? body.phone.replace(/^p:/, "") : "";

    const { error } = await supabase.from("leads").insert({
      name: body.name,
      email: body.email || null,
      phone_number: cleanPhone,
      source: "Meta Ads",
      status: "NEW",
      metadata: {
        city: body.city || null,
        age: body.age || null,
        current_weight: body.current_weight || null,
        weight_loss_goal: body.weight_loss_goal || null,
        how_old_are_you: body.how_old_are_you || null,
        what_is_your_current_weight: body.what_is_your_current_weight || null,
        ad_name: body.ad_name || null,
        campaign_name: body.campaign_name || null,
      },
    });

    if (error) {
      console.error("CRM Webhook Error:", error);
      return NextResponse.json({ error: "Failed to insert lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CRM Webhook Error:", error);
    return NextResponse.json({ error: "Failed to insert lead" }, { status: 500 });
  }
}
