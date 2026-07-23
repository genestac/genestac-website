"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Droplets,
  HeartPulse,
  Home,
  Moon,
  Save,
  ShoppingCart,
  UserRound,
  Utensils,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type BooleanChoice = "" | "true" | "false";

type PatientProfileForm = {
  full_name: string;
  email: string;
  phone_number: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  address: string;
  goal: string;
  diabetes: BooleanChoice;
  high_bp: BooleanChoice;
  thyroid: BooleanChoice;
  heart_disease: BooleanChoice;
  kidney_problem: BooleanChoice;
  liver_problem: BooleanChoice;
  hormonal_imbalance_or_pcos: BooleanChoice;
  pregnancy_status: string;
  allergies: string;
  current_medication: string;
  previous_surgeries: string;
  exercise_frequency: string;
  daily_activity_level: string;
  sleep_duration: string;
  daily_water_intake: string;
  stress_level: string;
  food_preference: string;
  smoking_habit: string;
  alcohol_consumption: string;
};

type PatientProfileRow = {
  name: string | null;
  email: string | null;
  phone: string | null;
  street_address: string | null;
  metadata: Record<string, any> | null;
};

type FieldConfig = {
  name: keyof PatientProfileForm;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "boolean";
  placeholder?: string;
  options?: string[];
};

const emptyProfile: PatientProfileForm = {
  full_name: "",
  email: "",
  phone_number: "",
  age: "",
  gender: "",
  height_cm: "",
  weight_kg: "",
  address: "",
  goal: "",
  diabetes: "",
  high_bp: "",
  thyroid: "",
  heart_disease: "",
  kidney_problem: "",
  liver_problem: "",
  hormonal_imbalance_or_pcos: "",
  pregnancy_status: "",
  allergies: "",
  current_medication: "",
  previous_surgeries: "",
  exercise_frequency: "",
  daily_activity_level: "",
  sleep_duration: "",
  daily_water_intake: "",
  stress_level: "",
  food_preference: "",
  smoking_habit: "",
  alcohol_consumption: "",
};

const profileFields = Object.keys(emptyProfile) as (keyof PatientProfileForm)[];
const temporaryPhonePrefix = "pending-";

// Fields shown by default, before the user expands "Show more"
const basicFieldNames: (keyof PatientProfileForm)[] = [
  "full_name",
  "email",
  "phone_number",
];

const sections: {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: FieldConfig[];
}[] = [
  {
    title: "Personal Details",
    description: "Basic information used for your care profile and follow-ups.",
    icon: <UserRound className="h-5 w-5" />,
    fields: [
      { name: "full_name", label: "Full name", placeholder: "Your full name" },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
      },
      {
        name: "phone_number",
        label: "Phone number",
        placeholder: "+91 98765 43210",
      },
      { name: "age", label: "Age", type: "number", placeholder: "32" },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female", "Other", "Prefer not to say"],
      },
      {
        name: "address",
        label: "Address",
        type: "textarea",
        placeholder: "Street, city, state, postal code",
      },
    ],
  },
  {
    title: "Body & Goal",
    description: "Your current measurements and primary treatment objective.",
    icon: <Activity className="h-5 w-5" />,
    fields: [
      {
        name: "height_cm",
        label: "Height (cm)",
        type: "number",
        placeholder: "170",
      },
      {
        name: "weight_kg",
        label: "Weight (kg)",
        type: "number",
        placeholder: "72",
      },
      {
        name: "goal",
        label: "Goal",
        type: "textarea",
        placeholder: "Tell us what you want to improve",
      },
    ],
  },
  {
    title: "Medical History",
    description:
      "Health conditions that help doctors review your treatment safely.",
    icon: <HeartPulse className="h-5 w-5" />,
    fields: [
      { name: "diabetes", label: "Diabetes", type: "boolean" },
      { name: "high_bp", label: "High BP", type: "boolean" },
      { name: "thyroid", label: "Thyroid", type: "boolean" },
      { name: "heart_disease", label: "Heart disease", type: "boolean" },
      { name: "kidney_problem", label: "Kidney problem", type: "boolean" },
      { name: "liver_problem", label: "Liver problem", type: "boolean" },
      {
        name: "hormonal_imbalance_or_pcos",
        label: "Hormonal imbalance or PCOS",
        type: "boolean",
      },
      {
        name: "pregnancy_status",
        label: "Pregnancy status",
        type: "select",
        options: ["Not applicable", "No", "Pregnant", "Trying to conceive"],
      },
      {
        name: "allergies",
        label: "Allergies",
        type: "textarea",
        placeholder: "Mention allergies or write None",
      },
      {
        name: "current_medication",
        label: "Current medication",
        type: "textarea",
        placeholder: "List current medicines or write None",
      },
      {
        name: "previous_surgeries",
        label: "Previous surgeries",
        type: "textarea",
        placeholder: "List surgeries or write None",
      },
    ],
  },
  {
    title: "Lifestyle",
    description:
      "Daily habits that influence recovery, energy, and weight goals.",
    icon: <Moon className="h-5 w-5" />,
    fields: [
      {
        name: "exercise_frequency",
        label: "Exercise frequency",
        type: "select",
        options: ["Never", "1-2 days/week", "3-4 days/week", "5+ days/week"],
      },
      {
        name: "daily_activity_level",
        label: "Daily activity level",
        type: "select",
        options: ["Sedentary", "Light", "Moderate", "Very active"],
      },
      {
        name: "sleep_duration",
        label: "Sleep duration",
        type: "select",
        options: [
          "Less than 5 hours",
          "5-6 hours",
          "7-8 hours",
          "More than 8 hours",
        ],
      },
      {
        name: "daily_water_intake",
        label: "Daily water intake",
        type: "select",
        options: ["Less than 1L", "1-2L", "2-3L", "More than 3L"],
      },
      {
        name: "stress_level",
        label: "Stress level",
        type: "select",
        options: ["Low", "Moderate", "High", "Very high"],
      },
      {
        name: "food_preference",
        label: "Food preference",
        type: "select",
        options: [
          "Vegetarian",
          "Non-vegetarian",
          "Eggetarian",
          "Vegan",
          "Jain",
        ],
      },
      {
        name: "smoking_habit",
        label: "Smoking habit",
        type: "select",
        options: ["Never", "Occasionally", "Regularly", "Quit"],
      },
      {
        name: "alcohol_consumption",
        label: "Alcohol consumption",
        type: "select",
        options: ["Never", "Occasionally", "Weekly", "Frequently"],
      },
    ],
  },
];

