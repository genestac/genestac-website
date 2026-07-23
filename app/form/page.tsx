"use client";

import { useState, ChangeEvent } from "react";
import { CSSProperties } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client ────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormState {
  full_name: string;
  email: string;
  phone_number: string;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  phone_number?: string;
}

type Status = "idle" | "loading" | "success" | "error";

interface FieldProps {
  label: string;
  name: keyof FormState;
  type?: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  hint?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string): boolean =>
  phone.replace(/\D/g, "").length === 10;

// ─── Component ───────────────────────────────────────────────────────────────
export default function NewLeadForm() {
  const [form, setForm] = useState<FormState>({
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.full_name.trim()) e.full_name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!validateEmail(form.email))
      e.email = "Enter a valid email address.";
    if (!form.phone_number.trim()) e.phone_number = "Phone number is required.";
    else if (!validatePhone(form.phone_number))
      e.phone_number = "Enter a valid 10-digit phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    setForm((prev) => ({
      ...prev,
      [key]: key === "phone_number" ? formatPhone(value) : value,
    }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("loading");
    setServerError("");

    const { error } = await supabase.from("leads").insert([
      {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone_number: form.phone_number.replace(/\D/g, ""),
        lead_status: "new",
      },
    ]);

    if (error) {
      setStatus("error");
      setServerError(
        error.code === "23505"
          ? "We already have your details — our team will be in touch shortly."
          : error.message || "Something went wrong. Please try again.",
      );
    } else {
      setStatus("success");
      setForm({ full_name: "", email: "", phone_number: "" });
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setServerError("");
    setErrors({});
    setForm({ full_name: "", email: "", phone_number: "" });
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div style={styles.page}>
        <div
          style={{ ...styles.card, textAlign: "center", padding: "48px 40px" }}
        >
          <div style={styles.checkCircle}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ ...styles.cardTitle, marginTop: 20 }}>Thank You</h2>
          <p style={styles.successSubtext}>
            Our Team will contact you soon
          </p>
          <button style={styles.btnPrimary} onClick={handleReset}>
            Add Another Response
          </button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.iconBadge}>
            <img src="/logo.jpeg" alt="" />
          </div>
          <div>
            <h1 style={styles.cardTitle}>Genestac</h1>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Server error */}
        {status === "error" && (
          <div style={styles.errorBanner}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {serverError}
          </div>
        )}

        {/* Fields */}
        <div style={styles.fields}>
          <Field
            label="Full Name"
            name="full_name"
            value={form.full_name}
            placeholder="e.g. Priya Sharma"
            error={errors.full_name}
            onChange={handleChange}
            autoComplete="name"
          />
          <Field
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            placeholder="e.g. priya@example.com"
            error={errors.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <Field
            label="Phone Number"
            name="phone_number"
            type="tel"
            value={form.phone_number}
            placeholder="e.g. 98765-43210"
            error={errors.phone_number}
            onChange={handleChange}
            autoComplete="tel"
            hint="10-digit Indian mobile number"
          />
        </div>

        {/* Status badge */}
        {/* <div style={styles.statusRow}>
          <span style={styles.statusLabel}>Lead status</span>
          <span style={styles.statusBadge}>● New</span>
        </div> */}

        {/* Submit */}
        <button
          style={{
            ...styles.btnPrimary,
            ...(status === "loading" ? styles.btnDisabled : {}),
          }}
          onClick={handleSubmit}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <span style={styles.spinnerRow}>
              <span style={styles.spinner} /> Saving…
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Field sub-component ──────────────────────────────────────────────────────
function Field({
  label,
  name,
  type = "text",
  value,
  placeholder,
  error,
  onChange,
  autoComplete,
  hint,
}: FieldProps) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
      />
      {hint && !error && <span style={styles.hint}>{hint}</span>}
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

// ─── Styles (typed as CSSProperties to satisfy TypeScript) ──────────────────
const ACCENT = "#6366f1";
const ACCENT_DARK = "#4f46e5";
const RED = "#ef4444";

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #f0f0ff 0%, #fafaff 60%, #ede9fe 100%)",
    padding: "24px 16px",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(99,102,241,0.12)",
    padding: "36px 40px",
    width: "100%",
    maxWidth: 440,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    gap: 14,
    marginBottom: 24,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.3px",
  },
  cardSubtitle: {
    margin: "2px 0 0",
    fontSize: 13,
    color: "#6b7280",
  },
  divider: {
    height: 1,
    background: "#f3f4f6",
    marginBottom: 24,
  },
  fields: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    marginBottom: 20,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    background: "#fafafa",
  },
  inputError: {
    borderColor: RED,
    background: "#fff5f5",
  },
  hint: {
    fontSize: 12,
    color: "#9ca3af",
  },
  fieldError: {
    fontSize: 12,
    color: RED,
    fontWeight: 500,
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "#f9fafb",
    borderRadius: 8,
    marginBottom: 24,
    border: "1px solid #f3f4f6",
  },
  statusLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 500,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#059669",
    background: "#ecfdf5",
    padding: "3px 10px",
    borderRadius: 99,
    border: "1px solid #bbf7d0",
  },
  btnPrimary: {
    width: "100%",
    padding: "12px",
    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "opacity 0.15s",
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  spinnerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.35)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  errorBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "#fff5f5",
    border: "1px solid #fecaca",
    color: RED,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 20,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  successSubtext: {
    color: "#6b7280",
    fontSize: 14,
    margin: "8px 0 28px",
    lineHeight: 1.5,
  },
};
