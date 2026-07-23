import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      user_id,
      fullName,
      email,
      phone,
      age,
      gender,
      height,
      weight,
      location,
      goals,
      diabetes,
      highBP,
      thyroid,
      consent,
    } = data;

    if (!user_id || !fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "User, name, email, and phone are required" },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { success: false, error: "Consent is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const cleanEmail = email.trim().toLowerCase();

    // ✅ Check if this user already has a submission
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("health_assessments")
      .select("id")
      .eq("user_id", user_id)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      console.error("Error checking existing assessment:", existingError);
      return NextResponse.json(
        { success: false, error: "Failed to check existing intake" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          error: "You've already completed your health assessment.",
        },
        { status: 409 }
      );
    }

    const { error: assessmentError } = await supabaseAdmin
      .from("health_assessments")
      .insert({
        user_id,
        full_name: fullName.trim(),
        email: cleanEmail,
        phone: cleanPhone,

        age: Number(age),
        gender,
        height_cm: Number(height),
        weight_kg: Number(weight),
        city: location,

        health_goals: goals || [],
        diabetes,
        high_blood_pressure: highBP,
        thyroid_disorder: thyroid,
        consent_given: consent,

        status: "SUBMITTED",
      });

    if (assessmentError) {
      console.error("Health assessment insert error:", assessmentError);
      return NextResponse.json(
        { success: false, error: "Failed to save health assessment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Health assessment saved successfully.",
    });
  } catch (error) {
    console.error("Error in intake API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}