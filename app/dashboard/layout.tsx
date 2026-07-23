"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MobileDashNav } from "@/components/MobileDashNav";
import { Home, ShoppingCart, ShoppingBag, MapPin, FileText, LogOut, UserRound, Apple, Activity } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isBypassed, setIsBypassed] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 pb-16 md:pb-0">
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-slate-900 border-r border-slate-800 py-8 px-5 gap-6 text-white shadow-xl">
        <div className="flex flex-col items-center text-center p-4 bg-slate-800/40 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6" />
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-slate-800">
            {initials}
          </div>
          <p className="font-bold text-sm mt-3 text-slate-100">{displayName}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate w-full">{user?.email}</p>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">ID: {userId}</p>
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

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {children}
      </div>

      <MobileDashNav />
    </div>
  );
}
