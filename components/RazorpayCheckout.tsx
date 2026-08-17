"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext"; // ✅ add this

interface RazorpayCheckoutProps {
  amount: number; // in paise (includes GST)
  originalAmount: number; // in paise (plan price before discount & GST)
  planName: string;
  planId?: string;
  variantId?: string;
  discountAmount?: number; // in paise (actual savings, defaults to originalAmount - amount)
  gstPercentage: number;
  taxAmount?: number; // in rupees, pre-calculated GST amount from pricing API
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  couponId?: string;
  shippingAddressId?: string | null;
  items?: any[];
  prescriptionUrl?: string | null;
  needsConsultation?: boolean;
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).Razorpay) return Promise.resolve();

  const existing = document.querySelector(
    'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay checkout script")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Razorpay checkout script"));
    document.body.appendChild(script);
  });
}

// ✅ Removed async — Client Components must be synchronous
export default function RazorpayCheckout({
  amount,
  originalAmount,
  planName,
  planId,
  variantId,
  discountAmount: propDiscountAmount,
  gstPercentage,
  taxAmount: propTaxAmount,
  prefill = {},
  couponId,
  shippingAddressId,
  items,
  prescriptionUrl,
  needsConsultation,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // ✅ user stored in state
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    // ✅ Fetch user inside useEffect, not at the top level
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        toast.error("Login to add to cart");
        return;
      }
      setUserId(user?.id ?? null);
    };

    fetchUser();

    // Preload Razorpay script on mount
    loadRazorpayScript().catch(() => {
      // Handled again at checkout time
    });
  }, []);

  const handleCheckout = async () => {
    if (loading) return;

    console.log("[Checkout] userId at click time:", userId);
    console.log("[Checkout] amount (paise):", amount, "grandTotal (rupees):", amount / 100);
    console.log("[Checkout] planName:", planName, "shippingAddressId:", shippingAddressId);

    // ✅ Guard: make sure we have a user before even opening the modal
    if (!userId) {
      toast.error("You must be logged in to make a payment.");
      return;
    }

    if (!shippingAddressId) {
      toast.error(
        "Please add a shipping address before proceeding to payment.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await loadRazorpayScript();

      const calculatedGrandTotal = amount / 100;
      const calculatedOriginal = originalAmount / 100;
      const calculatedDiscount =
        (propDiscountAmount ?? originalAmount - amount) / 100;
      const calculatedTax =
        propTaxAmount ??
        (Math.round(
          (((calculatedOriginal - calculatedDiscount) * gstPercentage) / 100) *
            100,
        ) / 100);

      const payload = {
          userId,
          originalAmount: calculatedOriginal,
          discountAmount: calculatedDiscount,
          taxAmount: calculatedTax,
          grandTotal: calculatedGrandTotal,
          shippingAddressId: shippingAddressId || undefined,
          items: items && items.length > 0 ? items.map((item) => ({
            item_type: item.category || "plan",
            item_name: item.name,
            plan_id: item.planId || undefined,
            variant_id: variantId,
            quantity: item.qty || 1,
            unit_price: Number(item.price),
            total_price: Number(item.price) * (item.qty || 1),
          })) : [
            {
              item_type: "plan",
              item_name: planName,
              plan_id: planId,
              variant_id: variantId,
              quantity: 1,
              unit_price: calculatedOriginal,
              total_price: calculatedOriginal,
            },
          ],
          couponId,
          prescriptionUrl,
          needsConsultation
        };
      console.log("[Checkout] Sending payload to /api/checkout:", JSON.stringify(payload));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to create order");
      }

      // Handle free orders (100% coupon discount) — no Razorpay required
      if (data.freeOrder) {
        toast.success("Order placed successfully! (100% discount applied)");
        clearCart();
        router.push("/dashboard/order/success");
        setLoading(false);
        return;
      }

      const keyId = data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error(
          "Payment gateway is not configured. Please contact support.",
        );
      }

      const options = {
        key: keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Genestac Therapeutics",
        description: "Genestac Therapeutics Plan Payment",
        image: "/logo.jpeg",
        order_id: data.orderId,

        // method: {
        //   netbanking: false,
        //   card: false,
        //   wallet: false,
        //   upi: true,
        //   paylater: false,
        //   emi: false,
        //   cardless_emi: false,
        // },

        // Optional: skip the method-selection screen and land straight on UPI
        // config: {
        //   display: {
        //     blocks: {
        //       upi: {
        //         name: "Pay via UPI",
        //         instruments: [{ method: "upi" }],
        //       },
        //     },
        //     sequence: ["block.upi"],
        //     preferences: {
        //       show_default_blocks: false, // hides all other default payment blocks
        //     },
        //   },
        // },

        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setShowMessage(true);
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                amount: data.amount,
                couponId,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              toast.error(
                verifyData.message ||
                  "Payment verification failed. Please contact support.",
              );
              return;
            }

            // Fetch existing metadata to merge
            const { data: userRow } = await supabase
              .from("users")
              .select("metadata")
              .eq("id", userId)
              .single();

            const currentMetadata = userRow?.metadata || {};

            const { error: profileError } = await supabase
              .from("users")
              .update({
                metadata: {
                  ...currentMetadata,
                  plan: planName,
                },
              })
              .eq("id", userId);

            if (profileError) {
              console.log("error updating plan detail for user", profileError);
              toast.error("Error updating plan detail");
            }

            fetch("/api/payment/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId,
                rzpOrderId: response.razorpay_order_id,
                rzpPaymentId: response.razorpay_payment_id,
                amount: data.amount,
                originalAmount,
                planName,
                discountAmount:
                  propDiscountAmount ?? originalAmount - data.amount,
              }),
            }).catch((err) =>
              console.error("Failed to trigger payment completion:", err),
            );

            clearCart();
            router.push("/dashboard/order/success");
          } catch (verifyErr: unknown) {
            console.error("Verification error:", verifyErr);
            toast.error(
              "Payment completed but verification failed. " +
                `Contact support with Payment ID: ${response.razorpay_payment_id}`,
            );
            setShowMessage(false);
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: prefill.name || "",
          email: prefill.email || "",
          contact: prefill.contact || "",
        },
        notes: {
          source: "Genestac Patient Dashboard",
        },
        theme: {
          color: "#001f3f",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay payment failed:", response.error);
        toast.error(
          `Payment failed: ${response.error.description || "Please try again."}`,
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      console.error("Checkout error:", err);
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <>
      {showMessage && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-lg font-bold text-slate-800">
            Don&apos;t close the window, Please wait
          </p>
          <p className="text-sm text-slate-500 mt-2">
            We are confirming your payment and setting up your account…
          </p>
        </div>
      )}
      <div className="relative group">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2.5 font-extrabold px-6 py-4 rounded-2xl transition-all duration-200 shadow-lg active:scale-[0.98] text-sm ${
            !shippingAddressId
              ? "bg-black text-white group-hover:bg-white group-hover:text-blue-600 group-hover:border-2 group-hover:border-blue-600 disabled:cursor-not-allowed"
              : "bg-[#001f3f] hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-[#F5E6CC] shadow-slate-900/10"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Opening Payment…</span>
            </>
          ) : !shippingAddressId ? (
            <>
              <span className="group-hover:hidden flex gap-3">
                <Lock className="w-4 h-4" />
                Proceed to Payment
              </span>
              <span className="hidden group-hover:inline">
                Please enter your address
              </span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Proceed to Payment</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
