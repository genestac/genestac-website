import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/weightloss#pricing';
  const isMobile = searchParams.get('mobile') === 'true';
  // The live exp:// URL from the mobile app (e.g. exp://192.168.1.31:8082/--/auth/callback)
  const expoRedirect = searchParams.get('expo_redirect');

  if (code) {
    const cookieStore = await cookies();

    // Anon client — used only for exchangeCodeForSession (sets session cookies)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Admin client — bypasses RLS for writing to public.users
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user && data.session) {
      const user = data.user;
      const userEmail = user.email;
      const userName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there';

      // Check if user is signing up for the first time
      const { data: existingUser } = await admin
        .from('users')
        .select('id, metadata')
        .eq('id', user.id)
        .maybeSingle();

      const existingMeta = (existingUser?.metadata as Record<string, any>) || {};
      const isFirstTimeUser = !existingUser || !existingMeta.welcome_email_sent;

      // Save Google OAuth user into public.users using admin client (bypasses RLS)
      const { error: upsertError } = await admin.from('users').upsert(
        {
          id: user.id,
          name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
          email: userEmail ?? '',
          phone: user.phone ?? '',
          status: 'NEW',
          source: isMobile ? 'google_oauth_mobile' : 'google_oauth',
          metadata: {
            ...existingMeta,
            role: 'customer',
            welcome_email_sent: true,
          },
        },
        { onConflict: 'id', ignoreDuplicates: false }
      );

      if (upsertError) {
        console.error('[auth/callback] Failed to upsert user into public.users:', upsertError);
      }

      // Send customized Genestac Welcome Email for new Google sign-ups via Resend
      if (isFirstTimeUser && userEmail && process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const resendFrom = process.env.RESEND_FROM || 'Genestac <noreply@genestac.com>';

          await resend.emails.send({
            from: resendFrom,
            to: [userEmail],
            subject: 'Welcome to Genestac — Your Account is Ready!',
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
                Your account has been registered successfully via Google.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px 36px 36px;">

              <p style="font-size:15px; color:#425466; line-height:1.7; margin:0 0 26px; text-align:center;">
                We're thrilled to have you onboard. Your Genestac account is active and ready to explore.
              </p>

              <!-- Feature Box -->
              <div style="background:linear-gradient(135deg,#ecfdf5,#f8fafc); border:1px solid #d1fae5; border-radius:18px; padding:24px; margin:0 0 28px;">
                <p style="font-size:15px; color:#001f3f; margin:0 0 14px; font-weight:800;">
                  You now have access to:
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:14px; color:#425466; padding:8px 0;">✓ Personalized cellular & restorative care</td>
                  </tr>
                  <tr>
                    <td style="font-size:14px; color:#425466; padding:8px 0;">✓ Guided medical weight loss protocols</td>
                  </tr>
                  <tr>
                    <td style="font-size:14px; color:#425466; padding:8px 0;">✓ Health dashboard & order tracking</td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <div style="text-align:center; margin:0 0 30px;">
                <a href="https://genestac.com" style="display:inline-block; background:#001f3f; color:#ffffff; font-weight:700; font-size:14px; padding:15px 34px; border-radius:14px; text-decoration:none; box-shadow:0 8px 18px rgba(0,31,63,0.18);">
                  Explore Your Dashboard
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
          console.error('[auth/callback] Failed to send welcome email:', emailErr);
        }
      }

      // ── MOBILE: redirect to the exp:// deep-link with tokens in hash ───────
      if (isMobile && expoRedirect) {
        const hash = [
          `access_token=${data.session.access_token}`,
          `refresh_token=${data.session.refresh_token}`,
          `token_type=bearer`,
          `type=signin`,
        ].join('&');
        return NextResponse.redirect(`${expoRedirect}#${hash}`);
      }

      // ── WEB: check role and redirect to the correct page ──────────────────
      let redirectPath = next;
      try {
        const { data: staff } = await admin
          .from('staffs')
          .select('role_id')
          .eq('id', user.id)
          .maybeSingle();

        if (staff) {
          redirectPath = '/superadmin';
        }
      } catch {
        // Fallback to default next route
      }

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
