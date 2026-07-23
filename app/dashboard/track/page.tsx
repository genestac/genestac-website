"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  ShoppingBag,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Truck,
  Package,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Calendar,
  Navigation,
  Home as HomeIcon,
  Stethoscope,
  FileText,
} from "lucide-react";

interface Order {
  id: string;
  status: string;
  payment_status: string;
  invoice_no: string | null;
  doctor_notes: string | null;
  reviewed_at: string | null;
  original_amount: number | null;
  discount_amount: number | null;
  tax_amount: number | null;
  grand_total: number | null;
  created_at: string;
  updated_at: string;
}

type StepStatus = "done" | "active" | "pending" | "error";

interface TrackStep {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  status: StepStatus;
  date?: string;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function getTrackingSteps(order: Order): TrackStep[] {
  const step1: StepStatus = "done";
  const step2: StepStatus = "pending";
  const step3: StepStatus = "pending";
  const step4: StepStatus = "pending";

  return [
    {
      label: "Ordered",
      sublabel: "Your order has been placed and confirmed.",
      icon: <Package className="w-4 h-4" />,
      status: step1,
      date: formatDate(order.created_at),
    },
    {
      label: "Shipped",
      sublabel: "Awaiting dispatch — tracking updates will appear here once your order ships.",
      icon: <Truck className="w-4 h-4" />,
      status: step2,
    },
    {
      label: "Out for Delivery",
      sublabel: "This step begins once your order is shipped.",
      icon: <Navigation className="w-4 h-4" />,
      status: step3,
    },
    {
      label: "Delivered",
      sublabel: "Package delivered to your address.",
      icon: <HomeIcon className="w-4 h-4" />,
      status: step4,
    },
  ];
}

const stepColors: Record<
  StepStatus,
  { dot: string; text: string; line: string }
> = {
  done: {
    dot: "bg-emerald-500 border-emerald-500 text-white",
    text: "text-emerald-700",
    line: "bg-emerald-400",
  },
  active: {
    dot: "bg-blue-600 border-blue-600 text-white animate-pulse",
    text: "text-blue-700",
    line: "bg-slate-200",
  },
  pending: {
    dot: "bg-white border-slate-200 text-slate-400",
    text: "text-slate-400",
    line: "bg-slate-200",
  },
  error: {
    dot: "bg-red-500 border-red-500 text-white",
    text: "text-red-700",
    line: "bg-slate-200",
  },
};

export default function TrackPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const bypass = urlParams.get("bypassAuth") === "true";
      setIsBypassed(bypass);

