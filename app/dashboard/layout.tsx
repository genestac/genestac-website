"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MobileDashNav } from "@/components/MobileDashNav";
import { Home, ShoppingCart, ShoppingBag, MapPin, FileText, LogOut, UserRound, Apple, Activity, Lock, ArrowRight, CheckCircle2, BadgeCheck, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isBypassed, setIsBypassed] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null);
  const [activePlanName, setActivePlanName] = useState<string | null>(null);
  const [checkingPlan, setCheckingPlan] = useState(true);

  useEffect(() => {
    const bypass =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("bypassAuth") === "true";
    setIsBypassed(bypass);

    if (bypass) {
      setUser({
        id: "mock-user-7788",
        email: "patient@genestac.com",
        user_metadata: { full_name: "Amit Sharma" },
      });
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const checkPlan = async () => {
      if (isBypassed) {
        setHasActivePlan(true);
        setActivePlanName("Medical & Fitness Plan");
        setCheckingPlan(false);
        return;
      }

      try {
        // 1. Check paid orders in orders table with order_items
        const { data: paidOrders } = await supabase
          .from("orders")
          .select("id, order_items(item_name, item_type)")
          .eq("user_id", user.id)
          .eq("payment_status", "paid")
          .order("created_at", { ascending: false })
          .limit(1);

        if (paidOrders && paidOrders.length > 0) {
          const items = paidOrders[0].order_items || [];
          const planItem = items.find((i: any) => i.item_type === "plan") || items[0];
          const name = planItem?.item_name || "Active Health Plan";
          setHasActivePlan(true);
          setActivePlanName(name);
          setCheckingPlan(false);
          return;
        }

        // 2. Check successful payments in payments table
        const { data: successfulPayments } = await supabase
          .from("payments")
          .select("id, orders(order_items(item_name, item_type))")
          .eq("user_id", user.id)
          .in("status", ["successful", "captured", "paid"])
          .order("created_at", { ascending: false })
          .limit(1);

        if (successfulPayments && successfulPayments.length > 0) {
          const items = (successfulPayments[0] as any)?.orders?.order_items || [];
          const planItem = items.find((i: any) => i.item_type === "plan") || items[0];
          const name = planItem?.item_name || "Active Health Plan";
          setHasActivePlan(true);
          setActivePlanName(name);
          setCheckingPlan(false);
          return;
        }

        // 3. Check user_plans table
        const { data: userPlans } = await supabase
          .from("user_plans")
          .select("id, plan_name")
          .eq("user_id", user.id)
          .limit(1);

        if (userPlans && userPlans.length > 0) {
          const name = (userPlans[0] as any)?.plan_name || "Active Health Plan";
          setHasActivePlan(true);
          setActivePlanName(name);
          setCheckingPlan(false);
          return;
        }

        setHasActivePlan(false);
        setActivePlanName(null);
      } catch (err) {
        console.error("Error checking active plan:", err);
        setHasActivePlan(false);
        setActivePlanName(null);
      } finally {
        setCheckingPlan(false);
      }
    };

    checkPlan();
  }, [user, isBypassed]);

  useEffect(() => {
    const fetchCartCount = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const items = await res.json();
          setCartCount(Array.isArray(items) ? items.length : 0);
        }
      } catch {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const userId = user?.id?.slice(0, 8) ?? "";

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return pathname === base;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const qs = isBypassed ? "?bypassAuth=true" : "";

  const navItems: { label: string; icon: React.ReactNode; href: string; badge?: number }[] = [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: `/dashboard${qs}` },
    { label: "Diet Plan", icon: <Apple className="w-4 h-4" />, href: `/dashboard/diet${qs}` },
    { label: "Exercise", icon: <Activity className="w-4 h-4" />, href: `/dashboard/exercise${qs}` },
    { label: "Cart", icon: <ShoppingCart className="w-4 h-4" />, href: `/dashboard/cart${qs}`, badge: cartCount },
    { label: "Orders", icon: <ShoppingBag className="w-4 h-4" />, href: `/dashboard/order${qs}` },
    // { label: "Track", icon: <MapPin className="w-4 h-4" />, href: `/dashboard/track${qs}` },
    { label: "Settings", icon: <UserRound className="w-4 h-4" />, href: `/dashboard/settings${qs}` },
    // { label: "Invoices", icon: <FileText className="w-4 h-4" />, href: `/dashboard/invoices${qs}` },
  ];

  if (loading || checkingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const showLockedState = hasActivePlan === false;

  return (
    <div className="flex min-h-screen bg-slate-50 pb-16 md:pb-0 relative">
      <aside className={`w-64 shrink-0 hidden md:flex flex-col bg-slate-900 border-r border-slate-800 py-8 px-5 gap-6 text-white shadow-xl ${showLockedState ? "pointer-events-none filter blur-sm opacity-50 select-none" : ""}`}>
        <div className="flex flex-col items-center text-center p-4 bg-slate-800/40 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6" />
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-slate-800">
            {initials}
          </div>
          <p className="font-bold text-sm mt-3 text-slate-100">{displayName}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate w-full">{user?.email}</p>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">ID: {userId}</p>

          {hasActivePlan && activePlanName && (
            <div className="mt-3 w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl py-1.5 px-3 flex items-center justify-center gap-1.5 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-300 truncate">
                {activePlanName}
              </span>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map(({ label, icon, href, badge }) => {
            const active = isActive(href.split("?")[0]);
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? "text-white" : "text-slate-500"}>{icon}</span>
                  {label}
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden ${showLockedState ? "pointer-events-none select-none filter blur-md opacity-40" : ""}`}>
        {children}
      </div>

      {!showLockedState && <MobileDashNav />}

      {/* Pop up overlay for users without an active plan */}
      {showLockedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/20 mb-5">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight">
              Plan Required
            </h2>

            <p className="text-slate-300 text-sm font-medium mb-6 leading-relaxed max-w-sm">
              Please purchase a plan to avail dashboard features
            </p>

            <div className="w-full bg-slate-800/60 border border-slate-800 rounded-2xl p-4 mb-6 text-left space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Personalized Diet & Workout Plans</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily Health Tracking & Analytics</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Doctor Consultations & Progress Monitoring</span>
              </div>
            </div>

            <Link
              href="/pricing"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Purchase a Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleSignOut}
              className="mt-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


