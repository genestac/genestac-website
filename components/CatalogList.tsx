"use client";

import React, { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { formatINR } from "@/lib/currency";
import { ShoppingCart, Check, Sparkles, AlertCircle } from "lucide-react";

export const CatalogList: React.FC = () => {
  const { addToCart } = useCart();
  const { setCartOpen } = useModals();
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAddToCart = (p: any) => {
    addToCart({ 
      name: p.name, 
      price: p.price, 
      image: p.image,
      requires_prescription: p.requires_prescription
    });
    setAddedItem(p.name);
    setCartOpen(true);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Prescription & Wellness Catalog
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Select practitioner-verified weight loss formulations, vitamins, and peptides.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100 self-start">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>Consultation required for final dispensing approval</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.slice(0, 12).map((p) => {
          const isAdded = addedItem === p.name;
          return (
            <div
              key={p.name}
              className="flex flex-col rounded-3xl border border-slate-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 relative overflow-hidden group"
            >
              
              {/* Discount Badge */}
              {p.originalPrice > p.price && (
                <span className="absolute top-4 left-4 z-10 bg-red-50 text-red-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-wider">
                  Save {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                </span>
              )}

              {/* Product Image Container */}
              <div className="flex items-center justify-center p-6 bg-slate-50/50 rounded-t-3xl border-b border-slate-50 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5 space-y-4">
                
                {/* Title & Badge */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      {p.purity || "Premium"}
                    </span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-800 line-clamp-1 leading-snug group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Pricing Block */}
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-slate-900">
                        {formatINR(p.price)}
                      </span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatINR(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] text-red-500 font-semibold mt-0.5">
                        Save {formatINR(p.originalPrice - p.price)}
                      </span>
                    )}
                  </div>

                  {/* Stock tag */}
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${p.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {p.inStock ? "In Stock" : "Out"}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={!p.inStock}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer
                    ${
                      !p.inStock
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : isAdded
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
                    }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogList;