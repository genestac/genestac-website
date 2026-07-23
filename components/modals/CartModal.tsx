"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { formatINR } from "@/lib/currency";
import { X, ShoppingCart, Lock, ShoppingBag, Check } from "lucide-react";

export const CartModal: React.FC = () => {
  const { isCartOpen, setCartOpen } = useModals();
  const { cart, subtotal, changeQty, cartSummaryText } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderDetails: cartSummaryText,
          totalAmount: subtotal,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setCartOpen(false);
        }, 3000);
      } else {
        alert("There was an issue processing your order. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-950/70 backdrop-blur-lg z-[120] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 transition-opacity">
      <div className="bg-white relative animate-fade-in w-full max-w-5xl max-h-[92vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        <button
          onClick={() => setCartOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-brand-900 transition-colors bg-brand-50 p-2.5 rounded-full shadow-sm z-30 hover:rotate-90 transition-transform duration-300"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT SIDE: CART ITEMS */}
        <div className="w-full md:w-1/2 p-5 md:p-10 bg-slate-50 overflow-y-auto flex flex-col" style={{maxHeight: 'min(45vh, 320px)', minHeight: 0}}>
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

        {/* RIGHT SIDE: BILLING & CHECKOUT */}
        <div className="w-full md:w-1/2 p-5 md:p-10 bg-white overflow-y-auto border-t md:border-t-0 md:border-l border-slate-100 flex-1" style={{maxHeight: 'min(50vh, 400px)'}}>
          {submitSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-200">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-serif text-brand-950 mb-3">Order Received!</h2>
              <p className="text-slate-600 font-medium max-w-sm">
                Thank you for your order. We are processing it securely and will contact you shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-brand-950 mb-2">Secure Checkout</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest flex items-center gap-1">
                  <Lock className="h-3 w-3 text-emerald-500" /> 256-bit Encryption
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-brand-900 border-b border-slate-100 pb-2">
                    Shipping Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Full Delivery Address"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-brand-900 border-b border-slate-100 pb-2 mt-6">
                    Payment Method
                  </h3>
                  {/* Dummy Payment UI for demonstration */}
                  <div className="p-4 border-2 border-brand-500 bg-brand-50/50 rounded-xl flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-4 border-brand-500 bg-white"></div>
                      <span className="font-bold text-sm text-brand-950">Credit / Debit Card</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-slate-200 rounded text-[8px] flex justify-center items-center font-bold text-slate-500">
                        VISA
                      </div>
                      <div className="w-8 h-5 bg-slate-200 rounded text-[8px] flex justify-center items-center font-bold text-slate-500">
                        MC
                      </div>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Card Number (For Demo Only)"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="expiry"
                        required
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="cvc"
                        required
                        value={formData.cvc}
                        onChange={handleInputChange}
                        placeholder="CVC"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 bg-brand-900 text-white rounded-2xl font-extrabold uppercase tracking-[0.2em] text-[11px] shadow-luxury hover:bg-brand-950 transition-all hover:scale-[1.02] btn-shine mt-6 border border-brand-800 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="h-4 w-4" />{" "}
                  {isSubmitting ? "Processing..." : "Place Order Securely"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
