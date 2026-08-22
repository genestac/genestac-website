"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { formatINR } from "@/lib/currency";
import Link from "next/link";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { UseCasesSection } from "@/components/product/UseCasesSection";

export function ProductDetailClient({
  product,
  variants,
  initialReviews,
  initialAggregate,
}: {
  product: any;
  variants: any[];
  initialReviews?: any[];
  initialAggregate?: { avg_rating: number; total_count: number; distribution: Record<number, number> };
}) {
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

  // Build image list: primary + extras from product.images array
  const allImages: string[] = [
    ...(product.image_url ? [product.image_url] : []),
    ...(Array.isArray(product.images)
      ? product.images.filter((img: string) => img && img !== product.image_url)
      : []),
  ];
  const [activeImg, setActiveImg] = useState(0);

  const prevImg = () => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % allImages.length);

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
        <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#6b7280" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#111827"} onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
            Home
          </Link>
          <span style={{ color: "#d1d5db" }}>/</span>
          <Link href="/products" style={{ color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#111827"} onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
            Products
          </Link>
          <span style={{ color: "#d1d5db" }}>/</span>
          <span style={{ color: "#111827", fontWeight: 600 }}>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "flex-start" }}>
          
          {/* Left Column: Image Gallery */}
          <div style={{ position: "sticky", top: "110px" }}>
            {/* Main image container */}
            <div style={{
              background: "linear-gradient(145deg, #f0fdf4 0%, #f9fafb 50%, #f0f9ff 100%)",
              borderRadius: "20px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              position: "relative",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}>
              {/* Ambient glow behind image */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              {/* Discount badge */}
              {discountPct > 0 && (
                <span style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#fff", fontSize: "13px", fontWeight: 800,
                  padding: "5px 12px", borderRadius: "20px",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.35)", zIndex: 10,
                }}>
                  -{discountPct}% OFF
                </span>
              )}
              {/* Prescription badge */}
              {product.requires_prescription && (
                <span style={{
                  position: "absolute", top: "16px", left: "16px",
                  background: "rgba(217,119,6,0.12)", color: "#b45309",
                  fontSize: "11px", fontWeight: 800,
                  padding: "4px 10px", borderRadius: "20px",
                  border: "1px solid rgba(217,119,6,0.25)", zIndex: 10,
                }}>
                  Rx
                </span>
              )}

              {/* Main image / Empty state */}
              {allImages.length > 0 ? (
                <img
                  key={activeImg}
                  src={allImages[activeImg]}
                  alt={[
                    product.name,
                    product.medical_active_ingredient,
                    product.manufacturer ? `by ${product.manufacturer}` : undefined,
                  ].filter(Boolean).join(" – ")}
                  loading="lazy"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    animation: "fadeIn 0.25s ease",
                  }}
                />
              ) : (
                /* Rich empty state when no image uploaded */
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{
                    width: "120px", height: "120px", margin: "0 auto 16px",
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "52px",
                    boxShadow: "0 20px 40px rgba(16,185,129,0.25)",
                  }}>
                    💊
                  </div>
                  <p style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 500 }}>
                    {product.name}
                  </p>
                  {product.manufacturer && (
                    <p style={{ fontSize: "12px", color: "#d1d5db" }}>{product.manufacturer}</p>
                  )}
                </div>
              )}

              {/* Prev/Next arrows for multiple images */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label="Previous image"
                    style={{
                      position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.9)", border: "1px solid #e5e7eb",
                      borderRadius: "50%", width: "36px", height: "36px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: "18px", zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >‹</button>
                  <button
                    onClick={nextImg}
                    aria-label="Next image"
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.9)", border: "1px solid #e5e7eb",
                      borderRadius: "50%", width: "36px", height: "36px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: "18px", zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >›</button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div style={{
                display: "flex", gap: "10px", marginTop: "14px",
                flexWrap: "wrap",
              }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    style={{
                      width: "68px", height: "68px",
                      borderRadius: "10px",
                      border: i === activeImg ? "2px solid #10b981" : "2px solid #e5e7eb",
                      background: "#f9fafb",
                      padding: "4px",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "border-color 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust signals below image */}
            <div style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}>
              {[
                { icon: "🔒", label: "Secure Checkout" },
                { icon: "🚚", label: "Pan-India Delivery" },
                { icon: "✅", label: "Authentic Products" },
                { icon: "👨‍⚕️", label: "Doctor Supervised" },
              ].map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "#f9fafb", border: "1px solid #e5e7eb",
                  borderRadius: "8px", padding: "10px 12px",
                }}>
                  <span style={{ fontSize: "16px" }}>{t.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{t.label}</span>
                </div>
              ))}
            </div>
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

            <p style={{ color: "#6b7280", fontSize: "16px", fontWeight: 500, marginBottom: "12px" }}>
              by {product.manufacturer || "Genestac Labs"}
            </p>

            {/* Inline aggregate rating from SSR data */}
            {initialAggregate && initialAggregate.total_count > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <span style={{ display: "inline-flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24"
                      fill={Math.round(initialAggregate.avg_rating) >= s ? "#f59e0b" : "none"}
                      stroke={Math.round(initialAggregate.avg_rating) >= s ? "#f59e0b" : "#d1d5db"}
                      strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#1f2937" }}>
                  {initialAggregate.avg_rating.toFixed(1)}
                </span>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>
                  ({initialAggregate.total_count} review{initialAggregate.total_count !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Conditions/symptoms tags */}
            {Array.isArray(product.conditions_symptoms) && product.conditions_symptoms.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {product.conditions_symptoms.map((tag: string, i: number) => (
                  <span key={i} style={{
                    background: "#f0fdf4", color: "#047857",
                    border: "1px solid #a7f3d0",
                    fontSize: "12px", fontWeight: 600,
                    padding: "4px 10px", borderRadius: "20px"
                  }}>{tag}</span>
                ))}
              </div>
            )}

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
                        border: selectedVariantId === v.id ? "2px solid #10b981" : "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: selectedVariantId === v.id ? "#ecfdf5" : "#fff",
                        color: selectedVariantId === v.id ? "#047857" : "#4b5563",
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
                background: inStock ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#e5e7eb",
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
              onMouseEnter={(e) => { if(inStock) e.currentTarget.style.background = "linear-gradient(135deg, #059669 0%, #047857 100%)" }}
              onMouseLeave={(e) => { if(inStock) e.currentTarget.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
            >
              {!inStock ? "Out of Stock" : (product.requires_prescription ? "Request Prescription" : "Add to Cart")}
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

        {/* --- Medical & Detailed Content Sections --- */}
        <div style={{ marginTop: "60px", display: "flex", flexDirection: "column", gap: "60px" }}>
          
          {product.medical_what_is && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "20px", color: "#111827" }}>What is {product.name}?</h2>
              <div style={{ color: "#4b5563", fontSize: "16px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {product.medical_what_is}
              </div>
            </section>
          )}

          {/* Expanded Product Information */}
          <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px", color: "#111827" }}>Product Information</h2>
            <div style={{ background: "#f9fafb", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    { label: "Active Ingredient", value: product.medical_active_ingredient },
                    { label: "Strength", value: product.medical_strength || product["Dosage/Strength"] },
                    { label: "Dosage Form", value: product.medical_dosage_form },
                    { label: "Manufacturer", value: product.manufacturer || "Genestac Labs" },
                    { label: "Approved Indication", value: product.medical_indication },
                    { label: "Prescription Status", value: product.requires_prescription ? "Prescription Required" : "Over-the-Counter" }
                  ].map((row, i) => row.value ? (
                    <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "#374151", width: "40%", background: "#f3f4f6" }}>{row.label}</td>
                      <td style={{ padding: "16px 20px", color: "#1f2937", background: "#ffffff" }}>{row.value}</td>
                    </tr>
                  ) : null)}
                </tbody>
              </table>
            </div>
          </section>

          {product.medical_how_it_works && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "20px", color: "#111827" }}>How it Works</h2>
              <div style={{ color: "#4b5563", fontSize: "16px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {product.medical_how_it_works}
              </div>
            </section>
          )}

          {product.medical_approved_uses && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "20px", color: "#111827" }}>Approved Uses</h2>
              <div style={{ color: "#4b5563", fontSize: "16px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {product.medical_approved_uses}
              </div>
            </section>
          )}

          {product.medical_safety_info && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "20px", color: "#ef4444" }}>Important Safety Information</h2>
              <div style={{ background: "#fef2f2", color: "#991b1b", padding: "24px", borderRadius: "12px", fontSize: "16px", lineHeight: 1.8, whiteSpace: "pre-wrap", border: "1px solid #fecaca" }}>
                {product.medical_safety_info}
              </div>
            </section>
          )}

          {product.medical_side_effects && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "20px", color: "#111827" }}>Possible Side Effects</h2>
              <div style={{ color: "#4b5563", fontSize: "16px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {product.medical_side_effects}
              </div>
            </section>
          )}

          {/* Workflow & Trust Sections */}
          <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "40px", color: "#111827", textAlign: "center" }}>Prescription & Medical Review Process</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
              {[
                { step: "1", title: "Select Product", desc: "Choose your required medication." },
                { step: "2", title: "Upload Prescription", desc: "Complete medical assessment or upload your valid Rx." },
                { step: "3", title: "Medical Review", desc: "Our licensed healthcare professionals review your request." },
                { step: "4", title: "Order Confirmed", desc: "Once approved, your order is processed securely." },
                { step: "5", title: "Dispatched", desc: "Medicine is packaged and shipped with care." }
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#ecfdf5", color: "#047857", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, margin: "0 auto 16px" }}>
                    {s.step}
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>{s.title}</h4>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px", paddingBottom: "20px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "32px", color: "#111827", textAlign: "center" }}>Why Buy Through Genestac?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              {[
                { title: "Doctor-led care", desc: "Every prescription is reviewed by qualified professionals." },
                { title: "Genuine medicines", desc: "We source directly from manufacturers and authorized distributors." },
                { title: "Patient support", desc: "Our care team is available to assist you throughout your treatment." },
                { title: "Secure delivery", desc: "Discreet and temperature-controlled shipping where required." }
              ].map((feature, i) => (
                <div key={i} style={{ background: "#f9fafb", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>{feature.title}</h4>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.5 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          {product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0 && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px", color: "#111827" }}>Frequently Asked Questions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {product.faqs.map((faq: any, i: number) => (
                  <details key={i} style={{ background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "16px 20px" }}>
                    <summary style={{ fontSize: "16px", fontWeight: 600, color: "#1f2937", cursor: "pointer", listStyle: "none" }}>
                      {faq.question}
                    </summary>
                    <p style={{ marginTop: "12px", fontSize: "15px", color: "#4b5563", lineHeight: 1.6 }}>
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Storage */}
          {product.storage_instructions && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "20px", color: "#111827" }}>Storage Instructions</h2>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "24px", color: "#1e40af", fontSize: "15px", lineHeight: 1.8 }}>
                {product.storage_instructions}
              </div>
            </section>
          )}

          {/* Manufacturer Section */}
          {product.manufacturer && (
            <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px", color: "#111827" }}>Manufacturer Information</h2>
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "28px" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>{product.manufacturer}</p>
                {product.medical_manufacturer_info && (
                  <p style={{ fontSize: "15px", color: "#4b5563", lineHeight: 1.7, marginTop: "12px" }}>{product.medical_manufacturer_info}</p>
                )}
                {product.medical_manufacturer_url && (
                  <a
                    href={product.medical_manufacturer_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    style={{ display: "inline-block", marginTop: "16px", color: "#2563eb", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
                  >
                    Visit official manufacturer website ↗
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Shipping & Returns */}
          <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px", color: "#111827" }}>Shipping & Returns</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {[
                {
                  title: "Delivery",
                  items: [
                    "Ships across India",
                    "Delivered within 3–7 business days",
                    "Temperature-sensitive items handled with appropriate packaging",
                    "Prescription verification required before dispatch",
                  ]
                },
                {
                  title: "Returns & Refunds",
                  items: [
                    "Medicines cannot be returned once dispensed, in accordance with applicable regulations",
                    "Damaged or incorrect items: contact support within 48 hours of delivery",
                    "For full details, please review our Refund Policy",
                  ]
                }
              ].map((block, i) => (
                <div key={i} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>{block.title}</h3>
                  <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {block.items.map((item, j) => (
                      <li key={j} style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.5 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Related Resources / Internal Links */}
          <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px", color: "#111827" }}>Related Resources</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {[
                { label: "Weight Management Programme", href: "/weightloss", desc: "Our doctor-supervised weight management programme." },
                { label: "Consult a Doctor", href: "/contact-us", desc: "Speak to our medical team about your treatment options." },
                { label: "Frequently Asked Questions", href: "/faq", desc: "General questions about Genestac and our services." },
                { label: "Browse All Products", href: "/products", desc: "View our full range of pharmaceutical products." },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  style={{
                    display: "block",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px",
                    textDecoration: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#10b981";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(16,185,129,0.1)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{link.label} →</p>
                  <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Medical Disclaimer */}
          <section style={{ background: "#f3f4f6", padding: "24px", borderRadius: "8px", marginTop: "20px" }}>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
              <strong>Medical Disclaimer:</strong> {product.requires_prescription ? "This is a prescription medicine and should only be used under the supervision of a qualified healthcare professional. " : ""}
              This page is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.
            </p>
          </section>

          {/* Use Cases */}
          {product.use_cases && Array.isArray(product.use_cases) && product.use_cases.length > 0 && (
            <UseCasesSection useCases={product.use_cases} productName={product.name} />
          )}

          {/* Reviews & Ratings */}
          <ReviewsSection
            productId={product.id}
            productName={product.name}
            initialReviews={initialReviews}
            initialAggregate={initialAggregate}
          />

        </div>
      </div>
    </div>
  );
}
