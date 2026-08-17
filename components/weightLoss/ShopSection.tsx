"use client";

import React, { useState } from "react";
import { products, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { FlaskConical, ShoppingCart, Check } from "lucide-react";

export const ShopSection: React.FC = () => {
  const { addToCart } = useCart();
  const { setCartOpen } = useModals();
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;

    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      requires_prescription: product.requires_prescription
    });

    // Visual button feedback
    setAddedItemName(product.name);
    setTimeout(() => {
      setAddedItemName(null);
    }, 2000);

    // Auto open cart modal
    setCartOpen(true);
  };

  return (
    <section id="shop" className="py-16 relative overflow-hidden bg-transparent z-10 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-brand-600 font-extrabold tracking-[0.25em] uppercase text-[10px] mb-4 block">
            Premium Dispensary
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-4">Targeted Peptide Formulations.</h2>
          <p className="text-slate-600 font-medium text-sm mb-8 max-w-2xl mx-auto">
            Clinical-grade compounds engineered for specific physiological outcomes.
          </p>
        </div>

        {/* Full 20 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isAdded = addedItemName === product.name;
            return (
              <div
                key={product.name}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(12,74,110,0.08)] transition-all duration-500 group flex flex-col h-full relative"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-6 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-extrabold text-brand-950 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1.5 text-[#0ea5e9] text-[9px] font-extrabold uppercase tracking-widest mb-4">
                    <FlaskConical className="h-3.5 w-3.5" />
                    <span>{product.purity}</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900">${product.price}</span>
                        {product.originalPrice > 0 && (
                          <span className="text-lg font-medium text-slate-400 line-through decoration-slate-300">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                          product.inStock
                            ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                            : "text-red-600 bg-red-50 border-red-100"
                        }`}
                      >
                        {product.inStock ? (
                          <>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            In Stock
                          </>
                        ) : (
                          "Out of Stock"
                        )}
                      </div>
                    </div>
                    <div className="text-red-500 text-[10px] font-extrabold uppercase tracking-widest mb-6 min-h-[15px]">
                      {product.discount}
                    </div>
                    <button
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-4 rounded-xl font-extrabold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] group-hover:-translate-y-1 cursor-pointer ${
                        !product.inStock
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                          : isAdded
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                          : "bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-[#0ea5e9]/20"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4" /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
