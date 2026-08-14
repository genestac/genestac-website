"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { formatINR } from "@/lib/currency";
import { X, ShoppingCart, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const CartModal: React.FC = () => {
  const { isCartOpen, setCartOpen } = useModals();
  const { cart, subtotal, changeQty, cartSummaryText } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-950/70 backdrop-blur-lg z-[120] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 transition-opacity">
      <div className="bg-white relative animate-fade-in w-full max-w-md max-h-[92vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
        
        <button
          onClick={() => setCartOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-brand-900 transition-colors bg-brand-50 p-2.5 rounded-full shadow-sm z-30 hover:rotate-90 transition-transform duration-300"
        >
          <X className="h-5 w-5" />
        </button>

        {/* CART ITEMS */}
        <div className="w-full p-5 sm:p-8 bg-slate-50 overflow-y-auto flex flex-col" style={{maxHeight: 'min(85vh, 600px)', minHeight: '400px'}}>
          <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="p-2.5 bg-brand-100 rounded-xl text-brand-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-brand-950">Your Cart</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {cart.length} Item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Dynamic Cart Items Container */}
          <div className="flex-1 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center justify-center opacity-50">
                <ShoppingBag className="h-12 w-12 mb-3" />
                <p className="text-slate-500 font-bold">Your cart is empty.</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm animate-fade-in"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-brand-950 text-sm truncate">{item.name}</h4>
                    <div className="text-brand-600 font-extrabold text-sm mt-0.5">
                      {formatINR(item.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100">
                    <button
                      type="button"
                      onClick={() => changeQty(index, -1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-brand-600 font-bold text-slate-500"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold w-4 text-center text-slate-700">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQty(index, 1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-brand-600 font-bold text-slate-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="flex justify-between items-center mb-2 text-slate-500 font-medium text-sm">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-emerald-600 font-bold text-sm">
              <span>Discount (Online Order)</span>
              <span>-{formatINR(0)}</span>
            </div>
            <div className="flex justify-between items-end border-t border-slate-200 pt-4">
              <span className="text-sm font-extrabold text-brand-950 uppercase tracking-widest">
                Total Amount
              </span>
              <span className="text-3xl font-extrabold text-brand-900">
                {formatINR(subtotal)}
              </span>
            </div>
          </div>
        </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setCartOpen(false);
                  router.push("/dashboard/cart");
                }}
                disabled={cart.length === 0}
                className="w-full py-4 bg-brand-900 text-white rounded-2xl font-extrabold uppercase tracking-[0.1em] text-sm shadow-luxury hover:bg-brand-950 transition-all hover:scale-[1.02] btn-shine flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </button>
            </div>
      </div>
    </div>
  );
};