      let currentUser: any = null;
      if (bypass) {
        currentUser = {
          id: "mock-user-7788",
          email: "patient@genestac.com",
          user_metadata: { full_name: "Amit Sharma" },
        };
        setUser(currentUser);
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/login");
          return;
        }
        currentUser = session.user;
        setUser(currentUser);
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
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
      } catch { setCartCount(0); }
    };
    fetchCartCount();
  }, []);

  const displayName: string =
    user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const NAV = [
    {
      label: "Dashboard",
      icon: <Home className="w-4 h-4" />,
      href: `/dashboard${isBypassed ? "?bypassAuth=true" : ""}`,
    },
    {
      label: "Cart",
      icon: <ShoppingCart className="w-4 h-4" />,
      href: `/dashboard/cart${isBypassed ? "?bypassAuth=true" : ""}`,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      label: "Orders",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: `/dashboard/orders${isBypassed ? "?bypassAuth=true" : ""}`,
    },
    {
      label: "Track Order",
      icon: <MapPin className="w-4 h-4" />,
      href: `/dashboard/track${isBypassed ? "?bypassAuth=true" : ""}`,
      active: true,
    },
    {
      label: "Invoices",
      icon: <FileText className="w-4 h-4" />,
      href: `/dashboard/invoices${isBypassed ? "?bypassAuth=true" : ""}`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading shipment tracking...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 shadow-sm z-30 shrink-0 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              Patient Portal
            </span>
            {isBypassed && (
              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Inspection Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard${isBypassed ? "?bypassAuth=true" : ""}`}
              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition text-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />Back
            </Link>
            <Link
              href={`/dashboard/cart${isBypassed ? "?bypassAuth=true" : ""}`}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 rounded-xl text-xs font-bold transition border border-blue-100 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                {initials}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:block">
                {displayName}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/40">
          <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  Track Your Order
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Live status of your medicine orders and prescription journey.
                </p>
              </div>
              <button
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="self-start sm:self-center flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition text-xs disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {/* Orders */}
            {orders.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-extrabold text-slate-800">
                  No Orders to Track
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Once you submit a treatment request, you can track its status
                  here in real-time.
                </p>
                <Link
                  href={`/dashboard${isBypassed ? "?bypassAuth=true" : ""}`}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md mt-5"
                >
                  Browse Treatments
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const steps = getTrackingSteps(order);
                  const activeStep = steps.findIndex(
                    (s) => s.status === "active",
                  );
                  const currentLabel =
                    steps.find((s) => s.status === "active")?.label ??
                    steps.filter((s) => s.status === "done").at(-1)?.label ??
                    "Processing";

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-200 shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="font-extrabold text-sm text-slate-800">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </h2>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                Order #{order.id.slice(0, 8).toUpperCase()} ·{" "}
                                <Calendar className="w-3 h-3 inline -mt-0.5" />{" "}
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                              {currentLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="p-6 md:p-8">
                        {/* Desktop — horizontal */}
                        <div className="hidden sm:flex items-start">
                          {steps.map((step, idx) => {
                            const colors = stepColors[step.status];
                            const isLast = idx === steps.length - 1;
                            return (
                              <div
                                key={step.label}
                                className="flex-1 flex flex-col items-center relative"
                              >
                                {/* Connector line before dot */}
                                {!isLast && (
                                  <div className="absolute top-[18px] left-1/2 w-full h-0.5 z-0">
                                    <div
                                      className={`h-full ${steps[idx + 1].status === "done" || steps[idx + 1].status === "active" ? "bg-emerald-400" : "bg-slate-200"} transition-colors duration-500`}
                                    />
                                  </div>
                                )}
                                {/* Dot */}
                                <div
                                  className={`relative z-10 w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-sm transition-all duration-300 ${colors.dot}`}
                                >
                                  {step.status === "done" ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : step.status === "error" ? (
                                    <AlertCircle className="w-4 h-4" />
                                  ) : (
                                    step.icon
                                  )}
                                </div>
                                {/* Label */}
                                <p
                                  className={`text-[10px] font-extrabold mt-2.5 text-center px-1 uppercase tracking-wide leading-tight ${colors.text}`}
                                >
                                  {step.label}
                                </p>
                                {step.date && (
                                  <p className="text-[9px] text-slate-400 text-center mt-0.5 font-medium">
                                    {step.date}
                                  </p>
                                )}
                                {step.status === "active" && (
                                  <span className="mt-1.5 text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide animate-pulse">
                                    In Progress
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Mobile — vertical */}
                        <div className="flex sm:hidden flex-col gap-0">
                          {steps.map((step, idx) => {
                            const colors = stepColors[step.status];
                            const isLast = idx === steps.length - 1;
                            return (
                              <div
                                key={step.label}
                                className="flex items-start gap-4"
                              >
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm ${colors.dot}`}
                                  >
                                    {step.status === "done" ? (
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    ) : step.status === "error" ? (
                                      <AlertCircle className="w-3.5 h-3.5" />
                                    ) : (
                                      step.icon
                                    )}
                                  </div>
                                  {!isLast && (
                                    <div
                                      className={`w-0.5 flex-1 min-h-[40px] mt-1 ${step.status === "done" ? "bg-emerald-400" : "bg-slate-200"}`}
                                    />
                                  )}
                                </div>
                                <div className="pb-5 pt-0.5 flex-1">
                                  <p
                                    className={`text-xs font-extrabold uppercase tracking-wide ${colors.text}`}
                                  >
                                    {step.label}
                                  </p>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                                    {step.sublabel}
                                  </p>
                                  {step.date && (
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                      {step.date}
                                    </p>
                                  )}
                                  {step.status === "active" && (
                                    <span className="mt-1.5 inline-block text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                      In Progress
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Step detail cards — desktop */}
                        <div className="hidden sm:grid grid-cols-4 gap-2 mt-6">
                          {steps.map((step) => {
                            const colors = stepColors[step.status];
                            return (
                              <div
                                key={step.label}
                                className={`rounded-2xl p-3 border text-center text-[10px] leading-relaxed font-medium ${step.status === "active" ? "bg-blue-50 border-blue-200 text-blue-700" : step.status === "done" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : step.status === "error" ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-100 text-slate-400"}`}
                              >
                                {step.sublabel}
                              </div>
                            );
                          })}
                        </div>

                        {/* Doctor Notes Banner */}
                        {order.doctor_notes && (
                          <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                            <Stethoscope className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider mb-1">
                                Physician Note
                              </p>
                              <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                                {order.doctor_notes}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Payment CTA if unpaid & approved */}
                        {(order.payment_status || "").toLowerCase() ===
                          "unpaid" &&
                          (order.status || "").toLowerCase() === "approved" && (
                            <div className="mt-5 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-4">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-800 font-bold">
                                  Payment pending — complete payment to dispatch
                                  your medicine.
                                </p>
                              </div>
                              <Link
                                href={`/dashboard/cart${isBypassed ? "?bypassAuth=true" : ""}`}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition shadow-sm shrink-0 ml-3"
                              >
                                Pay Now
                              </Link>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
    </>
  );
}
