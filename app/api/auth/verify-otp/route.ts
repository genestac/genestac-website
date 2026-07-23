import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;
const resendFrom = process.env.RESEND_FROM!;

export async function POST(request: Request) {
  try {
    const { userId, otp } = await request.json();
    if (!userId || !otp) {
      return NextResponse.json({ error: "userId and otp are required" }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: userRow, error: fetchError } = await admin
      .from("users")
      .select("metadata, name, email")
      .eq("id", userId)
      .single();

    if (fetchError || !userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const metadata = (userRow.metadata as Record<string, any>) || {};

    if (!metadata.otp || !metadata.otp_expires_at) {
      return NextResponse.json({ error: "No OTP requested. Please request a new code." }, { status: 400 });
    }

    if (new Date(metadata.otp_expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP has expired. Please request a new code." }, { status: 400 });
    }

    if (metadata.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    const { otp: _, otp_expires_at: __, ...restMetadata } = metadata;
    const { error: updateError } = await admin
      .from("users")
      .update({
        metadata: {
          ...restMetadata,
          email_verified: true,
          email_verified_at: new Date().toISOString(),
        },
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update verification status:", updateError);
      return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }

    const userName = userRow.name || "there";
    const userEmail = userRow.email;

    if (resendApiKey && userEmail) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: resendFrom,
          to: [userEmail],
          subject: "Welcome to Genestac — Your Account is Registered!",
          html: `
           <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Genestac</title>
</head>

<body style="margin:0; padding:0; background:#eef4f7; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4f7; padding:40px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px; background:#ffffff; border-radius:22px; overflow:hidden; box-shadow:0 14px 40px rgba(0,31,63,0.14);">

          <!-- Top Accent -->
          <tr>
            <td style="height:6px; background:linear-gradient(90deg,#001f3f,#10b981);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:34px 32px 18px; text-align:center;">
              <img src="https://genestac.com/logo2.png" alt="Genestac Therapeutics" width="150" style="display:block; margin:0 auto 20px;" />

              <h1 style="color:#001f3f; font-size:28px; line-height:1.3; margin:0;">
                Welcome to Genestac, ${userName}
              </h1>

              <p style="font-size:15px; color:#10b981; font-weight:700; margin:10px 0 0;">
                Your account has been created successfully.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px 36px 36px;">

              <p style="font-size:15px; color:#425466; line-height:1.7; margin:0 0 26px; text-align:center;">
                We're glad to have you with us. Your Genestac account is now active and ready to use.
              </p>

              <!-- Feature Box -->
              <div style="background:linear-gradient(135deg,#ecfdf5,#f8fafc); border:1px solid #d1fae5; border-radius:18px; padding:24px; margin:0 0 28px;">
                <p style="font-size:15px; color:#001f3f; margin:0 0 14px; font-weight:800;">
                  You now have access to:
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:14px; color:#425466; padding:8px 0;">✓ Personalized wellness plans</td>
                  </tr>
                  <tr>
                    <td style="font-size:14px; color:#425466; padding:8px 0;">✓ Doctor-guided restorative care</td>
                  </tr>
                  <tr>
                    <td style="font-size:14px; color:#425466; padding:8px 0;">✓ Health dashboard & progress tracking</td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <div style="text-align:center; margin:0 0 30px;">
                <a href="https://genestac.com" style="display:inline-block; background:#001f3f; color:#ffffff; font-weight:700; font-size:14px; padding:15px 34px; border-radius:14px; text-decoration:none; box-shadow:0 8px 18px rgba(0,31,63,0.18);">
                  Visit our website
                </a>
              </div>

              <p style="font-size:14px; color:#64748b; line-height:1.6; text-align:center; margin:0;">
                Warmly,<br />
                <strong style="color:#001f3f;">The Genestac Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; padding:22px 32px; text-align:center; border-top:1px solid #e5e7eb;">
              <p style="font-size:12px; color:#000000; margin:0 0 6px;">
                © ${new Date().getFullYear()} Genestac. All rights reserved.
              </p>

              <p style="font-size:12px; color:#000000; margin:0;">
                This is an automated message. Please do not reply.
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
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: err.message || "Failed to verify OTP" }, { status: 500 });
  }
}
