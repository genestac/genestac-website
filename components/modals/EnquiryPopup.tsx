"use client";

import React, { useState } from "react";
import { useModals } from "@/context/ModalContext";
import { X, MessageSquare, Check } from "lucide-react";
import { supabase } from "@/lib/supabase"; // ✅ use your existing supabase client

export const EnquiryPopup: React.FC = () => {
  const { isEnquiryOpen, setEnquiryOpen } = useModals();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isEnquiryOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // ✅ Insert directly into the leads table, same shape as NewLeadForm
    const { error } = await supabase.from("leads").insert([
      {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone.replace(/\D/g, ""),
        lead_status: "new",
      },
    ]);

    if (error) {
      console.error("Error submitting enquiry:", error);
      setStatus("error");
      setErrorMessage(
        error.code === "23505"
          ? "We already have your details — our team will be in touch shortly."
          : error.message || "Something went wrong. Please try again.",
      );
      return;
    }

    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", email: "", phone: "" });
      setEnquiryOpen(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center px-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 sm:p-10 relative shadow-2xl transform scale-100 transition-transform duration-300">
        <button
          onClick={() => setEnquiryOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Enquiry Received!
            </h2>
            <p className="text-sm text-slate-500">
              Thank you. Our team will get back to you shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#e0f2fe] rounded-xl text-[#0ea5e9]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0ea5e9]">
                Quick Enquiry
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-tight tracking-tight">
              How can we help?
            </h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
              Have questions about our treatments or pricing? Drop us a message
              and our team will get back to you promptly.
            </p>

            {status === "error" && (
              <p className="text-xs text-red-500 font-bold mb-4">
                {errorMessage}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all text-sm text-slate-700 placeholder-slate-400 font-medium"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all text-sm text-slate-700 placeholder-slate-400 font-medium"
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
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all text-sm text-slate-700 placeholder-slate-400 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl shadow-lg shadow-[#0ea5e9]/30 transition-all text-sm tracking-wide disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
              By submitting you agree to our{" "}
              <a href="#" className="underline hover:text-slate-600">
                Privacy Policy
              </a>
              . We respect your privacy.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
