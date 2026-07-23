import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { initializeWhatsAppSession } from "@/lib/whatsappFlow";

const WHATSAPP_MESSAGE =
  "Welcome to Genestac. We provide a doctor-guided medical weight loss program, where prescription based therapies such as GLP-1 may be considered only after doctor evaluation.\n\nTo get started, please share your age, height, weight, current medicines, and any major health conditions such as diabetes, thyroid disease, pancreatitis, kidney disease, or fatty liver.";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log details for debugging/backend integration
    console.log("New Enquiry Submitted:", data);

    // Save lead to Supabase database
    const { error: dbError } = await supabase.from("quick_enquiries").insert([
      {
        full_name: data.name,
        email: data.email,
        phone_number: data.phone,
        message: data.message,
      },
    ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to save enquiry" },
        { status: 500 }
      );
    }

    let whatsappSent = false;
    try {
      await initializeWhatsAppSession(data.phone, "ELIGIBILITY_PROMPTED");
      await sendWhatsAppMessage(data.phone, WHATSAPP_MESSAGE);
      whatsappSent = true;
    } catch (error) {
      console.error("WhatsApp notification error:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully.",
      whatsappSent,
    });
  } catch (error) {
    console.error("Error in enquiry API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
