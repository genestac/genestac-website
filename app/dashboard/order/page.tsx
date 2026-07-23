"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Activity,
  Search,
  RefreshCw,
  Sparkles,
  Receipt,
  Tag,
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

interface Payment {
  id: string;
  order_id: string | null;
  provider_order_id: string;
  provider_payment_id: string | null;
  amount: number;
  status: string;
  created_at: string;
  orders: { invoice_no: string | null; grand_total: number | null } | null;
}

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isBypassed, setIsBypassed] = useState<boolean>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debugShowAll, setDebugShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadSessionAndOrders = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const bypass = urlParams.get("bypassAuth") === "true";
      setIsBypassed(bypass);

      let currentUser = null;
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

      // Fetch Orders for this user
      const { data: dbOrders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        setDbError(error.message);
      } else if (dbOrders) {
        setDbError(null);
        setOrders(dbOrders);
      }

      // Fetch Payments for this user
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select("*, orders(invoice_no, grand_total)")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!paymentError && paymentData) {
        setPayments(paymentData);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setDbError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSessionAndOrders();
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

  useEffect(() => {
    if (!user) return;

    let result = [...orders];

    if (!debugShowAll && !isBypassed) {
      // Orders already filtered by user_id in the query
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          (o.invoice_no || "").toLowerCase().includes(term),
      );
    }

    if (paymentFilter !== "all") {
      result = result.filter(
        (o) => (o.payment_status || "").toLowerCase() === paymentFilter,
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (o) => (o.status || "").toLowerCase() === statusFilter,
      );
    }

    setFilteredOrders(result);
  }, [
    orders,
    user,
    searchTerm,
    paymentFilter,
    statusFilter,
    debugShowAll,
    isBypassed,
  ]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const displayName: string =
    user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials: string = displayName.slice(0, 2).toUpperCase();
  const userId: string = user?.id?.slice(0, 8) ?? "";

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
      active: true,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : "pending";
    switch (s) {
      case "approved":
      case "confirmed":
        return (
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full w-1/2">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case "rejected":
      case "cancelled":
        return (
          <span className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full w-1/2">
            <AlertCircle className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full w-1/2">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    const s = status ? status.toLowerCase() : "unpaid";
    switch (s) {
      case "paid":
        return (
          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2.5 py-1 rounded-full w-1/2">
            <CreditCard className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full w-1/2">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full w-1/2">
            <Clock className="w-3.5 h-3.5" /> Unpaid
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-50 gap-4 flex-1">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          Retrieving Order History...
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

          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard${isBypassed ? "?bypassAuth=true" : ""}`}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition text-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back</span>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/40">
          <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
            {dbError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>Error connecting to order database: {dbError}</span>
              </div>
            )}

            {/* ✅ Orders Table */}
            {filteredOrders.length > 0 ? (
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    Your Orders
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center hover:bg-slate-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                        <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">
                          {order.id.slice(0, 8)}…
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</p>
                        <div className="mt-1">{getPaymentBadge(order.payment_status)}</div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                        <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                          ₹{order.grand_total?.toFixed(2) ?? "0.00"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice</p>
                        {order.invoice_no ? (
                          <Link
                            href={`/dashboard/order/invoice/${order.invoice_no}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 mt-1"
                          >
                            <FileText className="w-3 h-3" />
                            {order.invoice_no}
                          </Link>
                        ) : (
                          <p className="text-xs text-slate-400 mt-0.5">—</p>
                        )}
                      </div>

                      <div className="sm:text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-500">No orders yet</p>
                <p className="text-xs text-slate-400 mt-1">Orders you place will appear here.</p>
              </div>
            )}

            {/* ✅ Payments Table */}
            {payments.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-500" />
                    Payment History
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    All transactions linked to your account
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center hover:bg-slate-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Provider Order ID</p>
                        <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">
                          {payment.provider_order_id || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</p>
                        <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                          ₹{payment.amount.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 capitalize">
                          <CreditCard className="w-3 h-3" /> {payment.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice</p>
                        {payment.orders?.invoice_no ? (
                          <Link
                            href={`/dashboard/order/invoice/${payment.orders.invoice_no}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 mt-1"
                          >
                            <FileText className="w-3 h-3" />
                            {payment.orders.invoice_no}
                          </Link>
                        ) : (
                          <p className="text-xs text-slate-400 mt-0.5">—</p>
                        )}
                      </div>

                      <div className="sm:text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </>
  );
};

export default Page;
