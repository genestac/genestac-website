"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Info,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Stethoscope,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const goalsList = [
  "Weight Management",
  "Fat Loss Support",
  "Muscle Support",
  "Energy Improvement",
  "Metabolic Wellness",
  "Lifestyle Improvement",
  "General Wellness & Longevity",
];

const REQUIRED_META_FIELDS = [
  "age",
  "gender",
  "height",
  "weight",
  "location",
  "diabetes",
  "highBP",
  "thyroid",
];

export default function StartJourneyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [matchStatus, setMatchStatus] = useState<"idle" | "checking" | "complete" | "partial" | "none">("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    location: "",
    goals: [] as string[],
    diabetes: "",
    highBP: "",
    thyroid: "",
    consent: false,
  });

  useEffect(() => {
    const prefillUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setIsLoggedIn(true);

      const { data: profile } = await supabase
        .from("users")
        .select("name, email, phone")
        .eq("id", user.id)
        .single();
      if (profile) {
        setFormData((prev) => ({
          ...prev,
          fullName: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
        }));
      }
    };
    prefillUserData();
  }, []);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Only relevant for guests — checks if this email/phone already exists in `users`
  const checkExistingUser = async () => {
    if (isLoggedIn) return;
    if (!formData.email && !formData.phone) return;

    setMatchStatus("checking");
    try {
      const res = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });
      const result = await res.json();

      if (!result.found) {
        setMatchStatus("none");
        return;
      }

      const meta = result.user.metadata || {};

      setFormData((prev) => ({
        ...prev,
        fullName: result.user.name || prev.fullName,
        email: result.user.email || prev.email,
        phone: result.user.phone || prev.phone,
        age: meta.age ?? prev.age,
        gender: meta.gender ?? prev.gender,
        height: meta.height ?? prev.height,
        weight: meta.weight ?? prev.weight,
        location: meta.location ?? prev.location,
        goals: Array.isArray(meta.goals) ? meta.goals : prev.goals,
        diabetes: meta.diabetes ?? prev.diabetes,
        highBP: meta.highBP ?? prev.highBP,
        thyroid: meta.thyroid ?? prev.thyroid,
      }));

      const hasAllFields =
        REQUIRED_META_FIELDS.every((key) => meta[key]) &&
        Array.isArray(meta.goals) &&
        meta.goals.length > 0;

      setMatchStatus(hasAllFields ? "complete" : "partial");
    } catch {
      setMatchStatus("none");
    }
  };

  const handleGoalCheckbox = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      if (exists) {
        return { ...prev, goals: prev.goals.filter((g) => g !== goal) };
      } else {
        return { ...prev, goals: [...prev.goals, goal] };
      }
    });
  };

  const handleConsentCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const totalSteps = 2;

  const validateStep = () => {
    if (currentStep === 0) {
      return (
        formData.fullName &&
        formData.email &&
        formData.phone &&
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight &&
        formData.location &&
        formData.goals.length > 0
      );
    }
    if (currentStep === 1) {
      return formData.diabetes && formData.highBP && formData.thyroid && formData.consent;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps - 1) setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const submitIntake = async () => {
    setStatus("loading");
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => null);

      if (res.status === 409 || result?.duplicate) {
        setUserExists(true);
        setStatus("idle");
        return;
      }

      if (res.ok && result?.success) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          setCurrentStep(0);
          router.push("/weightloss#pricing");
        }, 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    submitIntake();
  };

  // ✅ For the "recognized guest, all data already known" screen
  const handleExploreClick = () => {
    if (!formData.consent) return;
    submitIntake();
  };

  const stepsLabel = ["1. Personal", "2. Medical & Consent"];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
              <Stethoscope className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Medical Wellness Intake
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Confidential & Secure
              </p>
            </div>
          </div>

          <div className="relative pt-2">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
              <div
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {stepsLabel.map((label, idx) => (
                <span
                  key={label}
                  className={idx <= currentStep ? "text-emerald-600" : "text-slate-400"}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8" />
            <h3 className="text-3xl font-extrabold text-slate-800 mb-3">Processing Details...</h3>
            <p className="text-slate-500 text-lg font-medium">Securely transmitting your health profile.</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-200 shadow-xl">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Intake Received</h3>
            <p className="text-slate-600 text-xl max-w-md mx-auto mb-10 leading-relaxed font-medium">
              Thank you. Our wellness team will review your information securely and contact you shortly.
            </p>
            <p className="text-base font-bold text-emerald-500 animate-pulse tracking-wide">
              Redirecting you to our pricing page...
            </p>
          </div>
        )}

        {/* Duplicate / Already registered (leads unique constraint hit) */}
        {status !== "loading" && status !== "success" && userExists && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 md:p-14 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              You&apos;re Already Registered!
            </h2>
            <p className="text-slate-600 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Good news — you&apos;re already registered with Genestac Therapeutics. Your information is safe with us.
              {isLoggedIn
                ? " You can explore our plans to get started."
                : " Login to your dashboard to see your profile."}
            </p>
            <button
              onClick={() => router.push(isLoggedIn ? "/weightloss#pricing" : "/login")}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl transition text-sm"
            >
              {isLoggedIn ? "Explore" : "Login"}
            </button>
          </div>
        )}

        {/* ✅ Recognized guest — all required data already known in `users` */}
        {status !== "loading" && status !== "success" && !userExists && matchStatus === "complete" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 md:p-14 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              Welcome back, {formData.fullName || "there"}!
            </h2>
            <p className="text-slate-600 text-base max-w-md mx-auto mb-6 leading-relaxed">
              We already have your details on file — no need to fill out the form again.
            </p>

            <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 text-left mb-6 max-w-md mx-auto">
              {[
                { label: "Name", value: formData.fullName },
                { label: "Email", value: formData.email },
                { label: "Phone", value: formData.phone },
                { label: "Age", value: formData.age },
                { label: "Gender", value: formData.gender },
                { label: "Height", value: `${formData.height} cm` },
                { label: "Weight", value: `${formData.weight} kg` },
                { label: "Location", value: formData.location },
                { label: "Goals", value: formData.goals.join(", ") },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-bold text-slate-800">{value || "—"}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-slate-200 rounded-xl hover:border-emerald-300 transition-colors bg-slate-50 max-w-md mx-auto mb-6 text-left">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={handleConsentCheckbox}
                className="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-700 leading-snug">
                I confirm this information is still accurate and consent to medical review by Genestac providers.
              </span>
            </label>

            <button
              onClick={handleExploreClick}
              disabled={!formData.consent}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-xl transition text-sm"
            >
              Explore Our Plans <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Form — shown when nothing above matched, OR partial match (prefilled) */}
        {status !== "loading" &&
          status !== "success" &&
          !userExists &&
          matchStatus !== "complete" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
            {status === "error" && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6">
                There was an issue submitting your form. Please try again.
              </div>
            )}

            {matchStatus === "partial" && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-bold mb-6">
                We found some of your details already — just fill in what's missing.
              </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              {currentStep === 0 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>
                  <div className="space-y-5">
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleTextChange}
                      placeholder="Full Legal Name"
                      className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm placeholder:text-slate-400"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleTextChange}
                        onBlur={checkExistingUser}
                        placeholder="Email Address"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm placeholder:text-slate-400"
                      />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleTextChange}
                        onBlur={checkExistingUser}
                        placeholder="Phone Number"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm placeholder:text-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                      <input
                        type="number"
                        name="age"
                        required
                        value={formData.age}
                        onChange={handleTextChange}
                        placeholder="Age"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm placeholder:text-slate-400"
                      />
                      <div className="relative">
                        <select
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleTextChange}
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm appearance-none"
                        >
                          <option value="" disabled>Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <input
                        type="number"
                        name="height"
                        required
                        value={formData.height}
                        onChange={handleTextChange}
                        placeholder="Height (cm)"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm placeholder:text-slate-400"
                      />
                      <input
                        type="number"
                        name="weight"
                        required
                        value={formData.weight}
                        onChange={handleTextChange}
                        placeholder="Weight (kg)"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm placeholder:text-slate-400"
                      />
                    </div>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleTextChange}
                      placeholder="City / Country"
                      className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm placeholder:text-slate-400"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-3">Health Goals</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {goalsList.map((goal) => {
                          const isChecked = formData.goals.includes(goal);
                          return (
                            <label key={goal} className="cursor-pointer block relative group">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleGoalCheckbox(goal)}
                                className="sr-only"
                              />
                              <div
                                className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 shadow-sm ${
                                  isChecked
                                    ? "border-emerald-500 bg-emerald-50"
                                    : "border-slate-200 bg-white hover:border-emerald-300"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                                    isChecked
                                      ? "bg-emerald-500 border-emerald-500 text-white"
                                      : "border-slate-300 text-transparent"
                                  }`}
                                >
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <span className="font-bold text-slate-700 text-xs">{goal}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Medical Check</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6">
                    A few quick questions for your clinical safety.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    {[
                      { name: "diabetes", label: "Diabetes?", options: ["No", "Yes - Type 1", "Yes - Type 2"] },
                      { name: "highBP", label: "High Blood Pressure?", options: ["No", "Yes"] },
                      { name: "thyroid", label: "Thyroid Issues?", options: ["No", "Yes"] },
                    ].map((field) => (
                      <div key={field.name} className="relative">
                        <select
                          name={field.name}
                          required
                          value={(formData as any)[field.name]}
                          onChange={handleTextChange}
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-800 font-semibold text-sm appearance-none"
                        >
                          <option value="" disabled>{field.label}</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-sm text-slate-700 font-medium leading-relaxed">
                    <Info className="w-4 h-4 inline-block mr-1 -mt-0.5" />{" "}
                    <strong>Medical Disclaimer:</strong> This wellness program does not replace
                    professional medical advice, diagnosis, or treatment.
                  </div>

                  <label className="flex items-start gap-4 cursor-pointer p-4 border-2 border-slate-200 rounded-xl hover:border-emerald-300 transition-colors bg-slate-50">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={handleConsentCheckbox}
                      className="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700 leading-snug">
                      I confirm that the information provided is accurate and true to the best of my
                      knowledge. I consent to medical review by Genestac providers.
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`text-slate-500 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-widest text-xs ${
                    currentStep === 0 ? "invisible" : ""
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <div className="ml-auto flex items-center gap-4">
                  {currentStep < totalSteps - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
                    >
                      Next Step <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white font-extrabold py-4 px-8 rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 uppercase tracking-widest text-sm"
                    >
                      Submit For Medical Review <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}