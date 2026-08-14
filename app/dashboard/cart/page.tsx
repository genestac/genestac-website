"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartSummary from "@/components/CartSummary";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  Tag,
  ShoppingBag,
  Home,
  LogIn,
  FileUp,
  CalendarCheck,
  Check
} from "lucide-react";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import { formatINR } from "@/lib/currency";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import CouponInput from "@/components/CouponInput";
import AddressSelector from "@/components/AddressSelector";
import AgeGenderPrompt from "@/components/AgeGenderPrompt";

interface CartItem {
  id: string;
  plan_id: string;
  plans: {
    name: string;
    cart_name: string;
    price: number;
    image: string;
    gst_percentage: number;
  };
}

import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, clearCart, changeQty, totalItems, subtotal } = useCart();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Fallback for single plan (for backward compatibility where only one plan was expected)
  const planName = cart[0]?.name ?? "";
  const selectedPlanId = cart[0]?.planId ?? "";
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);

  const [userEmail, setUserEmail] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.replace("/login");
        return;
      }
      setCheckingAuth(false);

      const guestItem = localStorage.getItem("guest_cart_item");
      if (guestItem) {
        try {
          const parsed = JSON.parse(guestItem);
          if (parsed.planId) {
            // Note: CartContext's syncCartFromDb won't pick this up immediately if we don't reload or manually add it,
            // but the user is logged in now. The guest_cart_item logic could be refactored, but for now we just sync it to DB.
            await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ planId: parsed.planId }),
            });
            // We reload so CartContext picks it up properly.
            window.location.reload();
          }
          if (parsed.variantId) {
            setSelectedVariantId(parsed.variantId);
          }
          localStorage.removeItem("guest_cart_item");
        } catch {
          // ignore
        }
      }
    };
    init();
  }, [router]);

  const [discountPercentage, setDiscountPercentage] = useState(0);
  
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);
  const [isUploadingRx, setIsUploadingRx] = useState(false);
  const [bookingConsultation, setBookingConsultation] = useState(false);

  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponId, setCouponId] = useState<string | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [ageGenderPopupOpen, setAgeGenderPopupOpen] = useState(false);

  const [isBypassed] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("bypassAuth") === "true",
  );

  const [pricing, setPricing] = useState<{
    basePrice: number;
    gstPercentage: number;
    gstAmount: number;
    finalTotal: number;
  } | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  useEffect(() => {
    if (!cart.length) {
      setPricing(null);
      return;
    }

    setPricingLoading(true);
    fetch("/api/pricing/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPricing(data);
        }
      })
      .finally(() => setPricingLoading(false));
  }, [cart, selectedVariantId, discountPercentage]);

  
  const requiresRx = cart.some((item) => item.requires_prescription);
  const hasFulfilledRx = prescriptionUrl !== null || bookingConsultation || !requiresRx;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingRx(true);
    try {
      const url = await uploadToCloudinary(file);
      setPrescriptionUrl(url);
      setBookingConsultation(false);
    } catch (err: any) {
      alert("Failed to upload prescription: " + err.message);
    } finally {
      setIsUploadingRx(false);
    }
  };

  const handleBookConsultation = async () => {
    setBookingConsultation(true);
    setPrescriptionUrl(null);
    try {
      const { data, error } = await supabase.from("plans").select("*").order("created_at", { ascending: true }).limit(1).single();
      if (data && !error) {
        addToCart({
          id: data.id,
          name: data.cart_name || data.name,
          price: data.price,
          image: data.image_url || "/cropped-Genestac-Logo-1-300x300-removebg-preview.png",
          category: "plan",
          planId: data.id
        });
      }
    } catch (err) {
      console.error("Failed to fetch consultation plan", err);
    }
  };

  const gstPercentage = pricing?.gstPercentage ?? 0;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const gstAmount = pricing?.gstAmount ?? 0;
  const finalTotal = pricing?.finalTotal ?? 0;

  const handleDiscountApplied = (data: {
    percentage: number;
    couponId: string;
    code: string;
  }) => {
    setDiscountPercentage(data.percentage);
    setCouponId(data.couponId);
    setActiveCoupon(data.code);
  };

  const handleRemoveCoupon = () => {
    setDiscountPercentage(0);
    setCouponId(null);
    setActiveCoupon(null);
  };

  const handleAgeSave = async (age: number, gender: "male" | "female" | "other") => {
    if (!user) return;
    const { data } = await supabase.from("users").select("metadata").eq("id", user.id).single();
    const meta = (data?.metadata as Record<string, any>) || {};
    await supabase.from("users").update({ metadata: { ...meta, age, gender } }).eq("id", user.id);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setUserEmail(user?.email ?? "");

      if (!user) return;

      const { data: userData, error } = await supabase
        .from("users")
        .select("id, metadata")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const metadata = userData?.metadata || {};

      const hasAge = metadata.age !== undefined && metadata.age !== null && metadata.age !== "";
      const hasGender = metadata.gender !== undefined && metadata.gender !== null && metadata.gender !== "";

      if (!hasAge || !hasGender) {
        setAgeGenderPopupOpen(true);
      }
    };
    fetchUser();
  }, []);

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
      active: true,
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      label: "Orders",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: `/dashboard/order${isBypassed ? "?bypassAuth=true" : ""}`,
    },
  ];

  if (checkingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Sticky Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 shadow-sm z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">
            Checkout
          </span>
          {isBypassed && (
            <span className="ml-1 text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
              Dev Bypass Mode
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard${isBypassed ? "?bypassAuth=true" : ""}`}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition text-xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            Continue Browsing
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
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Review Cart
            </h1>
            <p className="text-sm font-medium text-slate-800 mt-1">
              Verify your selected plan, prescriptions, and wellness items
              before completing the transaction.
            </p>
          </div>

          {/* Loading State */}
          {checkingAuth ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              {/* Left: Items */}
              <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm self-start">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-slate-800">
                    Your Selected Items
                  </h2>
                  <p className="text-xs text-slate-800 mt-0.5">
                    {totalItems} item{totalItems !== 1 ? "s" : ""} currently
                    added
                  </p>
                </div>
                <CartSummary
                  items={cart}
                  onRemove={(name) => removeFromCart(name)}
                  onClear={() => clearCart()}
                  onChangeQty={(idx, delta) => changeQty(idx, delta)}
                />
              </section>

              {/* Right: Summary */}
              {cart.length > 0 ? (
                <aside className="bg-white border border-slate-100 rounded-3xl p-6 shadow--sm space-y-6 self-start">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">
                      Order Invoice Summary
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Summary of charges
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pb-4 border-b border-slate-100">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="text-slate-800 font-bold">
                        {formatINR(subtotal)}
                      </span>
                    </div>

                    {activeCoupon && discountAmount > 0 && (
                      <div className="flex justify-between text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Promo Discount ({discountPercentage}% Off)
                        </span>
                        <span className="font-bold">
                          -{formatINR(discountAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Insured Shipping</span>
                      <span className="text-emerald-600 font-extrabold uppercase text-[10px]">
                        Free
                      </span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>GST ({gstPercentage}%)</span>
                      <span className="text-slate-800 font-bold">
                        {!pricing || pricingLoading ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full" />
                            <span className="text-slate-400">calculating…</span>
                          </span>
                        ) : (
                          formatINR(gstAmount)
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-800">
                      Net Payable Total
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {!pricing || pricingLoading ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                          <span className="text-base text-slate-400">recalculating…</span>
                        </span>
                      ) : (
                        formatINR(finalTotal)
                      )}
                    </span>
                  </div>

                  {/* Promo */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Discount Code
                    </label>
                    <CouponInput
                      selectedPlanId={selectedPlanId}
                      selectedVariantId={selectedVariantId}
                      onDiscountApplied={handleDiscountApplied}
                      onRemove={handleRemoveCoupon}
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="pt-2 border-t border-slate-100">
                    <AddressSelector
                      userId={user?.id ?? ""}
                      selectedAddressId={selectedAddressId}
                      onSelect={setSelectedAddressId}
                    />
                  </div>

                  
                  {/* Prescription Section */}
                  {requiresRx && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                        <h4 className="text-amber-800 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Prescription Required
                        </h4>
                        <p className="text-amber-700 text-xs mb-3">
                          One or more items in your cart require a valid medical prescription.
                        </p>
                        
                        {!hasFulfilledRx ? (
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center justify-center gap-2 w-full bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition">
                              {isUploadingRx ? (
                                <span className="animate-spin h-4 w-4 border-2 border-amber-700 border-t-transparent rounded-full" />
                              ) : (
                                <FileUp className="w-4 h-4" />
                              )}
                              {isUploadingRx ? "Uploading..." : "Upload Prescription"}
                              <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={isUploadingRx} />
                            </label>
                            
                            <div className="text-center text-[10px] text-amber-600 font-semibold my-1">OR</div>
                            
                            <button onClick={handleBookConsultation} className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition">
                              <CalendarCheck className="w-4 h-4" /> Book Consultation
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-xs font-bold">
                            <div className="flex items-center gap-1.5">
                              <Check className="w-4 h-4" /> 
                              {prescriptionUrl ? "Prescription Uploaded" : "Consultation Booked"}
                            </div>
                            <button onClick={() => { setPrescriptionUrl(null); setBookingConsultation(false); }} className="text-emerald-600 hover:text-emerald-800 underline text-[10px]">Change</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  <div className="pt-2">
                    {!pricing || !hasFulfilledRx ? (
                      <div className="w-full flex items-center justify-center gap-2 font-extrabold px-6 py-4 rounded-2xl bg-slate-100 text-slate-400 text-sm cursor-not-allowed">
                        <span className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full" />
                        {!pricing ? "Loading pricing..." : "Prescription Required"}
                      </div>
                    ) : (
                      <RazorpayCheckout
                        amount={Math.round(finalTotal * 100)}
                        originalAmount={Math.round(subtotal * 100)}
                        discountAmount={Math.round(discountAmount * 100)}
                        gstPercentage={gstPercentage}
                        taxAmount={gstAmount}
                        planName={planName} // used for single-plan backwards compatibility where needed
                        planId={selectedPlanId}
                        variantId={selectedVariantId}
                        prefill={{ email: userEmail }}
                        couponId={couponId ?? undefined}
                        shippingAddressId={selectedAddressId}
                        items={cart}
                        prescriptionUrl={prescriptionUrl}
                        needsConsultation={bookingConsultation}
                      />
                    )}
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> SSL
                      Encrypted & Authenticated
                    </p>
                  </div>

                  {/* Value Badges */}
                  <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                    {[
                      {
                        icon: <Truck className="w-4 h-4 text-blue-500" />,
                        label: "Free Insured Shipping",
                      },
                      {
                        icon: <RotateCcw className="w-4 h-4 text-purple-500" />,
                        label: "Refundable Consultation Fee",
                      },
                      {
                        icon: (
                          <BadgeCheck className="w-4 h-4 text-emerald-500" />
                        ),
                        label: "Certified Grade Ingredients",
                      },
                    ].map(({ icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-600 font-semibold"
                      >
                        {icon}
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Your Cart is Empty
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Once you add a plan, prescription medication, or health
                    supplement from the dashboard, you will be able to review
                    the price calculations and complete checkout here.
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Browse Plans
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AgeGenderPrompt
        isOpen={ageGenderPopupOpen}
        onClose={() => setAgeGenderPopupOpen(false)}
        onSave={handleAgeSave}
      />
    </div>
  );
};

export default CartPage;
