"use client";

import React, { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { formatINR } from "@/lib/currency";
import Link from "next/link";

export function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const { addToCart } = useCart();
  const { setCartOpen } = useModals();
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Extract unique categories from DB dynamically
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    initialProducts.forEach(p => {
      if (p.category && p.category.trim() !== '') {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats).sort();
  }, [initialProducts]);

  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Single open state for the dynamic Categories group
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
  };

  const handleAddToCart = (e: React.MouseEvent, p: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ 
      name: p.name, 
      price: p.price, 
      image: p.image_url || "", 
      requires_prescription: p.requires_prescription 
    });
    setAddedItem(p.name);
    setCartOpen(true);
    setTimeout(() => setAddedItem(null), 1600);
  };

  const filtered = useMemo(() => {
    let list = [...initialProducts];
    
    // Dynamic filtering: exact match on DB category
    if (activeCategory !== "All Products") {
      list = list.filter((p) => p.category?.trim() === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.manufacturer?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialProducts, activeCategory, searchQuery]);

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#111827",
        background: "#fafafb",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── Search row ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 32px",
          paddingTop: "15px",
          borderBottom: "1px solid #e5e7eb",
          flexWrap: "wrap" as const,
          background: "#ffffff",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "260px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#6b7280",
            fontSize: "14.5px",
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search products and compounds…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14.5px",
              color: "#111827",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13.5px",
            fontWeight: 600,
            color: "#4b5563",
            whiteSpace: "nowrap" as const,
          }}
        >
          ⚡ 99%+ Purity · Third-Party Tested · Practitioner-Grade
        </div>

        <button
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "11px 20px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            whiteSpace: "nowrap" as const,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #059669 0%, #047857 100%)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)")}
        >
          Quick Enquiry
        </button>
      </div>

      {/* ── Category strip ──────────────────────────────────────────────────── */}
      <div
        className="mobile-category-strip"
        style={{
          display: "flex",
          gap: "28px",
          padding: "14px 32px",
          borderBottom: "1px solid #e5e7eb",
          fontSize: "14px",
          fontWeight: 600,
          overflowX: "auto" as const,
          background: "#ffffff",
        }}
      >
        <button
          onClick={() => selectCategory("All Products")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap" as const,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeCategory === "All Products" ? 700 : 600,
            color: activeCategory === "All Products" ? "#10b981" : "#1f2937",
            borderBottom: activeCategory === "All Products" ? "2px solid #10b981" : "2px solid transparent",
            paddingBottom: "4px",
          }}
        >
          All Products
        </button>
        {dynamicCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap" as const,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeCategory === cat ? 700 : 600,
              color: activeCategory === cat ? "#10b981" : "#1f2937",
              borderBottom: activeCategory === cat ? "2px solid #10b981" : "2px solid transparent",
              paddingBottom: "4px",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Layout: sidebar + main ──────────────────────────────────────────── */}
      <div style={{ display: "flex", maxWidth: "1440px", margin: "0 auto" }}>

        {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
        <aside
          style={{
            width: "280px",
            flexShrink: 0,
            borderRight: "1px solid #e5e7eb",
            background: "#f9fafb",
            minHeight: "100vh",
          }}
          className="products-sidebar"
        >
          <div style={{ borderBottom: "1px solid #e5e7eb" }}>
            <div
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              <span>Categories</span>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: 1,
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSidebarOpen ? "–" : "+"}
              </span>
            </div>

            {isSidebarOpen && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button
                  onClick={() => selectCategory("All Products")}
                  style={{
                    padding: "9px 20px",
                    fontSize: "14px",
                    color: activeCategory === "All Products" ? "#1f2937" : "#4b5563",
                    fontWeight: activeCategory === "All Products" ? 700 : 500,
                    background: activeCategory === "All Products" ? "#fff" : "transparent",
                    border: "none",
                    textAlign: "left" as const,
                    cursor: "pointer",
                    borderLeft: activeCategory === "All Products"
                      ? "3px solid #10b981"
                      : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== "All Products") {
                      e.currentTarget.style.color = "#111827";
                      e.currentTarget.style.background = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== "All Products") {
                      e.currentTarget.style.color = "#4b5563";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  All Products
                </button>
                {dynamicCategories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      style={{
                        padding: "9px 20px",
                        fontSize: "14px",
                        color: isActive ? "#1f2937" : "#4b5563",
                        fontWeight: isActive ? 700 : 500,
                        background: isActive ? "#fff" : "transparent",
                        border: "none",
                        textAlign: "left" as const,
                        cursor: "pointer",
                        borderLeft: isActive
                          ? "3px solid #10b981"
                          : "3px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#111827";
                          e.currentTarget.style.background = "#e5e7eb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#4b5563";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
        <main style={{ flex: 1, padding: "26px 32px 60px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap" as const,
              marginBottom: "6px",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                textTransform: "uppercase" as const,
              }}
            >
              {activeCategory}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#fef3c7",
                border: "1px solid #fde68a",
                color: "#92400e",
                fontSize: "12.5px",
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: "6px",
                whiteSpace: "nowrap" as const,
              }}
            >
              ⓘ Consultation required for final dispensing approval
            </div>
          </div>

          <p
            style={{
              color: "#4b5563",
              fontSize: "14.5px",
              lineHeight: 1.55,
              maxWidth: "900px",
              margin: "14px 0 26px",
            }}
          >
            Explore our practitioner-grade peptides and wellness compounds — all manufactured to 99%+ purity and
            third-party tested. Products are for research and clinical use under qualified supervision.
            {filtered.length > 0 && (
              <> &nbsp;<strong style={{ color: "#111827" }}>{filtered.length} products</strong> found.</>
            )}
          </p>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center" as const, padding: "60px 20px", color: "#6b7280" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontWeight: 600, fontSize: "16px" }}>No products found</p>
              <p style={{ fontSize: "14px", marginTop: "6px" }}>
                Try a different category or clear your search.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All Products"); }}
                style={{
                  marginTop: "16px",
                  background: "#f3f4f6",
                  color: "#111827",
                  border: "none",
                  borderRadius: "7px",
                  padding: "9px 20px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "13.5px",
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "18px",
            }}
            className="products-grid"
          >
            {filtered.map((p) => {
              const isAdded = addedItem === p.name;
              const hasDiscount = p.compare_at_price && p.compare_at_price > p.price;
              const discountPct = hasDiscount
                ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)
                : 0;
              const inStock = p.stock_quantity > 0;

              return (
                <Link
                  href={`/products/${p.slug || p.id}`}
                  key={p.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "18px",
                    display: "flex",
                    gap: "16px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: "#ffffff",
                    position: "relative" as const,
                    textDecoration: "none",
                    color: "inherit"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                    e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                    e.currentTarget.style.borderColor = "#10b981";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  {discountPct > 0 && (
                    <span
                      style={{
                        position: "absolute" as const,
                        top: "10px",
                        right: "10px",
                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "4px 8px",
                        borderRadius: "6px",
                        letterSpacing: "0.02em",
                        zIndex: 10,
                        boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
                      }}
                      className="pulse-badge"
                    >
                      -{discountPct}%
                    </span>
                  )}

                  <div
                    style={{
                      width: "88px",
                      height: "88px",
                      flexShrink: 0,
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                      />
                    ) : (
                      <span style={{ fontSize: "24px", opacity: 0.2 }}>📦</span>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column" as const,
                      gap: "4px",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                      }}
                    >
                      {p.name}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12.5px",
                        color: "#4b5563",
                        fontWeight: 600,
                        marginTop: "2px",
                      }}
                    >
                      {p.requires_prescription && (
                        <span
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: "#f5a623",
                            color: "#fff",
                            fontSize: "8px",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          Rx
                        </span>
                      )}
                      {p.manufacturer || "Genestac Labs"}
                    </div>

                    {p.description && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginTop: "2px",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const,
                          overflow: "hidden",
                        }}
                      >
                        {p.description}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        marginTop: "6px",
                      }}
                    >
                      <span style={{ fontSize: "15.5px", fontWeight: 800 }}>
                        {formatINR(p.price)}
                      </span>
                      {hasDiscount && (
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#9ca3af",
                            textDecoration: "line-through",
                          }}
                        >
                          {formatINR(p.compare_at_price)}
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: "10px" }}>
                      {inStock ? (
                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          style={{
                            width: "100%",
                            background: isAdded ? "#047857" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "7px",
                            padding: "9px 0",
                            fontWeight: 700,
                            fontSize: "13.5px",
                            letterSpacing: "0.3px",
                            cursor: "pointer",
                            transition: "background 0.15s ease",
                          }}
                        >
                          {isAdded ? "ADDED ✓" : "ADD TO CART"}
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            width: "100%",
                            background: "#f3f4f6",
                            color: "#9ca3af",
                            border: "none",
                            borderRadius: "7px",
                            padding: "9px 0",
                            fontWeight: 700,
                            fontSize: "12.5px",
                            letterSpacing: "0.3px",
                            cursor: "not-allowed",
                          }}
                        >
                          OUT OF STOCK
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>

      <style>{`
        @media (min-width: 981px) {
          .mobile-category-strip { display: none !important; }
        }
        @media (max-width: 980px) {
          .products-sidebar { display: none !important; }
          .products-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .products-grid > div { flex-direction: column !important; }
          .products-grid > div > div:first-child {
            width: 100% !important; height: 140px !important;
          }
        }
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .pulse-badge {
          animation: pulseSoft 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
