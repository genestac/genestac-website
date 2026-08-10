import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "Genestac <noreply@genestac.com>";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // 1. Sanitize & Clean inputs
    const rawEmail = (email || "").toString();
    const rawPhone = (phone || "").toString();
    const rawName = (name || "").toString();
    const rawPassword = (password || "").toString();

    // Remove ALL whitespace from email (leading, trailing, and internal accidental spaces)
    const cleanEmail = rawEmail.replace(/\s+/g, "").toLowerCase();

    // Remove ALL non-digit characters from phone number
    const cleanPhone = rawPhone.replace(/\D/g, "");

    // Trim name and collapse multiple spaces between words into a single space
    const cleanName = rawName.trim().replace(/\s+/g, " ");

    // Trim password
    const cleanPassword = rawPassword.trim();

    // 2. Field Validation Checks
    if (!cleanName) {
      return NextResponse.json(
        { error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address (e.g. user@example.com)." },
        { status: 400 }
      );
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check if user already exists in public.users
    const { data: existingUser } = await admin
      .from("users")
      .select("id, email, phone")
      .or(`email.eq.${cleanEmail},phone.eq.${cleanPhone}`)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or phone number is already registered. Please login instead." },
        { status: 409 }
      );
    }

    // 2. Attempt auth user creation or generate ID fallback
    let authUserId: string | null = null;

    try {
      const { data: authData } = await admin.auth.admin.createUser({
        email: cleanEmail,
        password: cleanPassword,
        email_confirm: true,
        user_metadata: { full_name: cleanName, phone: cleanPhone }
      });
      if (authData?.user?.id) {
        authUserId = authData.user.id;
      }
    } catch (e) {
      console.warn("auth.admin.createUser warning:", e);
    }

    if (!authUserId) {
      authUserId = crypto.randomUUID();
    }

    // 3. Upsert user record in public.users table
    const { data: userRow, error: insertError } = await admin
      .from("users")
      .upsert({
        id: authUserId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        status: "NEW",
        metadata: {
          role: "customer"
        }
      })
      .select("id, name, email, phone")
      .single();

    if (insertError) {
      console.error("Failed to insert user row:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Failed to create user profile" },
        { status: 500 }
      );
    }

    // 4. Generate OTP and save to metadata
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await admin
      .from("users")
      .update({
        metadata: {
          role: "customer",
          otp,
          otp_expires_at: expiresAt,
        },
      })
      .eq("id", authUserId);

    // 5. Try sending OTP email via Resend
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const resendRes = await resend.emails.send({
          from: resendFrom,
          to: [cleanEmail],
          subject: "Your Genestac Account Verification Code",
          html: `
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your Genestac account</title>
</head>
<body style="margin:0; padding:0; background:#eef4f7; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4f7; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:22px; overflow:hidden; box-shadow:0 12px 35px rgba(0,31,63,0.12);">
          <tr>
            <td style="height:6px; background:linear-gradient(90deg,#001f3f,#10b981);"></td>
          </tr>
          <tr>
            <td style="padding:32px 32px 18px; text-align:center;">
              <img src="https://genestac.com/logo2.png" alt="Genestac Therapeutics" width="150" style="display:block; margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 34px;">
              <h1 style="color:#001f3f; font-size:26px; line-height:1.3; margin:0 0 14px; text-align:center;">
                Verify your email
              </h1>
              <p style="font-size:15px; color:#425466; line-height:1.7; margin:0 0 26px; text-align:center;">
                Welcome to Genestac, ${cleanName}. Please enter the verification code below to activate your account.
              </p>
              <div style="background:linear-gradient(135deg,#ecfdf5,#f8fafc); border:1px solid #10b981; border-radius:18px; padding:26px 18px; text-align:center; margin:28px 0;">
                <div style="font-size:12px; text-transform:uppercase; letter-spacing:1.6px; color:#10b981; font-weight:700; margin-bottom:10px;">
                  Verification Code
                </div>
                <div style="font-size:38px; font-weight:900; letter-spacing:10px; color:#001f3f;">
                  ${otp}
                </div>
              </div>
              <p style="font-size:14px; color:#000000; line-height:1.6; margin:0 0 10px; text-align:center;">
                This code will expire in <strong style="color:#001f3f;">10 minutes</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        });
        if (resendRes.error) {
          console.error("Resend send error:", resendRes.error);
        }
      } catch (emailErr) {
        console.error("Resend throw error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      userId: authUserId,
      email: cleanEmail,
      message: "Account created successfully.",
    });

  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