const requiredFields = sections.flatMap((section) =>
  section.fields.map((field) => field.name),
);

const asString = (value: string | number | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

const asBooleanChoice = (value: boolean | null): BooleanChoice => {
  if (value === true) return "true";
  if (value === false) return "false";
  return "";
};

const visiblePhone = (phone: string | null | undefined) =>
  phone?.startsWith(temporaryPhonePrefix) ? "" : asString(phone);

const mapRowToForm = (
  row: PatientProfileRow | null,
  user: SupabaseUser,
): PatientProfileForm => ({
  ...emptyProfile,
  full_name:
    asString(row?.name) ||
    asString(user.user_metadata?.full_name) ||
    asString(user.email),
  email: asString(row?.email) || asString(user.email),
  phone_number: visiblePhone(row?.phone),
  age: asString(row?.metadata?.age),
  gender: asString(row?.metadata?.gender),
  height_cm: asString(row?.metadata?.height_cm),
  weight_kg: asString(row?.metadata?.weight_kg),
  address: asString(row?.street_address),
  goal: asString(row?.metadata?.goal),
  diabetes: asBooleanChoice(row?.metadata?.diabetes ?? null),
  high_bp: asBooleanChoice(row?.metadata?.high_bp ?? null),
  thyroid: asBooleanChoice(row?.metadata?.thyroid ?? null),
  heart_disease: asBooleanChoice(row?.metadata?.heart_disease ?? null),
  kidney_problem: asBooleanChoice(row?.metadata?.kidney_problem ?? null),
  liver_problem: asBooleanChoice(row?.metadata?.liver_problem ?? null),
  hormonal_imbalance_or_pcos: asBooleanChoice(
    row?.metadata?.hormonal_imbalance_or_pcos ?? null,
  ),
  pregnancy_status: asString(row?.metadata?.pregnancy_status),
  allergies: asString(row?.metadata?.allergies),
  current_medication: asString(row?.metadata?.current_medication),
  previous_surgeries: asString(row?.metadata?.previous_surgeries),
  exercise_frequency: asString(row?.metadata?.exercise_frequency),
  daily_activity_level: asString(row?.metadata?.daily_activity_level),
  sleep_duration: asString(row?.metadata?.sleep_duration),
  daily_water_intake: asString(row?.metadata?.daily_water_intake),
  stress_level: asString(row?.metadata?.stress_level),
  food_preference: asString(row?.metadata?.food_preference),
  smoking_habit: asString(row?.metadata?.smoking_habit),
  alcohol_consumption: asString(row?.metadata?.alcohol_consumption),
});

const toNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const toNullableNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : null;
};

