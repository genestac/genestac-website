"use client";
import { useState, useEffect } from "react";
import { Check, Trash2 } from "lucide-react";

export interface CouponInputProps {
  selectedPlanId: string;
  selectedVariantId?: string;
  onDiscountApplied: (data: { percentage: number; couponId: string; code: string }) => void;
  onRemove?: () => void;
}

export default function CouponInput({ selectedPlanId, selectedVariantId, onDiscountApplied, onRemove }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [appliedCode, setAppliedCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const couponParam = params.get("coupon");
      if (couponParam) {
        setCode(couponParam.toUpperCase());
      }
    }
  }, []);

  const handleApply = async () => {
    if (!code) return;
    setLoading(true);
    setMessage("");

    const trimmedCode = code.trim().toUpperCase();

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmedCode, planId: selectedPlanId, variantId: selectedVariantId || undefined }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Invalid coupon code.");
      }

      setMessage(`${data.percentage}% discount applied.`);
      setAppliedCode(trimmedCode);
      setIsSuccess(true);

      onDiscountApplied({
        percentage: data.percentage,
        couponId: data.couponId,
        code: trimmedCode,
      });
    } catch (err: any) {
      setMessage(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setAppliedCode("");
    setMessage("");
    setIsSuccess(false);
    onRemove?.();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {isSuccess ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex-1">
              {appliedCode}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600">{message}</span>
          </div>
          <button
            onClick={handleRemove}
            title="Remove coupon"
            className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600 transition duration-150 cursor-pointer active:scale-95 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition placeholder:text-slate-400 uppercase"
          />
          <button
            onClick={handleApply}
            disabled={loading || !code}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer active:scale-95"
          >
            {loading ? "..." : "Apply"}
          </button>
        </div>
      )}
      {!isSuccess && message && (
        <p className="text-[10px] font-bold text-red-500 mt-1">{message}</p>
      )}
    </div>
  );
}
