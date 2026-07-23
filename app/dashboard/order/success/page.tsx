"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Package, ShoppingBag, Home } from "lucide-react";

interface PaymentRecord {
  rzp_order_id: string;
  rzp_payment_id: string;
  rzp_amount: number;
  plan_name: string;
  invoice_no?: string | null;
}

export default function OrderSuccessPage() {
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPayment = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select(`
          provider_order_id,
          provider_payment_id,
          amount,
          orders (
            invoice_no,
            grand_total,
            order_items (
              item_name,
              item_type
            )
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "successful")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        const p = data as any;
        const order = p.orders;
        const planItem = order?.order_items?.find((i: any) => i.item_type === "plan");
        setPayment({
          rzp_order_id: p.provider_order_id || "",
          rzp_payment_id: p.provider_payment_id || "",
          rzp_amount: Math.round((order?.grand_total || p.amount || 0) * 100),
          plan_name: planItem?.item_name || "Medical Plan",
          invoice_no: order?.invoice_no || null,
        });
      }
      setLoading(false);
    };

    fetchLatestPayment();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 flex items-center justify-center px-4 py-16"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="w-full max-w-lg space-y-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-900/5 p-10 text-center space-y-6">

          {/* Animated Check Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Order Placed!
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Thank you for your purchase. Your order has been confirmed and our team will process it shortly.
            </p>
          </div>

          {/* Order Details — from DB */}
          {payment && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Plan</span>
                <span className="font-bold text-slate-700">{payment.plan_name}</span>
              </div>
              {payment.invoice_no && (
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Invoice No.</span>
                  <span className="font-mono font-bold text-slate-700 text-[11px]">{payment.invoice_no}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                <span className="font-mono font-bold text-slate-700 text-[11px]">{payment.rzp_order_id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Payment ID</span>
                <span className="font-mono font-bold text-slate-700 text-[11px]">{payment.rzp_payment_id}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-slate-200 pt-3 mt-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Amount Paid</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  ₹{(payment.rzp_amount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 text-left space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-700">What Happens Next?</h3>
            {[
              { icon: "📋", text: "Our medical team will review your prescription within 24 hours." },
              { icon: "📦", text: "Your order will be dispatched with insured shipping." },
              { icon: "📱", text: "You'll receive tracking details via email or WhatsApp." },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-blue-800">
                <span className="shrink-0 text-base">{step.icon}</span>
                <span className="leading-5">{step.text}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* <Link
              href="/dashboard/track"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#001f3f] hover:bg-slate-800 text-[#F5E6CC] font-bold px-5 py-3.5 rounded-2xl transition text-sm shadow-md"
            >
              <Package className="w-4 h-4" />
              Track My Order
            </Link> */}
            <Link
              href="/weightloss"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-5 py-3.5 rounded-2xl transition text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Genestac Home
          </Link>
        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium">
          Questions? Reach us on{" "}
          <a href="https://wa.me/919971114121" target="_blank" rel="noopener noreferrer"
            className="text-emerald-600 hover:underline font-bold">
            WhatsApp +91 8287776752
          </a>
        </p>
      </div>
    </main>
  );
}