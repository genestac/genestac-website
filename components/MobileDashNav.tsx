"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Apple,
  Activity,
  Map,
  ShoppingCart,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export const MobileDashNav: React.FC = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [searchQs, setSearchQs] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchQs(window.location.search || "");
    }
  }, [pathname]);

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

  const items: NavItem[] = [
    {
      label: "Dashboard",
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/dashboard",
    },
    {
      label: "Diet",
      icon: <Apple className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/dashboard/diet",
    },
    {
      label: "Exercise",
      icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/dashboard/exercise",
    },
    {
      label: "Journey",
      icon: <Map className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/dashboard/games",
    },
    {
      label: "Cart",
      icon: <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/dashboard/cart",
      badge: cartCount,
    },
    {
      label: "Orders",
      icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/dashboard/order",
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/dashboard/settings",
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1.5 overflow-x-auto no-scrollbar">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const fullHref = item.href + searchQs;

          return (
            <Link
              key={item.label}
              href={fullHref}
              className={`relative flex flex-col items-center justify-center flex-1 min-w-[48px] py-1 px-0.5 rounded-xl transition-all ${
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge != null && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </span>
              <span
                className={`text-[9px] leading-tight mt-0.5 whitespace-nowrap ${
                  isActive ? "text-blue-600 font-bold" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
