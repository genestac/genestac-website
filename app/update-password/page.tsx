"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import {toast} from "react-hot-toast";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if the user is actually in a recovery session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast.error("Invalid or expired password reset link.");
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully! Please login with your new password.");
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <div className="flex-grow flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Background Ambient Element */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-xl p-8 md:p-12 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Update Password</h1>
            <p className="text-base text-slate-500">Enter a new secure password for your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleUpdatePassword}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block ml-1">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block ml-1">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-900"
              />
            </div>

            {message && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#10b981] text-white py-4 px-6 rounded-2xl text-sm font-bold hover:bg-[#059669] transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : "Update Password"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            <Link href="/login" className="hover:text-emerald-600 transition-colors">Back to Login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
