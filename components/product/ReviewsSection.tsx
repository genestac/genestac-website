"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  created_at: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  body: string;
  verified_purchase: boolean;
  helpful_count: number;
}

interface AggregateRating {
  avg_rating: number;
  total_count: number;
  distribution: Record<number, number>;
}

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  initialReviews?: Review[];
  initialAggregate?: AggregateRating;
}

// ── Star Component ─────────────────────────────────────────────────────────────

function Stars({
  rating,
  size = 16,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? (hovered || rating) >= star : rating >= star;
        return (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "#f59e0b" : "none"}
            stroke={filled ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
            style={{ cursor: interactive ? "pointer" : "default", transition: "fill 0.1s" }}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(star)}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </span>
  );
}

// ── Aggregate Rating Bar ───────────────────────────────────────────────────────

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
      <span style={{ width: "14px", color: "#374151", fontWeight: 600 }}>{star}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <div style={{ flex: 1, height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#f59e0b",
            borderRadius: "4px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span style={{ width: "28px", color: "#6b7280", textAlign: "right" }}>{count}</span>
    </div>
  );
}

// ── Review Card ────────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const initials = review.reviewer_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "24px",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{review.reviewer_name}</span>
            {review.verified_purchase && (
              <span
                style={{
                  background: "#ecfdf5",
                  color: "#065f46",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "20px",
                  border: "1px solid #a7f3d0",
                }}
              >
                ✓ Verified Purchase
              </span>
            )}
            <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "auto" }}>{date}</span>
          </div>
          <Stars rating={review.rating} size={14} />
          {review.title && (
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#1f2937", marginTop: "10px", marginBottom: "4px" }}>
              {review.title}
            </p>
          )}
          <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginTop: review.title ? "0" : "10px" }}>
            {review.body}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Login Gate ─────────────────────────────────────────────────────────────────

function LoginGate({ productName }: { productName: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
        border: "1px solid #a7f3d0",
        borderRadius: "14px",
        padding: "40px 32px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔐</div>
      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#064e3b", marginBottom: "8px" }}>
        Log in to leave a review
      </h3>
      <p style={{ fontSize: "14px", color: "#047857", marginBottom: "24px", lineHeight: 1.6 }}>
        Only registered patients can review {productName}. This ensures all reviews are genuine.
      </p>
      <Link
        href="/login"
        style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "15px",
          textDecoration: "none",
        }}
      >
        Log In to Review
      </Link>
    </div>
  );
}

// ── Submit Form (auth-gated) ───────────────────────────────────────────────────

function ReviewForm({
  productId,
  userName,
  accessToken,
  onSubmitted,
}: {
  productId: string;
  userName: string;
  accessToken: string;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (body.trim().length < 10) { setError("Review must be at least 10 characters."); return; }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ inventory_id: productId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed.");
        return;
      }
      setSuccess(true);
      onSubmitted();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "14px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#065f46", marginBottom: "8px" }}>
          Thank you for your review!
        </h3>
        <p style={{ fontSize: "14px", color: "#047857" }}>
          Your review has been submitted and will appear after our moderation team reviews it (usually within 24–48 hours).
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1f2937",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>Write a Review</h3>
        <span
          style={{
            background: "#ecfdf5",
            color: "#047857",
            fontSize: "12px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "20px",
            border: "1px solid #a7f3d0",
          }}
        >
          Posting as {userName}
        </span>
      </div>

      {/* Star picker */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>
          Your Rating *
        </label>
        <Stars rating={rating} size={28} interactive onChange={setRating} />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
          Review Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarise your experience"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = "#10b981"; }}
          onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
          Your Review *
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          onFocus={(e) => { e.target.style.borderColor = "#10b981"; }}
          onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; }}
        />
      </div>

      {error && (
        <p
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#dc2626",
            marginBottom: "16px",
          }}
        >
          {error}
        </p>
      )}

      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>
        Reviews are subject to moderation. Only genuine patient experiences are published.
      </p>

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? "#e5e7eb" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: submitting ? "#9ca3af" : "#fff",
          padding: "13px 28px",
          borderRadius: "8px",
          border: "none",
          fontSize: "15px",
          fontWeight: 700,
          cursor: submitting ? "not-allowed" : "pointer",
          transition: "opacity 0.2s",
        }}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ReviewsSection({
  productId,
  productName,
  initialReviews,
  initialAggregate,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [aggregate, setAggregate] = useState<AggregateRating>(
    initialAggregate || { avg_rating: 0, total_count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  );
  const [showForm, setShowForm] = useState(false);

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<{ name: string; token: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session.access_token) {
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "User";
        setUser({ name, token: session.access_token });
      }
      setAuthChecked(true);
    });
  }, []);

  const refresh = async () => {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAggregate({ avg_rating: data.avg_rating, total_count: data.total_count, distribution: data.distribution });
      }
    } catch { /* silent */ }
  };

  return (
    <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "48px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111827" }}>Patient Reviews</h2>
        {/* Only show Write Review button if auth is confirmed */}
        {authChecked && user && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: showForm ? "#f3f4f6" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: showForm ? "#374151" : "#fff",
              padding: "10px 22px",
              borderRadius: "8px",
              border: showForm ? "1px solid #d1d5db" : "none",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {showForm ? "Cancel" : "✏️ Write a Review"}
          </button>
        )}
      </div>

      {/* Aggregate Stats */}
      {aggregate.total_count > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "32px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "32px",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "64px", fontWeight: 900, color: "#111827", lineHeight: 1 }}>
              {aggregate.avg_rating.toFixed(1)}
            </div>
            <Stars rating={Math.round(aggregate.avg_rating)} size={20} />
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
              {aggregate.total_count} review{aggregate.total_count !== 1 ? "s" : ""}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                star={star}
                count={aggregate.distribution[star] || 0}
                total={aggregate.total_count}
              />
            ))}
          </div>
        </div>
      )}

      {/* Auth-gated form */}
      {authChecked && (
        <>
          {showForm && user ? (
            <div style={{ marginBottom: "32px" }}>
              <ReviewForm
                productId={productId}
                userName={user.name}
                accessToken={user.token}
                onSubmitted={() => {
                  setShowForm(false);
                  refresh();
                }}
              />
            </div>
          ) : showForm && !user ? (
            /* Fallback: shouldn't normally appear since button is hidden for guests */
            <div style={{ marginBottom: "32px" }}>
              <LoginGate productName={productName} />
            </div>
          ) : null}
        </>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "#f9fafb",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
          <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "16px" }}>
            No reviews yet for {productName}. Be the first to share your experience.
          </p>
          {authChecked && !user && (
            <Link
              href="/login"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Log In to Review
            </Link>
          )}
          {authChecked && user && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Write the First Review
            </button>
          )}
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "24px", textAlign: "center" }}>
        All reviews are submitted by registered users and verified by our team before being published.
      </p>
    </section>
  );
}
