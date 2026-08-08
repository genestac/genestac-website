"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import OtpModal from "@/components/OtpModal";
import { signUpSchema } from "@/lib/validations";
import {toast} from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsBounceKey, setTermsBounceKey] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpUserId, setOtpUserId] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPassword, setOtpPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Determine role and redirect accordingly
        const { data: staff } = await supabase
          .from("staffs")
          .select("role_id")
          .eq("id", session.user.id)
          .maybeSingle();
        if (staff) {
          router.push("/superadmin");
        } else {
          const params = new URLSearchParams(window.location.search);
          const redirectUrl = params.get("redirect");
          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            router.push("/weightloss?scrollTo=pricing");
          }
        }
      }
    };
    checkSession();

    // Show error if OAuth callback failed
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "oauth_failed") {
      setMessage("Google sign-in failed. Please try again or use email/password.");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const errs: Record<string, boolean> = {};
    if (!email) errs.email = true;
    if (!password) errs.password = true;
    if (mode === "signUp") {
      if (!name) errs.name = true;
      if (!phoneNumber) errs.phone = true;
      if (!acceptedTerms) {
        setTermsBounceKey((k) => k + 1);
        setFieldErrors(errs);
        return;
      }
      const result = signUpSchema.safeParse({ name, email, phone: phoneNumber, password });
      if (!result.success) {
        const zodErrs: Record<string, boolean> = {};
        for (const issue of result.error.issues) {
          zodErrs[issue.path[0] as string] = true;
        }
        setFieldErrors(zodErrs);
        setMessage(result.error.issues[0].message);
        return;
      }
    }
    setTermsBounceKey(0);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    if (mode === "signIn") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.session.user.id)
          .single();
        if (!profileErr && profile?.role === "superadmin") {
          router.push("/superadmin");
        } else {
          const params = new URLSearchParams(window.location.search);
          const redirectUrl = params.get("redirect");
          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            router.push("/weightloss#pricing");
          }
        }
      }
    } else {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPhoneNumber = phoneNumber.trim();

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhoneNumber,
            password: password,
          }),
        });

        const regData = await res.json();
        setLoading(false);

        if (!res.ok) {
          if (res.status === 409 || (regData.error && (regData.error.toLowerCase().includes("already registered") || regData.error.toLowerCase().includes("already exists")))) {
            toast.error("This account already exists. Please login or use different credentials.");
          } else {
            setMessage(regData.error || "Failed to create account. Please try again.");
          }
          return;
        }

        const authUserId = regData.userId;
        setOtpUserId(authUserId);
        setOtpEmail(trimmedEmail);
        setOtpPassword(password);
        setShowOtpModal(true);
        setMessage("");
      } catch (err: any) {
        setLoading(false);
        setMessage(err.message || "An unexpected error occurred during registration.");
      }
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address first.");
      setFieldErrors((p) => ({ ...p, email: true }));
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset link sent to your email!");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <style>{`@keyframes bounce-twice { 0%,100% { transform: translateY(0); } 25% { transform: translateY(-6px); } 50% { transform: translateY(0); } 75% { transform: translateY(-6px); } } .animate-bounce-twice { animation: bounce-twice 0.5s ease; }`}</style>
      <div className="flex-grow flex items-center justify-center py-16 px-4 md:px-16 relative overflow-hidden">
        {/* Background Ambient Element */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-xl p-8 md:p-12 relative z-10">
          {/* Branding/Identity */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-base text-slate-500">Access your personalized restorative care dashboard.</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex border-b border-slate-200 mb-8 relative">
            <button 
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-all relative ${mode === 'signIn' ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
              onClick={() => { setMode('signIn'); setMessage(''); }}
            >
              Sign In
              {mode === 'signIn' && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-500 rounded-t-md"></div>}
            </button>
            <button 
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-all relative ${mode === 'signUp' ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
              onClick={() => { setMode('signUp'); setMessage(''); }}
            >
              Create Account
              {mode === 'signUp' && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-500 rounded-t-md"></div>}
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'signUp' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: false })); }}
                  placeholder="Dr. Julian Reed" 
                  className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${fieldErrors.name ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: false })); }}
                placeholder="name@genestac.com" 
                className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${fieldErrors.email ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
                autoComplete="true"
              />
            </div>
            
            {mode === 'signUp' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setFieldErrors((p) => ({ ...p, phone: false })); }}
                  placeholder="+1 (555) 000-0000" 
                  className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${fieldErrors.phone ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-600 block">Password</label>
                {mode === 'signIn' && <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-emerald-600 hover:underline transition-colors">Forgot Password</button>}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: false })); }}
                placeholder="••••••••" 
                className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${fieldErrors.password ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
              />
            </div>

            {message && (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {mode === "signUp" && (
              <label key={termsBounceKey} className={`flex items-start gap-3 cursor-pointer ${termsBounceKey > 0 ? "animate-bounce-twice" : ""}`}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setTermsBounceKey(0);
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className={`text-xs font-medium leading-relaxed ${termsBounceKey > 0 ? "text-red-500" : "text-slate-500"}`}>
                  By clicking you agree to our{" "}
                  <a href="#" className={`hover:underline font-semibold ${termsBounceKey > 0 ? "text-red-500" : "text-emerald-600"}`}>Terms &amp; Conditions</a>
                </span>
              </label>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#10b981] text-white py-4 px-6 rounded-2xl text-sm font-bold hover:bg-[#059669] transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Please wait...
                </>
              ) : mode === "signIn" ? "Sign In" : "Register Account"}
            </button>
          </form>

          {/* Social Auth — Google OAuth */}
          <div className="mt-8">
            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-sm font-semibold text-slate-500 px-2">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            <button
              id="google-signin-btn"
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });
                if (error) {
                  setMessage(error.message);
                  setLoading(false);
                }
              }}
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 shadow-sm"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-semibold text-slate-900">Continue with Google</span>
            </button>
          </div>

          {/* Footer Small Policy Links */}
          <p className="text-center mt-8 text-xs text-slate-500">
            By accessing this portal, you agree to our <br />
            <a href="#" className="text-emerald-600 hover:underline">Care Standards</a> and <a href="#" className="text-emerald-600 hover:underline">Patient Data Policy</a>.
          </p>

          <div className="mt-8 text-center text-sm text-slate-500">
            <Link href="/">Return to home</Link>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <OtpModal
          email={otpEmail}
          userId={otpUserId}
          onVerified={async () => {
            setShowOtpModal(false);
            const { error } = await supabase.auth.signInWithPassword({
              email: otpEmail,
              password: otpPassword,
            });
            if (!error) {
              router.push("/weightloss?scrollTo=pricing");
            }
          }}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </main>
  );
};

export default Page;