"use client";

import React, { useEffect, useState } from "react";
import { useModals } from "@/context/ModalContext";
import {
  X,
  Stethoscope,
  Check,
  ChevronDown,
  Info,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lock,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OtpModal from "@/components/OtpModal";
import { signUpSchema } from "@/lib/validations";
import toast from "react-hot-toast";

export const IntakeModal: React.FC = () => {
  const router = useRouter();
  const { isIntakeOpen, setIntakeOpen } = useModals();

  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsBounceKey, setTermsBounceKey] = useState(0);
  const [authFieldErrors, setAuthFieldErrors] = useState<Record<string, boolean>>({});

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpUserId, setOtpUserId] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPassword, setOtpPassword] = useState("");

  const [authData, setAuthData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [currentStep, setCurrentStep] = useState(0);

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

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "duplicate" | "error"
  >("idle");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        setFormData((prev) => ({
          ...prev,
          email: session.user.email || "",
        }));
      }
    };

    checkUser();
  }, []);

  if (!isIntakeOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    setAuthError("");
    setAuthLoading(true);

    const errs: Record<string, boolean> = {};
    const trimmedName = authData.fullName.trim();
    const trimmedEmail = authData.email.trim();
    const trimmedPhone = authData.phone.trim();
    const password = authData.password;

    if (!trimmedEmail) errs.email = true;
    if (!password) errs.password = true;
    if (authMode === "register") {
      if (!trimmedName) errs.fullName = true;
      if (!trimmedPhone) errs.phone = true;
      if (!acceptedTerms) {
        setTermsBounceKey((k) => k + 1);
        setAuthFieldErrors(errs);
        setAuthLoading(false);
        return;
      }
      const result = signUpSchema.safeParse({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password,
      });
      if (!result.success) {
        const zodErrs: Record<string, boolean> = {};
        for (const issue of result.error.issues) {
          zodErrs[issue.path[0] as string] = true;
        }
        setAuthFieldErrors(zodErrs);
        setAuthError(result.error.issues[0].message);
        setAuthLoading(false);
        return;
      }
    }
    setTermsBounceKey(0);
    if (Object.keys(errs).length > 0) {
      setAuthFieldErrors(errs);
      setAuthLoading(false);
      return;
    }
    setAuthFieldErrors({});

    try {

      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);

          setFormData((prev) => ({
            ...prev,
            email: session.user.email || trimmedEmail,
          }));
        }

        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            password: password,
          }),
        });

        const regData = await res.json();

        if (!res.ok) {
          setAuthLoading(false);
          if (res.status === 409 || (regData.error && (regData.error.toLowerCase().includes("already registered") || regData.error.toLowerCase().includes("already exists")))) {
            toast.error("This account already exists. Please login or use different credentials.");
          } else {
            setAuthError(regData.error || "Failed to create account.");
          }
          return;
        }

        const authUserId = regData.userId;

        setFormData((prev) => ({
          ...prev,
          fullName: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
        }));

        setOtpUserId(authUserId);
        setOtpEmail(trimmedEmail);
        setOtpPassword(password);
        setShowOtpModal(true);
        setAuthLoading(false);
      } catch (err: any) {
        setAuthLoading(false);
        setAuthError(err.message || "Something went wrong during account creation.");
      }

      setAuthLoading(false);
    } catch (error) {
      console.error(error);
      setAuthError("Something went wrong. Please try again.");
      setAuthLoading(false);
    }
  };
  const handleTextChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalCheckbox = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);

      if (exists) {
        return {
          ...prev,
          goals: prev.goals.filter((g) => g !== goal),
        };
      }

      return {
        ...prev,
        goals: [...prev.goals, goal],
      };
    });
  };

  const handleConsentCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      consent: e.target.checked,
    }));
  };

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
      return (
        formData.diabetes &&
        formData.highBP &&
        formData.thyroid &&
        formData.consent
      );
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 1) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      alert("Please fill in all required fields on this step.");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setAuthError("Please login or create an account first.");
      return;
    }

    if (!validateStep()) {
      alert("Please complete the review and consent step.");
      return;
    }

    setStatus("loading");

    try {
      const payload = {
        ...formData,
        user_id: user.id,
      };

      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 409 || result?.duplicate) {
        // ✅ Already submitted before — show a sweet message, then redirect to pricing
        setStatus("duplicate");
        setTimeout(() => {
          setStatus("idle");
          setCurrentStep(0);
          setIntakeOpen(false);
          router.push("/pricing");
        }, 3000);
        return;
      }

      if (response.ok && result?.success) {
        setStatus("success");

        setTimeout(() => {
          setStatus("idle");
          setCurrentStep(0);
          setIntakeOpen(false);
          router.push("/weightloss#pricing");
        }, 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (err) {
      console.error("Error submitting intake form:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const stepsLabel = user
    ? ["1. Personal", "2. Medical & Consent"]
    : ["Login / Register", "Medical Intake"];

  return (
    <div className="fixed inset-0 bg-brand-950/80 backdrop-blur-md z-[120] flex items-center justify-center px-3 py-3 sm:px-4 sm:py-8 transition-opacity">
      <style>{`@keyframes bounce-twice { 0%,100% { transform: translateY(0); } 25% { transform: translateY(-6px); } 50% { transform: translateY(0); } 75% { transform: translateY(-6px); } } .animate-bounce-twice { animation: bounce-twice 0.5s ease; }`}</style>
      <div className="w-full max-w-4xl min-h-[400px] max-h-[75vh] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] relative shadow-2xl animate-fade-in flex flex-col bg-white border border-slate-200">
        {status !== "success" &&
          status !== "loading" &&
          status !== "duplicate" && (
            <div className="bg-white border-b border-slate-100 p-6 md:p-8 shrink-0 relative z-20 shadow-sm">
              <button
                onClick={() => setIntakeOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-brand-600 transition-all bg-slate-50 p-2 rounded-full hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100 text-medical-emerald">
                  {user ? (
                    <Stethoscope className="h-6 w-6" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-serif text-brand-950">
                    {user ? "Medical Wellness Intake" : "Secure Account Access"}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {user
                      ? "Confidential & Secure"
                      : "Login or create your account to continue"}
                  </p>
                </div>
              </div>

              <div className="relative pt-2">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                  <div
                    style={{
                      width: user ? `${((currentStep + 1) / 2) * 100}%` : "50%",
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-medical-emerald transition-all duration-500"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {stepsLabel.map((label, idx) => (
                    <span
                      key={label}
                      className={`${
                        user
                          ? idx <= currentStep
                            ? "text-brand-600"
                            : "text-slate-400"
                          : idx === 0
                            ? "text-brand-600"
                            : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        {(status === "loading" ||
          status === "success" ||
          status === "duplicate") && (
          <div className="flex-1 bg-white z-50 flex flex-col items-center justify-center px-8 py-16 text-center">
            {status === "loading" ? (
              <>
                <div className="w-20 h-20 border-4 border-slate-100 border-t-medical-emerald rounded-full animate-spin mb-8" />
                <h3 className="text-3xl font-extrabold text-slate-800 mb-3">
                  Processing Details...
                </h3>
                <p className="text-slate-500 text-lg font-medium">
                  Securely transmitting your health profile.
                </p>
              </>
            ) : status === "duplicate" ? (
              <>
                <div className="w-20 h-20 bg-emerald-50 text-medical-emerald rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-200 shadow-xl shadow-emerald-500/10">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                  You&apos;re All Set! 🎉
                </h3>
                <p className="text-slate-600 text-xl max-w-md mb-10 leading-relaxed font-medium">
                  Good news — we already have your health assessment on file. No
                  need to fill it out again.
                </p>
                <p className="text-base font-bold text-brand-500 animate-pulse tracking-wide">
                  Taking you to our pricing page...
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-medical-emerald/10 text-medical-emerald rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-medical-emerald/30 shadow-xl shadow-medical-emerald/20">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                  Intake Received
                </h3>
                <p className="text-slate-600 text-xl max-w-md mb-10 leading-relaxed font-medium">
                  Thank you. Our wellness team will review your information
                  securely and contact you shortly.
                </p>
                <p className="text-base font-bold text-brand-500 animate-pulse tracking-wide">
                  Redirecting you to our pricing page...
                </p>
              </>
            )}
          </div>
        )}

        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar relative flex-1 bg-slate-50/50">
          {status === "error" && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mt-4 animate-fade-in mb-4">
              There was an issue submitting your form. Please try again.
            </div>
          )}

          {!user &&
            status !== "success" &&
            status !== "loading" &&
            status !== "duplicate" && (
              <form onSubmit={handleAuth} className="max-w-md mx-auto py-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-50 text-medical-emerald rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                    <UserCheck className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-brand-950 mb-2">
                    {authMode === "login"
                      ? "Login to Continue"
                      : "Create Your Account"}
                  </h3>

                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {authMode === "login"
                      ? "Login to securely continue your medical wellness intake."
                      : "Create your account to securely save your medical intake details."}
                  </p>
                </div>

                <div className="flex border-b border-slate-200 mb-6 relative">
                  <button
                    type="button"
                    className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                      authMode === "login"
                        ? "text-emerald-600"
                        : "text-slate-500 hover:text-emerald-600"
                    }`}
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                      setAuthFieldErrors({});
                    }}
                  >
                    Sign In
                    {authMode === "login" && (
                      <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-500 rounded-t-md" />
                    )}
                  </button>

                  <button
                    type="button"
                    className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                      authMode === "register"
                        ? "text-emerald-600"
                        : "text-slate-500 hover:text-emerald-600"
                    }`}
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError("");
                      setAuthFieldErrors({});
                    }}
                  >
                    Create Account
                    {authMode === "register" && (
                      <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-emerald-500 rounded-t-md" />
                    )}
                  </button>
                </div>

                {authError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold mb-4">
                    {authError}
                  </div>
                )}

                <div className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 block ml-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={authData.fullName}
                          onChange={(e) => {
                            setAuthData((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }));
                            setAuthFieldErrors((p) => ({ ...p, fullName: false }));
                          }}
                          placeholder="Enter your full name"
                          className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${authFieldErrors.fullName ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 block ml-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={authData.phone}
                          onChange={(e) => {
                            setAuthData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }));
                            setAuthFieldErrors((p) => ({ ...p, phone: false }));
                          }}
                          placeholder="+91 98765 43210"
                          className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${authFieldErrors.phone ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 block ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={authData.email}
                      onChange={(e) => {
                        setAuthData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));
                        setAuthFieldErrors((p) => ({ ...p, email: false }));
                      }}
                      placeholder="name@example.com"
                      className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${authFieldErrors.email ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 block ml-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={authData.password}
                      onChange={(e) => {
                        setAuthData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }));
                        setAuthFieldErrors((p) => ({ ...p, password: false }));
                      }}
                      placeholder="••••••••"
                      className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-none ring-1 transition-all outline-none text-slate-900 ${authFieldErrors.password ? "ring-red-500 animate-bounce-twice" : "ring-slate-200 focus:ring-2 focus:ring-emerald-500"}`}
                    />
                  </div>

                  {authMode === "register" && (
                    <label key={termsBounceKey} className={`flex items-start gap-3 cursor-pointer ${termsBounceKey > 0 ? "animate-bounce-twice" : ""}`}>
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          if (e.target.checked) setTermsBounceKey(0);
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={`text-xs font-medium leading-relaxed ${termsBounceKey > 0 ? "text-red-500" : "text-slate-500"}`}>
                        By clicking you agree to our{" "}
                        <a href="#" className={`hover:underline font-semibold ${termsBounceKey > 0 ? "text-red-500" : "text-emerald-600"}`}>Terms &amp; Conditions</a>
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-[#10b981] text-white py-4 px-6 rounded-2xl text-sm font-bold hover:bg-[#059669] transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Please wait...
                      </>
                    ) : authMode === "login" ? (
                      "Sign In & Continue"
                    ) : (
                      "Create Account & Continue"
                    )}
                  </button>
                </div>
              </form>
            )}
          {user &&
            status !== "success" &&
            status !== "loading" &&
            status !== "duplicate" && (
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pb-10">
                {currentStep === 0 && (
                  <div className="step-container animate-reveal-up">
                    <h3 className="text-xl font-bold text-brand-950 mb-6">
                      Personal Information
                    </h3>

                    <div className="space-y-5">
                      <div className="floating-label-group">
                        <input
                          type="text"
                          name="fullName"
                          placeholder=" "
                          required
                          value={formData.fullName}
                          onChange={handleTextChange}
                          className="floating-input peer"
                        />
                        <label className="floating-label">
                          Full Legal Name
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="floating-label-group">
                          <input
                            type="email"
                            name="email"
                            placeholder=" "
                            required
                            value={formData.email}
                            onChange={handleTextChange}
                            className="floating-input peer"
                          />
                          <label className="floating-label">
                            Email Address
                          </label>
                        </div>

                        <div className="floating-label-group">
                          <input
                            type="tel"
                            name="phone"
                            placeholder=" "
                            required
                            value={formData.phone}
                            onChange={handleTextChange}
                            className="floating-input peer"
                          />
                          <label className="floating-label">Phone Number</label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                        <div className="floating-label-group">
                          <input
                            type="number"
                            name="age"
                            placeholder=" "
                            required
                            value={formData.age}
                            onChange={handleTextChange}
                            className="floating-input peer"
                          />
                          <label className="floating-label">Age</label>
                        </div>

                        <div className="relative w-full">
                          <select
                            name="gender"
                            required
                            value={formData.gender}
                            onChange={handleTextChange}
                            className="w-full px-4 pt-5 pb-2 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-brand-500 transition-all text-slate-800 font-bold text-sm appearance-none"
                          >
                            <option value="" disabled></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>

                          <label className="absolute left-4 top-2 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider pointer-events-none">
                            Gender
                          </label>

                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="floating-label-group">
                          <input
                            type="number"
                            name="height"
                            placeholder=" "
                            required
                            value={formData.height}
                            onChange={handleTextChange}
                            className="floating-input peer"
                          />
                          <label className="floating-label">Height (cm)</label>
                        </div>

                        <div className="floating-label-group">
                          <input
                            type="number"
                            name="weight"
                            placeholder=" "
                            required
                            value={formData.weight}
                            onChange={handleTextChange}
                            className="floating-input peer"
                          />
                          <label className="floating-label">Weight (kg)</label>
                        </div>
                      </div>

                      <div className="floating-label-group">
                        <input
                          type="text"
                          name="location"
                          placeholder=" "
                          required
                          value={formData.location}
                          onChange={handleTextChange}
                          className="floating-input peer"
                        />
                        <label className="floating-label">City / Country</label>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-brand-950 mb-3">
                          Health Goals
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            "Weight Management",
                            "Fat Loss Support",
                            "Muscle Support",
                            "Energy Improvement",
                            "Metabolic Wellness",
                            "Lifestyle Improvement",
                            "General Wellness & Longevity",
                          ].map((goal) => {
                            const isChecked = formData.goals.includes(goal);

                            return (
                              <label
                                key={goal}
                                className="cursor-pointer block relative group"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleGoalCheckbox(goal)}
                                  className="sr-only"
                                />

                                <div
                                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 shadow-sm group-hover:shadow-md ${
                                    isChecked
                                      ? "border-medical-emerald bg-emerald-50/50"
                                      : "border-slate-100 bg-white hover:border-brand-200"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                                      isChecked
                                        ? "bg-medical-emerald border-medical-emerald text-white"
                                        : "border-slate-200 text-transparent"
                                    }`}
                                  >
                                    <Check className="w-2.5 h-2.5" />
                                  </div>

                                  <span className="font-bold text-slate-700 text-xs">
                                    {goal}
                                  </span>
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
                  <div className="step-container animate-reveal-up">
                    <h3 className="text-xl font-bold text-brand-950 mb-2">
                      Quick Medical Check
                    </h3>

                    <p className="text-slate-500 text-sm font-medium mb-6">
                      A few quick questions for your clinical safety.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                      {[
                        {
                          name: "diabetes",
                          label: "Diabetes?",
                          options: ["No", "Yes - Type 1", "Yes - Type 2"],
                        },
                        {
                          name: "highBP",
                          label: "High Blood Pressure?",
                          options: ["No", "Yes"],
                        },
                        {
                          name: "thyroid",
                          label: "Thyroid Issues?",
                          options: ["No", "Yes"],
                        },
                      ].map((selectField) => (
                        <div key={selectField.name} className="relative w-full">
                          <select
                            name={selectField.name}
                            required
                            value={
                              formData[
                                selectField.name as keyof typeof formData
                              ] as string
                            }
                            onChange={handleTextChange}
                            className="w-full px-4 pt-5 pb-2 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-brand-500 transition-all text-slate-800 font-bold text-sm appearance-none"
                          >
                            <option value="" disabled></option>

                            {selectField.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          <label className="absolute left-4 top-2 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider pointer-events-none">
                            {selectField.label}
                          </label>

                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-sm text-brand-900 font-medium leading-relaxed">
                      <Info className="w-4 h-4 inline-block mr-1 -mt-0.5" />{" "}
                      <strong>Medical Disclaimer:</strong> This wellness program
                      does not replace professional medical advice, diagnosis,
                      or treatment.
                    </div>

                    <label className="flex items-start gap-4 cursor-pointer p-4 border-2 border-slate-100 rounded-xl hover:border-medical-emerald/30 transition-colors bg-slate-50">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={handleConsentCheckbox}
                        className="mt-1 w-5 h-5 rounded text-medical-emerald focus:ring-medical-emerald border-slate-300 cursor-pointer"
                      />

                      <span className="text-sm font-bold text-slate-700 leading-snug">
                        I confirm that the information provided is accurate and
                        true to the best of my knowledge. I consent to medical
                        review by Genestac providers.
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
                    {currentStep < 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-brand-900 text-white font-bold py-4 px-8 rounded-xl shadow-luxury hover:-translate-y-1 transition-all flex items-center gap-2 uppercase tracking-widest text-xs btn-shine"
                      >
                        Next Step <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-medical-emerald text-white font-extrabold py-4 px-8 rounded-xl shadow-luxury hover:bg-medical-emerald_dark hover:-translate-y-1 transition-all flex items-center gap-2 uppercase tracking-widest text-sm btn-shine"
                      >
                        Submit For Medical Review{" "}
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
        </div>

        {showOtpModal && (
          <OtpModal
            email={otpEmail}
            userId={otpUserId}
            onVerified={async () => {
              setShowOtpModal(false);

              const { error } = await supabase.auth.signInWithPassword({
                email: otpEmail,
                password: otpPassword,
              });

              if (!error) {
                const {
                  data: { session },
                } = await supabase.auth.getSession();

                if (session?.user) {
                  setUser(session.user);
                }
              }
            }}
            onClose={() => setShowOtpModal(false)}
          />
        )}
      </div>
    </div>
  );
};
