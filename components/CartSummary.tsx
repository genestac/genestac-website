"use client";

import React from "react";
import { formatINR } from "@/lib/currency";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: string;
  plan_id: string;
  plans: {
    name: string;
    cart_name: string;
    price: number;
    image: string;
  };
}

interface CartSummaryProps {
  items: CartItem[];
  onRemove?: (planId: string) => void;
  onClear?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ items, onRemove, onClear }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-100">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Your cart is empty</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Looks like you haven&apos;t added any plan, medicine, or wellness formulation to your cart yet.
        </p>
        <Link
          href="/weightloss?scrollTo=pricing"
          className="mt-5 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition duration-200"
        >
          Explore Plans
        </Link>
      </div>
    );
  }

  const handleRemove = (item: CartItem) => {
    onRemove?.(item.plan_id);
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <div className="space-y-4">
      
      {/* Table/List Header */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-[10px] font-bold text-slate-800 uppercase tracking-wider px-2 pb-2 border-b border-slate-100">
        <div className="col-span-6">Product Details</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-2 text-right">Total</div>
        <div className="col-span-1"></div>
      </div>

      {/* Cart Items list */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const price = Number(item.plans.price);
          const name = item.plans.cart_name || item.plans.name;
          return (
            <div
              key={item.plan_id}
              className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-1"
            >
              {/* Product Info (Col 1-6) */}
              <div className="col-span-6 flex items-center gap-4">
                <div className=" rounded-xl p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/logo2.png"
                    alt={name}
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-md font-bold text-slate-800 truncate leading-snug">
                    {name}
                  </h4>
                  <p className="text-sm text-slate-800 mt-0.5 font-medium">
                    {formatINR(price)} subscription
                  </p>
                </div>
              </div>

              {/* Quantity Controls (Col 3) */}
              <div className="col-span-3 flex justify-start sm:justify-center">
                <span className="rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800">
                  1
                </span>
              </div>

              {/* Item Total (Col 2) */}
              <div className="col-span-2 text-left sm:text-right font-extrabold text-slate-800 text-sm">
                {formatINR(price)}
              </div>

              {/* Remove Trigger (Col 1) */}
              <div className="col-span-1 text-right">
                <button
                  onClick={() => handleRemove(item)}
                  className="p-2 text-slate-800 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-150"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Cart Actions Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        {onClear && (
          <button
            onClick={handleClear}
            className="text-xs text-slate-800 hover:text-slate-600 font-semibold transition hover:underline"
          >
            Clear Shopping Cart
          </button>
        )}
        
        <span className="text-xs text-slate-800 font-semibold bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg">
          Free Insured Shipping Applied
        </span>
      </div>

    </div>
  );
};

export default CartSummary;
