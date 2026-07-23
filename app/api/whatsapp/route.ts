import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppAgentReply } from "@/lib/whatsappFlow";
import { sendWhatsAppMessage, normalizePhoneNumber } from "@/lib/whatsapp";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const challenge = url.searchParams.get("hub.challenge");
  const token = url.searchParams.get("hub.verify_token");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message || !message.from) {
      return NextResponse.json({ success: true });
    }

    const userText = message.text?.body || message.button?.payload || "";
    if (!userText) {
      return NextResponse.json({ success: true });
    }

    const reply = await getWhatsAppAgentReply(userText, message.from);
    const sanitizedPhone = normalizePhoneNumber(message.from);

    await sendWhatsAppMessage(sanitizedPhone, reply);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ success: false, error: "Webhook processing failed." }, { status: 500 });
  }
}
