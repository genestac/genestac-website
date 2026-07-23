import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();

    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanPhone = phone ? phone.replace(/\D/g, "") : null;

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json({ found: false });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    let query = admin.from("users").select("id, name, email, phone, metadata");

    if (cleanEmail && cleanPhone) {
      query = query.or(`email.eq.${cleanEmail},phone.eq.${cleanPhone}`);
    } else if (cleanEmail) {
      query = query.eq("email", cleanEmail);
    } else {
      query = query.eq("phone", cleanPhone as string);
    }

    const { data, error } = await query.limit(1);

    if (error) {
      console.error("check-user error:", error);
      return NextResponse.json({ found: false });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({ found: true, user: data[0] });
  } catch (err) {
    console.error("check-user route error:", err);
    return NextResponse.json({ found: false });
  }
}