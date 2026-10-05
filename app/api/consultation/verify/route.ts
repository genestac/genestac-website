import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      name,
      email,
      phone,
      condition,
      date,
      time,
    } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature." },
        { status: 400 }
      );
    }

    // Save the consultation booking to CRM (consultations table, fallback to leads)
    try {
      // 1. Save to leads as a backup
      await supabaseAdmin.from("leads").insert({
        full_name: name,
        email: email.toLowerCase(),
        phone_number: phone,
        lead_status: "consultation_booked",
        notes: `Condition: ${condition} | Date: ${date || "TBD"} | Time: ${time || "TBD"} | Payment: ${razorpay_payment_id}`,
        source: "consultation_booking",
      });

      // 2. Parse date and time into ISO timestamp
      let scheduled_at = new Date().toISOString();
      if (date && time) {
        try {
          const [timeStr, modifier] = time.split(" ");
          let [hours, minutes] = timeStr.split(":");
          let h = parseInt(hours, 10);
          if (modifier === "PM" && h !== 12) h += 12;
          if (modifier === "AM" && h === 12) h = 0;
          
          // Construct ISO string for IST (+05:30)
          scheduled_at = `${date}T${h.toString().padStart(2, '0')}:${minutes}:00+05:30`;
        } catch (e) {
          console.error("Time parsing error", e);
        }
      }

      // 3. Create the appointment
      await supabaseAdmin.from("appointments").insert({
        doctor_id: "e6c8047a-2bec-4b8c-bb55-dc9bffa4ec5f",
        scheduled_at: scheduled_at,
        duration_minutes: 20,
        status: "pending",
        title: `Consultation - ${name}`,
        type: "Consultation",
        related_to: condition,
        notes: `Patient: ${name}\nPhone: ${phone}\nEmail: ${email}\nCondition: ${condition}\nPayment ID: ${razorpay_payment_id}`
      });

    } catch (dbErr) {
      console.error("DB insert error:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Consultation verify error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
