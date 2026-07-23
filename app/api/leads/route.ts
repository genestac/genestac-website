import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { name, email, phone, condition, source } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.rpc("submit_lead", {
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_condition: condition || null,
      p_source: source || "website_form",
    });

    if (error) {
      console.error("Lead submit error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to submit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in leads API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}