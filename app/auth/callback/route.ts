import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/weightloss#pricing';
  const isMobile = searchParams.get('mobile') === 'true';
  // The live exp:// URL from the mobile app (e.g. exp://192.168.1.31:8082/--/auth/callback)
  const expoRedirect = searchParams.get('expo_redirect');

  if (code) {
    const cookieStore = await cookies();

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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user && data.session) {
      const user = data.user;

      await supabase.from('users').upsert(
        {
          id: user.id,
          name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
          email: user.email ?? '',
          phone: user.phone ?? '',
          status: 'NEW',
          source: isMobile ? 'google_oauth_mobile' : 'google_oauth',
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );

      // ── MOBILE: redirect to the exp:// deep-link with tokens in hash ───────
      // Android Chrome Custom Tab hands this off to Expo Go, which closes the
      // browser and fires the openAuthSessionAsync success handler in the app.
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const redirectPath = profile?.role === 'superadmin' ? '/superadmin' : next;
      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
