import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SYSTEM_PROMPT = `You are a helpful, friendly health consultant assistant for Genestac Therapeutics — a premium regenerative medicine and medical weight loss clinic based in Gurugram, India.

Your role:
- Answer questions about Genestac's services: Doctor-Guided Weight Loss (GLP-1 programs), Regenerative Medicine, Stem Cell Therapy, PRP, Pain Management, and Longevity Protocols.
- Help users understand eligibility, pricing plans (Starter: ₹4,999/mo, Medical: ₹12,999/mo avg, Premium: ₹29,999/mo), and treatment processes.
- Encourage users to book a free consultation or check eligibility using the website's "Check Eligibility" button.
- Be concise, warm, professional, and supportive. Never give specific medical diagnoses.
- If you don't know something specific, direct users to contact the clinic directly.
- Always remind users that treatments are supervised by qualified medical professionals.

Keep responses short (2-4 sentences max) unless the user asks for detailed information.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, visitorId } = await req.json();

    const apiKey = process.env.NVIDIA_KEY;
    if (!apiKey) {
      console.warn("NVIDIA_KEY not configured. Using simulated fallback response.");
      const fallbackReply = "This is a simulated assistant response because NVIDIA_KEY is not configured. Our weight loss packages start from ₹4,999/month. Please complete the eligibility form or book a free consultation to get started!";
      
      // Save conversation exchange to Supabase database
      if (visitorId) {
        try {
          await supabase.from("conversations").insert([
            {
              phone: visitorId,
              user_message: messages[messages.length - 1]?.content || null,
              bot_reply: fallbackReply,
            },
          ]);
        } catch (dbError) {
          console.error("Failed to save conversation to Supabase:", dbError);
        }
      }
      return NextResponse.json({ reply: fallbackReply });
    }

    // Build OpenAI-compatible conversation history for Nvidia NIM
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      }))
    ];

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 400,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Nvidia API error:", err);
      return NextResponse.json({ error: "Failed to get response from AI." }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    // Save conversation exchange to Supabase database
    if (visitorId) {
      try {
        await supabase.from("conversations").insert([
          {
            phone: visitorId,
            user_message: messages[messages.length - 1]?.content || null,
            bot_reply: text,
          },
        ]);
      } catch (dbError) {
        console.error("Failed to save conversation to Supabase:", dbError);
      }
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
