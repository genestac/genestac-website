"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, ShoppingBag, MapPin, FileText } from "lucide-react";
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
      icon: <Home className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      label: "Cart",
      icon: <ShoppingCart className="w-5 h-5" />,
      href: "/dashboard/cart",
      badge: cartCount,
    },
    {
      label: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      href: "/dashboard/order",
    },
    {
      label: "Track",
      icon: <MapPin className="w-5 h-5" />,
      href: "/dashboard/track",
    },
    // {
    //   label: "Invoices",
    //   icon: <FileText className="w-5 h-5" />,
    //   href: "/dashboard/invoices",
    // },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge != null && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </span>
              <span className={`text-[10px] font-semibold ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
