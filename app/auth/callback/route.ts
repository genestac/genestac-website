import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/weightloss#pricing';
  // Detect if the request came from the mobile app
  const isMobile = searchParams.get('mobile') === 'true';

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
    console.log('[Auth Callback] exchangeCodeForSession:', { hasData: !!data?.user, error, isMobile });

    if (!error && data.user && data.session) {
      const user = data.user;

      // Upsert the user into the public.users table
      const { error: upsertError } = await supabase.from('users').upsert(
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

      console.log('[Auth Callback] upsert error:', upsertError);

      // ── MOBILE: redirect back to Expo Go with session tokens in hash ───────
      if (isMobile) {
        // We redirect back to this same HTTPS page but with tokens as a hash
        // fragment. The mobile app's WebBrowser.openAuthSessionAsync watches for
        // any URL starting with `origin/auth/callback` (our expoRedirectUrl) and
        // will intercept this redirect, close the browser, and return the URL
        // (including the hash with tokens) back to the app for parsing.
        const mobileCallbackBase = `${origin}/auth/callback?mobile=true`;
        const hash = [
          `access_token=${data.session.access_token}`,
          `refresh_token=${data.session.refresh_token}`,
          `token_type=bearer`,
          `type=signin`,
        ].join('&');
        return NextResponse.redirect(`${mobileCallbackBase}#${hash}`);
      }

      // ── WEB: check role and redirect to the correct page ──────────────────
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('[Auth Callback] profile check:', { profile, profileErr });

      const redirectPath =
        profile?.role === 'superadmin' ? '/superadmin' : next;

      console.log('[Auth Callback] redirecting to:', redirectPath);
      return NextResponse.redirect(`${origin}${redirectPath}`);
    } else {
      console.error('[Auth Callback] Error exchanging code:', error);
    }
  } else {
    console.warn('[Auth Callback] No code provided in URL');
  }

  // Return to login with error flag if something went wrong
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
