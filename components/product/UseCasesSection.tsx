"use client";

import React from "react";

interface UseCase {
  title: string;
  description: string;
  icon?: string;
}

interface UseCasesSectionProps {
  useCases: UseCase[];
  productName: string;
}

const defaultIcons = ["💊", "🩺", "⚕️", "🔬", "🧬", "💉", "🩻", "❤️‍🩹"];

export function UseCasesSection({ useCases, productName }: UseCasesSectionProps) {
  if (!useCases || useCases.length === 0) return null;

  return (
    <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "40px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", color: "#111827" }}>
        Who May Use {productName}?
      </h2>
      <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "32px", lineHeight: 1.6 }}>
        The following information is for general awareness. A qualified healthcare professional should assess your individual circumstances before prescribing any medicine.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px"
      }}>
        {useCases.map((uc, i) => (
          <div
            key={i}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "24px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "#10b981";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(16,185,129,0.08)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", flexShrink: 0
            }}>
              {uc.icon || defaultIcons[i % defaultIcons.length]}
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>
                {uc.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.6 }}>
                {uc.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
