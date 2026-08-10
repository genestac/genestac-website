import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;
const resendFrom = process.env.RESEND_FROM!;

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();
    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 },
      );
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: userRow } = await admin
      .from("users")
      .select("metadata")
      .eq("id", userId)
      .single();

    const currentMetadata = (userRow?.metadata as Record<string, any>) || {};

    if (
      currentMetadata.otp &&
      currentMetadata.otp_expires_at &&
      new Date(currentMetadata.otp_expires_at) > new Date()
    ) {
      return NextResponse.json({ success: true, message: "OTP already sent" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

    const { error: updateError } = await admin
      .from("users")
      .update({
        metadata: {
          ...currentMetadata,
          otp,
          otp_expires_at: expiresAt,
        },
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to store OTP:", updateError);
      return NextResponse.json(
        { error: "Failed to store OTP" },
        { status: 500 },
      );
    }

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const resendRes = await resend.emails.send({
          from: resendFrom,
          to: [email],
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

          <!-- Top Accent -->
          <tr>
            <td style="height:6px; background:linear-gradient(90deg,#001f3f,#10b981);"></td>
          </tr>

          <!-- Logo -->
          <tr>
            <td style="padding:32px 32px 18px; text-align:center;">
              <img src="https://genestac.com/logo2.png" alt="Genestac Therapeutics" width="150" style="display:block; margin:0 auto;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 36px 34px;">
              <h1 style="color:#001f3f; font-size:26px; line-height:1.3; margin:0 0 14px; text-align:center;">
                Verify your email
              </h1>

              <p style="font-size:15px; color:#425466; line-height:1.7; margin:0 0 26px; text-align:center;">
                Welcome to Genestac. Please enter the verification code below to activate your account.
              </p>

              <!-- OTP Box -->
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

              <p style="font-size:13px; color:#000000; line-height:1.6; margin:0; text-align:center;">
                If you didn’t create a Genestac account, you can safely ignore this email.
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
        if (resendRes.error) {
          console.error("Resend error in send-otp:", resendRes.error);
        }
      } catch (emailErr) {
        console.error("Failed to send OTP email via Resend:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send OTP" },
      { status: 500 },
    );
  }
}