const toNullableBoolean = (value: BooleanChoice) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};

const isProfileComplete = (form: PatientProfileForm) =>
  requiredFields.every((field) => form[field].trim().length > 0);

export default function Page() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [form, setForm] = useState<PatientProfileForm>(emptyProfile);
  const [savedForm, setSavedForm] = useState<PatientProfileForm>(emptyProfile);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchCartCount = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const items = await res.json();
          setCartCount(Array.isArray(items) ? items.length : 0);
        }
      } catch {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const bypass = urlParams.get("bypassAuth") === "true";

      if (bypass) {
        const mockUser = {
          id: "mock-user-7788",
          email: "patient@genestac.com",
          user_metadata: { full_name: "Amit Sharma" },
        } as unknown as SupabaseUser;

        setIsBypassed(true);
        setUser(mockUser);
        const mockProfile = {
          ...emptyProfile,
          full_name: "Amit Sharma",
          email: "patient@genestac.com",
        };
        setForm(mockProfile);
        setSavedForm(mockProfile);
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        const fallbackProfile = mapRowToForm(null, currentUser);
        setMessage({ type: "error", text: error.message });
        setForm(fallbackProfile);
        setSavedForm(fallbackProfile);
        setLoading(false);
        return;
      }

      if (!data) {
        const fallbackPhone = `${temporaryPhonePrefix}${currentUser.id}`;
        const { data: createdProfile, error: createError } = await supabase
          .from("users")
          .insert({
            id: currentUser.id,
            name:
              asString(currentUser.user_metadata?.full_name) ||
              asString(currentUser.email),
            email: currentUser.email,
            phone: fallbackPhone,
            status: "NEW",
          })
          .select("*")
          .single();

        if (createError) {
          const fallbackProfile = mapRowToForm(null, currentUser);
          setMessage({ type: "error", text: createError.message });
          setForm(fallbackProfile);
          setSavedForm(fallbackProfile);
        } else {
          const createdForm = mapRowToForm(
            createdProfile as PatientProfileRow,
            currentUser,
          );
          setProfileCompleted(Boolean(createdProfile.metadata?.profile_completed));
          setForm(createdForm);
          setSavedForm(createdForm);
        }
      } else {
        const profile = data as PatientProfileRow;
        const loadedForm = mapRowToForm(profile, currentUser);
        setProfileCompleted(Boolean(profile.metadata?.profile_completed));
        setForm(loadedForm);
        setSavedForm(loadedForm);
      }

      setLoading(false);
    };

    void loadDashboard();
  }, [router]);

  const completion = useMemo(() => {
    const completedFields = requiredFields.filter(
      (field) => form[field].trim().length > 0,
    ).length;

    return {
      completedFields,
      totalFields: requiredFields.length,
      percent: Math.round((completedFields / requiredFields.length) * 100),
    };
  }, [form]);

  const displayName = form.full_name || user?.email || "Patient";
  const initials = displayName.slice(0, 2).toUpperCase();
  const userId = user?.id?.slice(0, 8) ?? "";
  const hasProfileChanges = useMemo(
    () => profileFields.some((field) => form[field] !== savedForm[field]),
    [form, savedForm],
  );

  const updateField = (name: keyof PatientProfileForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setMessage(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!hasProfileChanges) return;

    const trimmedPhone = form.phone_number.trim();
    if (!trimmedPhone) {
      setMessage({
        type: "error",
        text: "Phone number is required before saving your patient profile.",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    const completed = isProfileComplete(form);
    const payload = {
      id: user.id,
      name: toNullableString(form.full_name),
      email: toNullableString(form.email),
      phone: trimmedPhone,
      street_address: toNullableString(form.address),
      updated_at: new Date().toISOString(),
      metadata: {
        age: toNullableNumber(form.age),
        gender: toNullableString(form.gender),
        height_cm: toNullableNumber(form.height_cm),
        weight_kg: toNullableNumber(form.weight_kg),
        goal: toNullableString(form.goal),
        diabetes: toNullableBoolean(form.diabetes),
        high_bp: toNullableBoolean(form.high_bp),
        thyroid: toNullableBoolean(form.thyroid),
        heart_disease: toNullableBoolean(form.heart_disease),
        kidney_problem: toNullableBoolean(form.kidney_problem),
        liver_problem: toNullableBoolean(form.liver_problem),
        hormonal_imbalance_or_pcos: toNullableBoolean(
          form.hormonal_imbalance_or_pcos,
        ),
        pregnancy_status: toNullableString(form.pregnancy_status),
        allergies: toNullableString(form.allergies),
        current_medication: toNullableString(form.current_medication),
        previous_surgeries: toNullableString(form.previous_surgeries),
        exercise_frequency: toNullableString(form.exercise_frequency),
        daily_activity_level: toNullableString(form.daily_activity_level),
        sleep_duration: toNullableString(form.sleep_duration),
        daily_water_intake: toNullableString(form.daily_water_intake),
        stress_level: toNullableString(form.stress_level),
        food_preference: toNullableString(form.food_preference),
        smoking_habit: toNullableString(form.smoking_habit),
        alcohol_consumption: toNullableString(form.alcohol_consumption),
        profile_completed: completed,
      }
    };

    const { error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "id" });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setProfileCompleted(completed);
    setSavedForm(form);
    toast.success("Profile Saved");
    setMessage({
      type: "success",
      text: completed
        ? "Profile saved and marked complete."
        : "Profile saved. Complete the remaining fields when you can.",
    });
  };

  const renderField = (field: FieldConfig) => {
    const value = form[field.name];
    const baseClass =
      "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

    if (field.type === "textarea") {
      return (
        <textarea
          value={value}
          onChange={(event) => updateField(field.name, event.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseClass} resize-none leading-relaxed`}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={value}
          onChange={(event) => updateField(field.name, event.target.value)}
          className={baseClass}
        >
          <option value="">Select</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "boolean") {
      return (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["true", "false"] as BooleanChoice[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateField(field.name, option)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                value === option
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {option === "true" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      );
    }

    return (
      <input
        type={field.type ?? "text"}
        value={value}
        onChange={(event) => updateField(field.name, event.target.value)}
        placeholder={field.placeholder}
        className={baseClass}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
        <p className="font-medium text-slate-500">
          Loading Patient Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-16 flex-col gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                Patient Portal
              </p>
              <h1 className="text-lg font-bold text-slate-950 sm:text-xl">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
            <Link
              href={`/dashboard/cart${isBypassed ? "?bypassAuth=true" : ""}`}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">
                      Complete your patient details
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Keep this information accurate so your dashboard,
                      orders, and doctor reviews stay connected to the right
                      patient profile.
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                      profileCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {profileCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {profileCompleted ? "Complete" : "Incomplete"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Completion
                  </span>
                  <span className="text-sm font-bold text-sky-700">
                    {completion.percent}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all"
                    style={{ width: `${completion.percent}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {completion.completedFields} of {completion.totalFields}{" "}
                  fields filled.
                </p>
              </div>
            </section>

            {message && (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-none" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              {sections.map((section, sectionIndex) => {
                const isPersonalDetails = sectionIndex === 0;

                // Personal Details always renders, but only the basic
                // fields show until "Show more" is toggled on. Every
                // other section is hidden entirely until then.
                if (!isPersonalDetails && !showAllDetails) {
                  return null;
                }

                const visibleFields = isPersonalDetails
                  ? section.fields.filter(
                      (field) =>
                        showAllDetails ||
                        basicFieldNames.includes(field.name),
                    )
                  : section.fields;

                return (
                  <section
                    key={section.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
                  >
                    <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-950">
                          {section.title}
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {visibleFields.map((field) => (
                        <label
                          key={field.name}
                          className={
                            field.type === "textarea"
                              ? "md:col-span-2"
                              : undefined
                          }
                        >
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                            {field.name === "daily_water_intake" && (
                              <Droplets className="h-3.5 w-3.5 text-sky-600" />
                            )}
                            {field.name === "food_preference" && (
                              <Utensils className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                            {field.name === "goal" && (
                              <ClipboardList className="h-3.5 w-3.5 text-violet-600" />
                            )}
                            {field.label}
                          </span>
                          {renderField(field)}
                        </label>
                      ))}
                    </div>

                    {isPersonalDetails && (
                      <button
                        type="button"
                        onClick={() => setShowAllDetails((prev) => !prev)}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 transition hover:text-sky-800"
                      >
                        {showAllDetails ? (
                          <>
                            Show less
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Show more
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </section>
                );
              })}

              <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Edit any field to enable saving. The profile becomes
                  complete when every field has a value.
                </p>
                <button
                  type="submit"
                  disabled={saving || !hasProfileChanges}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving
                    ? "Saving..."
                    : hasProfileChanges
                      ? "Save profile"
                      : "No changes"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
  );
}