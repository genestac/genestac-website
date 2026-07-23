"use client";

import { useState } from "react";
import { MessageSquare, Check, ArrowLeft, Phone, Mail, MapPin,HomeIcon } from "lucide-react";
import Link from "next/link";

export default function QuickEnquiryPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.replace(/\D/g, ""),
          condition: formData.message.trim() || undefined,
          source: "quick_enquiry_form",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setStatus("idle");
      }, 4000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex flex-col">
      

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl grid md:grid-cols-[1fr_1.2fr] gap-8 items-start">
          {/* Left: Info */}
          <div className="space-y-6 pt-4 md:pt-12">
            <div className="flex items-center gap-3 mb-2 w-full">
              <div className="p-2 bg-sky-100 rounded-xl text-sky-600">
                <MessageSquare className="h-12 w-12" />
              </div>
              <span className="text-4xl font-extrabold uppercase tracking-widest text-sky-600">
                Quick Enquiry
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              How can we <span className="text-sky-600">help</span> you?
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              Have questions about our treatments, pricing, or which program is
              right for you? Drop us a message and our team will get back to you
              promptly.
            </p>

            
          </div>

          {/* Right: Form Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-[#11B880] p-8 sm:p-10">
            {status === "success" ? (
              <div className="text-center py-8">
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
                <h2 className="text-3xl font-bold text-slate-900 mb-1">
                  Get in Touch
                </h2>
                <p className="text-lg  font-medium mb-6">
                  Fill in the form and we&apos;ll reach out to you.
                </p>

                {status === "error" && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-xs font-bold text-red-600">{errorMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-50 transition-all text-sm text-slate-900 placeholder-slate-400 font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-50 transition-all text-sm text-slate-700 placeholder-slate-400 font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-50 transition-all text-sm text-slate-700 placeholder-slate-400 font-medium"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message or condition (optional)"
                      className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-50 transition-all text-sm text-slate-700 placeholder-slate-400 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all text-sm tracking-wide"
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting…
                      </span>
                    ) : (
                      "Submit Enquiry"
                    )}
                  </button>
                </form>

                <p className="text-sm text-center  mt-6 leading-relaxed">
                  By submitting you agree to our{" "}
                  <Link href="/privacy-policy" className="underline hover:text-slate-600">
                    Privacy Policy
                  </Link>
                  . We respect your privacy.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
