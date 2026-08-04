"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Check, Star, ArrowRight, X, Zap, ShoppingBag } from "lucide-react";
import type { PlanRecord, PlanVariant } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

// Signature element: a heartbeat/pulse line used as a divider throughout —
// ties every card back to the "health tracking" subject instead of a plain <hr>.
const PulseDivider: React.FC<{ tone?: "light" | "dark" }> = ({ tone = "dark" }) => {
  const stroke = tone === "light" ? "rgba(255,255,255,0.6)" : "#CBD5D9";
  return (
    <svg
      viewBox="0 0 300 24"
      className="w-full h-5 mb-6"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 12 H100 L112 4 L124 20 L136 2 L148 12 H300"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function getActivePrice(variant: PlanVariant): number {
  const isDiscountActive =
    variant.discounted_price !== null &&
    variant.discounted_price !== undefined &&
    (!variant.discount_end_date || new Date(variant.discount_end_date) > new Date());
  return isDiscountActive ? variant.discounted_price! : variant.base_price;
}

function hasActiveDiscount(variant?: PlanVariant | null): boolean {
  if (!variant) return false;
  return (
    variant.discounted_price !== null &&
    variant.discounted_price !== undefined &&
    (!variant.discount_end_date || new Date(variant.discount_end_date) > new Date())
  );
}

function formatPriceDisplay(amount: number): string {
  if (amount === 0) return "FREE";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function saveGuestCartItem(plan: PlanRecord, variant?: PlanVariant) {
  if (typeof window === "undefined") return;
  const chosenVariant = variant || plan.variants?.find((v) => v.duration_days === 30 || v.duration_label.toLowerCase().includes("1 month")) || plan.variants?.[0];
  const price = chosenVariant ? getActivePrice(chosenVariant) : plan.cartPrice;
  localStorage.setItem("guest_cart_item", JSON.stringify({
    planId: plan.id,
    planName: variant ? `${plan.cartName || plan.name} (${variant.duration_label})` : (plan.cartName || plan.name),
    price,
    variantId: variant?.id ?? chosenVariant?.id ?? null,
    variantLabel: variant?.duration_label ?? chosenVariant?.duration_label ?? null,
  }));
}

function getGuestCartItem(): { planId: string; planName: string; price: number; variantId: string | null; variantLabel: string | null } | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("guest_cart_item");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export const PricingSection: React.FC = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PlanRecord | null>(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [guestSelectedPlan, setGuestSelectedPlan] = useState(getGuestCartItem());

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setPlans(data);
        }
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = async (plan: PlanRecord) => {
    if (plan.isEntryLevel) {
      const entryVariant = plan.variants?.find((v) => v.duration_days === 30 || v.duration_label.toLowerCase().includes("1 month")) || plan.variants?.[0];
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        saveGuestCartItem(plan, entryVariant);
        setGuestSelectedPlan(getGuestCartItem());
        if (typeof window !== "undefined") {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
        return;
      }

      if (typeof window !== "undefined") {
        if (entryVariant?.id) {
          localStorage.setItem("cart_variant_id", entryVariant.id);
          localStorage.setItem("cart_variant_label", entryVariant.duration_label);
        } else {
          localStorage.removeItem("cart_variant_id");
          localStorage.removeItem("cart_variant_label");
        }
      }
      await executeSelectPlan(plan, session.access_token);
    } else {
      setSelectedPlanForModal(plan);
      setShowDurationModal(true);
    }
  };

  const handleConfirmVariant = async (variant: PlanVariant) => {
    if (!selectedPlanForModal) return;
    setShowDurationModal(false);

    if (typeof window !== "undefined") {
      localStorage.setItem("cart_variant_id", variant.id);
      localStorage.setItem("cart_variant_label", variant.duration_label);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      await executeSelectPlan(selectedPlanForModal, session.access_token);
    } else {
      saveGuestCartItem(selectedPlanForModal, variant);
      setGuestSelectedPlan(getGuestCartItem());
      if (typeof window !== "undefined") {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }
  };

  const executeSelectPlan = async (plan: PlanRecord, token: string) => {
    setCartLoading(true);
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId: plan.id }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      toast.success(`${plan.cartName} added to cart`);
      router.push("/dashboard/cart");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  const entryPlan = plans.find((p) => p.isEntryLevel);

  // Enforce a fixed display order regardless of API/DB order.
  const PLAN_ORDER = ["starter", "premium", "medical"];
  const subscriptionPlans = plans
    .filter((p) => !p.isEntryLevel)
    .sort((a, b) => {
      const aIndex = PLAN_ORDER.indexOf(a.name.toLowerCase());
      const bIndex = PLAN_ORDER.indexOf(b.name.toLowerCase());
      // unknown plan names fall to the end, keeping things safe if a new plan gets added later
      return (aIndex === -1 ? PLAN_ORDER.length : aIndex) - (bIndex === -1 ? PLAN_ORDER.length : bIndex);
    });

  if (loading) {
    return (
      <section id="pricing" className="py-16 bg-linear-to-b from-white to-slate-50 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="h-96 bg-slate-200 rounded-4xl"></div>
              <div className="h-96 bg-slate-200 rounded-4xl"></div>
              <div className="h-96 bg-slate-200 rounded-4xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const entry1MVariant = entryPlan?.variants?.find((v) => v.duration_days === 30 || v.duration_label.toLowerCase().includes("1 month")) || entryPlan?.variants?.[0];
  const hasEntryDiscount = hasActiveDiscount(entry1MVariant);
  const entryActivePrice = entry1MVariant ? getActivePrice(entry1MVariant) : entryPlan?.cartPrice || 0;
  const entryBasePrice = entry1MVariant ? entry1MVariant.base_price : entryPlan?.cartPrice || 0;

  return (
    <section
      id="pricing"
      className={`py-16 bg-linear-to-b from-white to-slate-50 relative overflow-hidden border-t border-slate-100 ${guestSelectedPlan ? "pb-28" : ""}`}
    >
      {cartLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Adding to cart…</p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4 tracking-tight">
            Simple Subscription Models
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
            Choose a monthly plan that gives you access to guidance, reviews,
            tracking, and ongoing support.
          </p>
        </div>

        {/* Entry-level: Initial Assessment + Doctor Consultation */}
        {entryPlan && (
          <div className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-500 to-blue-600" />
            <div className="text-center sm:text-left pl-0 sm:pl-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Start Here
                </span>
                {hasEntryDiscount && entry1MVariant?.discount_text && (
                  <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    {entry1MVariant.discount_text}
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-bold text-navy-900 mb-1">
                {entryPlan.name}
              </h3>
              <p className="text-slate-600 text-sm font-medium max-w-md">
                {entryPlan.description}
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
              <div className="flex flex-col items-center sm:items-end">
                {hasEntryDiscount && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-semibold line-through text-slate-400">
                      ₹{entryBasePrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${hasEntryDiscount ? "text-emerald-600" : "text-navy-900"}`}>
                    {hasEntryDiscount ? formatPriceDisplay(entryActivePrice) : entryPlan.price}
                  </span>
                  {entryPlan.cadence && (
                    <span className="text-slate-500 font-bold text-sm">
                      {entryPlan.cadence}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleSelectPlan(entryPlan)}
                className="open-intake-btn group px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-300 uppercase tracking-widest text-xs cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                {entryPlan.cta || "Book Consultation"}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {subscriptionPlans.map((plan) => {
            const isFeatured = plan.featured;
            const variant1M = plan.variants?.find((v) => v.duration_days === 30 || v.duration_label.toLowerCase().includes("1 month")) || plan.variants?.[0];
            const variant3M = plan.variants?.find((v) => v.duration_days === 90 || v.duration_label.toLowerCase().includes("3 month")) || plan.variants?.[1];

            const has1MDiscount = hasActiveDiscount(variant1M);
            const active1MPrice = variant1M ? getActivePrice(variant1M) : plan.cartPrice;
            const base1MPrice = variant1M ? variant1M.base_price : plan.cartPrice;

            const has3MDiscount = hasActiveDiscount(variant3M);
            const active3MPrice = variant3M ? getActivePrice(variant3M) : undefined;
            const base3MPrice = variant3M ? variant3M.base_price : undefined;

            if (isFeatured) {
              return (
                <div
                  key={plan.id}
                  className="group rounded-4xl p-8 border border-white/20 shadow-[0_20px_60px_-15px_rgba(23,163,150,0.5)] hover:shadow-[0_25px_70px_-10px_rgba(23,163,150,0.65)] hover:-translate-y-8 transition-all duration-300 flex flex-col h-full relative lg:z-10 cursor-pointer overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #3fae6a 0%, #1f9c8f 35%, #16879e 65%, #0e5470 100%)",
                  }}
                >
                  {/* ambient glow, keeps the gradient from feeling flat */}
                  <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
                  {/* subtle dark scrim behind the header so title/description stay legible */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/15 to-transparent" />

                  {/* most chosen */}
                  <div className="absolute text-xs top-3 left-1/2 -translate-x-1/2 bg-white text-[#0e5470] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-current" />
                    Most Chosen
                  </div>

                  <div className="mb-2 pt-3 relative">
                    <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-sm">
                      {plan.name}
                    </h3>
                    <p className="text-white text-sm font-medium min-h-10 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="mt-6">
                      {has1MDiscount && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold line-through text-white/70">
                            ₹{base1MPrice.toLocaleString("en-IN")}
                          </span>
                          {variant1M?.discount_text && (
                            <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              {variant1M.discount_text}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
                          {has1MDiscount ? formatPriceDisplay(active1MPrice) : plan.price}
                        </span>
                        {plan.cadence && (
                          <span className="text-white font-bold">
                            {plan.cadence}
                          </span>
                        )}
                      </div>
                    </div>

                    {has3MDiscount && variant3M && active3MPrice !== undefined && base3MPrice !== undefined ? (
                      <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs sm:text-sm font-bold mt-3 px-3 py-1.5 rounded-2xl border border-white uppercase tracking-wider backdrop-blur-xs">
                        <span className="line-through text-white/70 font-semibold">
                          ₹{base3MPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="font-extrabold">
                          {formatPriceDisplay(active3MPrice)} / 90 Days
                        </span>
                        {variant3M.discount_text && (
                          <span className="bg-white text-[#0e5470] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                            {variant3M.discount_text}
                          </span>
                        )}
                      </div>
                    ) : plan.term ? (
                      <div className="inline-block bg-white/20 text-white text-md font-bold mt-3 px-3 py-1 rounded-2xl border border-white uppercase tracking-widest">
                        {plan.term}
                      </div>
                    ) : null}

                    {plan.note && (
                      <p className="text-xs text-white/80 mt-3">
                        *{plan.note}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 mb-8 relative">
                    <PulseDivider tone="dark" />
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-[15px] text-white font-semibold leading-snug"
                        >
                          <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                            {idx === 0 && plan.name.toLowerCase() === "premium" ? (
                              <Star className="text-white w-3 h-3 fill-current" />
                            ) : (
                              <Check className="text-white w-3 h-3" />
                            )}
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="open-intake-btn w-full py-4 rounded-xl bg-white text-[#0e5470] font-bold hover:shadow-lg hover:shadow-white/30 hover:scale-[1.02] active:scale-[0.99] transition-all mt-auto uppercase tracking-widest text-xs cursor-pointer"
                  >
                    {plan.cta || "Buy Now"}
                  </button>
                </div>
              );
            }

            return (
              <div
                key={plan.id}
                className="group bg-white rounded-4xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-6 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden"
              >
                {/* quiet top accent, appears on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />

                <div className="mb-2 pt-3">
                  <h3 className="text-4xl font-bold text-navy-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-600 text-sm font-medium min-h-10 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mt-6">
                    {has1MDiscount && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold line-through text-slate-400">
                          ₹{base1MPrice.toLocaleString("en-IN")}
                        </span>
                        {variant1M?.discount_text && (
                          <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {variant1M.discount_text}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${has1MDiscount && active1MPrice === 0 ? "text-emerald-600" : "text-navy-900"}`}>
                        {has1MDiscount ? formatPriceDisplay(active1MPrice) : plan.price}
                      </span>
                      {plan.cadence && (
                        <span className="text-slate-500 font-bold text-sm">
                          {plan.cadence}
                        </span>
                      )}
                    </div>
                  </div>

                  {has3MDiscount && variant3M && active3MPrice !== undefined && base3MPrice !== undefined ? (
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 text-xs sm:text-sm font-bold mt-3 px-3 py-1.5 border border-blue-300 rounded-2xl uppercase tracking-wider">
                      <span className="line-through text-slate-400 font-semibold">
                        ₹{base3MPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="font-extrabold text-blue-700">
                        {formatPriceDisplay(active3MPrice)} / 90 Days
                      </span>
                      {variant3M.discount_text && (
                        <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          {variant3M.discount_text}
                        </span>
                      )}
                    </div>
                  ) : plan.term ? (
                    <div className="inline-block bg-blue-200 text-md font-bold mt-3 px-3 py-1 border border-blue-500 rounded-2xl uppercase tracking-widest">
                      {plan.term}
                    </div>
                  ) : null}

                  {plan.note && (
                    <p className="text-xs text-slate-500 mt-3">
                      *{plan.note}
                    </p>
                  )}
                </div>

                <div className="flex-1 mb-8">
                  <PulseDivider tone="dark" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[15px] text-black font-semibold leading-snug"
                      >
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                          <Check className="text-blue-600 w-3 h-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="open-intake-btn w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all mt-auto uppercase tracking-widest text-xs btn-shine cursor-pointer"
                >
                  {plan.cta || "Buy Now"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guest Proceed to Buy Bar */}
      {guestSelectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 sm:py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-medium">Selected Plan</p>
              <p className="text-sm font-bold text-slate-800 truncate">{guestSelectedPlan.planName}</p>
              <p className="text-lg font-extrabold text-slate-900">
                {guestSelectedPlan.price === 0 ? "FREE" : `₹${guestSelectedPlan.price.toLocaleString("en-IN")}`}
              </p>
            </div>
            <button
              onClick={async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                  router.push("/dashboard/cart");
                } else {
                  router.push("/login");
                }
              }}
              className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/20 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Proceed to Buy
            </button>
          </div>
        </div>
      )}

      {/* Duration / Variant Selection Modal */}
      {showDurationModal && selectedPlanForModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowDurationModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-5">
            <div className="text-center">
              <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                Select Plan Term
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {selectedPlanForModal.name} Plan
              </h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                Choose the duration that best fits your goals.
              </p>
            </div>

            {/* Variant Options */}
            <div className="grid gap-3">
              {selectedPlanForModal.variants && selectedPlanForModal.variants.length > 0 ? (
                selectedPlanForModal.variants.map((variant) => {
                  const activePrice = getActivePrice(variant);
                  const hasDiscount = hasActiveDiscount(variant);

                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleConfirmVariant(variant)}
                      className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 text-left transition duration-200 cursor-pointer relative overflow-hidden group"
                    >
                      {hasDiscount && variant.discount_text && (
                        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black px-3 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <Zap className="w-2.5 h-2.5 fill-current" />
                          {variant.discount_text}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800 text-base">{variant.duration_label}</p>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">Valid for {variant.duration_days} days</p>
                      </div>
                      <div className="text-right pt-1">
                        <div className="flex items-baseline justify-end gap-1.5">
                          {hasDiscount && (
                            <span className="text-slate-400 line-through text-xs font-semibold">
                              ₹{variant.base_price.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className={`font-black text-xl ${hasDiscount && activePrice === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                            {formatPriceDisplay(activePrice)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                // Fallback: no variants in DB — offer 1 month and 3 months
                <>
                  <button
                    onClick={() => handleConfirmVariant({
                      id: "",
                      plan_id: selectedPlanForModal.id,
                      duration_label: "1 Month",
                      duration_days: 30,
                      base_price: selectedPlanForModal.cartPrice,
                      discounted_price: null,
                      discount_text: null,
                      discount_end_date: null,
                      is_active: true,
                    })}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 text-left transition duration-200 cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-800 text-base">1 Month</p>
                      <p className="text-slate-400 text-xs mt-0.5 font-medium">Billed monthly</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-lg">
                        ₹{selectedPlanForModal.cartPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleConfirmVariant({
                      id: "",
                      plan_id: selectedPlanForModal.id,
                      duration_label: "3 Months",
                      duration_days: 90,
                      base_price: selectedPlanForModal.cartPrice * 3,
                      discounted_price: null,
                      discount_text: null,
                      discount_end_date: null,
                      is_active: true,
                    })}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 text-left transition duration-200 cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-800 text-base">3 Months</p>
                      <p className="text-slate-400 text-xs mt-0.5 font-medium">Billed quarterly</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-lg">
                        ₹{(selectedPlanForModal.cartPrice * 3).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Cancel */}
            <button
              onClick={() => setShowDurationModal(false)}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition text-xs uppercase tracking-widest cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};