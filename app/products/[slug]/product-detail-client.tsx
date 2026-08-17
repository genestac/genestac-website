"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { formatINR } from "@/lib/currency";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ProductDetailClient({ product, variants }: { product: any, variants: any[] }) {
  const { addToCart } = useCart();
  const { setCartOpen } = useModals();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants.length > 0 ? variants[0].id : ""
  );
  
  const selectedVariant = variants.find(v => v.id === selectedVariantId) || null;
  const price = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price;
  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : product.stock_quantity > 0;
  
  const hasDiscount = comparePrice && comparePrice > price;
  const discountPct = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart({
      name: selectedVariant ? `${product.name} - ${selectedVariant.label}` : product.name,
      price: price,
      image: product.image_url || "",
      requires_prescription: product.requires_prescription
    });
    setCartOpen(true);
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "#1f2937",
      background: "#ffffff",
      minHeight: "100vh",
      paddingTop: "90px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 32px 60px" }}>
        
        {/* Breadcrumb */}
        <div style={{ marginBottom: "24px" }}>
          <Link href="/products" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500
          }}>
            <ChevronLeft size={16} /> Back to Products
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "flex-start" }}>
          
          {/* Left Column: Image */}
          <div style={{
            background: "#f9fafb",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1/1",
            padding: "40px"
          }}>
            {discountPct > 0 && (
              <span style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "#fee2e2",
                color: "#dc2626",
                fontSize: "13px",
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: "6px",
                letterSpacing: "0.02em",
                zIndex: 10
              }}>
                -{discountPct}%
              </span>
            )}
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            ) : (
              <span style={{ fontSize: "64px", opacity: 0.1 }}>📦</span>
            )}
          </div>

          {/* Right Column: Details */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              {product.requires_prescription && (
                <span style={{
                  background: "#fef3c7",
                  color: "#d97706",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}>
                  Rx Required
                </span>
              )}
              {product.category && (
                <span style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {product.category}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "8px", lineHeight: 1.1 }}>
              {product.name}
            </h1>

            <p style={{ color: "#6b7280", fontSize: "16px", fontWeight: 500, marginBottom: "24px" }}>
              by {product.manufacturer || "Genestac Labs"}
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "32px" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: "#111827" }}>
                {formatINR(price)}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: "18px", color: "#9ca3af", textDecoration: "line-through", fontWeight: 500 }}>
                  {formatINR(comparePrice)}
                </span>
              )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Select Option
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      style={{
                        padding: "12px 18px",
                        border: selectedVariantId === v.id ? "2px solid #0ea5e9" : "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: selectedVariantId === v.id ? "#f0f9ff" : "#fff",
                        color: selectedVariantId === v.id ? "#0369a1" : "#4b5563",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{
                width: "100%",
                background: inStock ? "#0ea5e9" : "#e5e7eb",
                color: inStock ? "#fff" : "#9ca3af",
                padding: "16px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                fontWeight: 700,
                cursor: inStock ? "pointer" : "not-allowed",
                transition: "background 0.2s",
                marginBottom: "32px"
              }}
              onMouseEnter={(e) => { if(inStock) e.currentTarget.style.background = "#0284c7" }}
              onMouseLeave={(e) => { if(inStock) e.currentTarget.style.background = "#0ea5e9" }}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Description and Info */}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Description</h3>
              <div style={{ color: "#4b5563", fontSize: "15px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {product.description || "No description provided."}
              </div>
            </div>

            {/* Structured Info */}
            <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {product.storage_instructions && (
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Storage
                  </h4>
                  <p style={{ fontSize: "14px", color: "#1f2937", fontWeight: 500 }}>
                    {product.storage_instructions}
                  </p>
                </div>
              )}
              {product["Dosage/Strength"] && (
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Dosage / Strength
                  </h4>
                  <p style={{ fontSize: "14px", color: "#1f2937", fontWeight: 500 }}>
                    {product["Dosage/Strength"]}
                  </p>
                </div>
              )}
              {product.sku && (
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    SKU
                  </h4>
                  <p style={{ fontSize: "14px", color: "#1f2937", fontWeight: 500 }}>
                    {selectedVariant ? selectedVariant.sku || product.sku : product.sku}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
