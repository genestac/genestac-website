"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Utensils,
  Activity,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export interface HealthProfileData {
  food_habits: string;
  lifestyle_habits: string;
  medical_issues: string;
  allergies: string;
  submitted_at?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (data: any) => void;
  initialData?: HealthProfileData | null;
  userId: string;
}

const FOOD_PRESETS = [
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian",
  "Vegan",
  "High Protein",
  "Low Carb / Keto",
  "No Added Sugar",
  "Intermittent Fasting",
];

const LIFESTYLE_PRESETS = [
  "Sedentary (Desk Job)",
  "Lightly Active",
  "Moderately Active",
  "Very Active / Athletic",
  "Night Shift Worker",
  "Irregular Sleep Pattern",
];

const MEDICAL_PRESETS = [
  "Diabetes / High Sugar",
  "High BP (Hypertension)",
  "Thyroid (Hypo/Hyper)",
  "PCOS / PCOD",
  "Heart Condition",
  "Joint / Knee Pain",
  "No Medical Issues",
];

const ALLERGY_PRESETS = [
  "Peanuts / Tree Nuts",
  "Lactose / Dairy",
  "Seafood / Shellfish",
  "Gluten / Wheat",
  "Egg Allergy",
  "Drug / Medication Allergy",
  "No Allergies",
];

export default function HealthProfileModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
  userId,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [foodHabits, setFoodHabits] = useState("");
  const [lifestyleHabits, setLifestyleHabits] = useState("");
  const [medicalIssues, setMedicalIssues] = useState("");
  const [allergies, setAllergies] = useState("");

  const [selectedFoodPresets, setSelectedFoodPresets] = useState<string[]>([]);
  const [selectedLifestylePresets, setSelectedLifestylePresets] = useState<string[]>([]);
  const [selectedMedicalPresets, setSelectedMedicalPresets] = useState<string[]>([]);
  const [selectedAllergyPresets, setSelectedAllergyPresets] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFoodHabits(initialData.food_habits || "");
      setLifestyleHabits(initialData.lifestyle_habits || "");
      setMedicalIssues(initialData.medical_issues || "");
      setAllergies(initialData.allergies || "");
    }
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const togglePreset = (
    preset: string,
    currentSelected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    currentText: string,
    setText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let nextSelected: string[];
    if (currentSelected.includes(preset)) {
      nextSelected = currentSelected.filter((p) => p !== preset);
    } else {
      nextSelected = [...currentSelected, preset];
    }
    setSelected(nextSelected);

    // Auto-update text field with selected presets cleanly
    const extraCustom = currentText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !currentSelected.includes(s));

    const combined = [...nextSelected, ...extraCustom].join(", ");
    setText(combined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodHabits.trim() && !lifestyleHabits.trim() && !medicalIssues.trim() && !allergies.trim()) {
      toast.error("Please fill in at least one section before saving.");
      return;
    }

    setSaving(true);

    const healthProfileData: HealthProfileData = {
      food_habits: foodHabits.trim(),
      lifestyle_habits: lifestyleHabits.trim(),
      medical_issues: medicalIssues.trim(),
      allergies: allergies.trim(),
      submitted_at: new Date().toISOString(),
    };

    // Close modal immediately for instant feedback
    if (onSaved) {
      onSaved({
        isGenerating: true,
        health_profile: healthProfileData,
      });
    }
    onClose();

    try {
      const payload = {
        userId,
        food_habits: foodHabits.trim(),
        lifestyle_habits: lifestyleHabits.trim(),
        medical_issues: medicalIssues.trim(),
        allergies: allergies.trim(),
      };

      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || resData.error) {
        throw new Error(resData.error || "Failed to generate plan");
      }

      toast.success("AI Diet & Exercise Plans generated! (Pending Doctor Review)");
      if (onSaved) onSaved(resData);
    } catch (err: any) {
      console.error("Error generating health profile and plans:", err);
      toast.error(err.message || "Failed to generate plans. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-250 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div
        className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl my-auto border border-emerald-100/80 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            Customization Intake
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Tell us about yourself
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            Fill in your food preferences, lifestyle, medical conditions, and allergies so our health experts can tailor your personalized Diet & Exercise plans.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
          {/* Section 1: Food Habits */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              <span>1. Food Habits & Dietary Preferences</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Select key diet tags or describe your daily meal routine, likes, and dislikes:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {FOOD_PRESETS.map((tag) => {
                const active = selectedFoodPresets.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      togglePreset(
                        tag,
                        selectedFoodPresets,
                        setSelectedFoodPresets,
                        foodHabits,
                        setFoodHabits
                      )
                    }
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                      active
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
            <textarea
              rows={2}
              value={foodHabits}
              onChange={(e) => setFoodHabits(e.target.value)}
              placeholder="e.g. Prefer 3 meals a day, vegetarian on Tuesdays, no onion-garlic, drink tea twice daily..."
              className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-hidden transition"
            />
          </div>

          {/* Section 2: Lifestyle Habits */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>2. Lifestyle Habits & Daily Routine</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Describe your physical activity, sleep patterns, work schedule, or habits:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {LIFESTYLE_PRESETS.map((tag) => {
                const active = selectedLifestylePresets.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      togglePreset(
                        tag,
                        selectedLifestylePresets,
                        setSelectedLifestylePresets,
                        lifestyleHabits,
                        setLifestyleHabits
                      )
                    }
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                      active
                        ? "bg-blue-500 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
            <textarea
              rows={2}
              value={lifestyleHabits}
              onChange={(e) => setLifestyleHabits(e.target.value)}
              placeholder="e.g. 8-hour desk job, sleep at midnight (6 hrs), walk 4,000 steps daily, occasional alcohol on weekends..."
              className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-hidden transition"
            />
          </div>

          {/* Section 3: Medical Issues */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
              <Stethoscope className="w-5 h-5 text-rose-500" />
              <span>3. Medical Issues & Conditions</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Select existing health conditions or specify medications / surgeries:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {MEDICAL_PRESETS.map((tag) => {
                const active = selectedMedicalPresets.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      togglePreset(
                        tag,
                        selectedMedicalPresets,
                        setSelectedMedicalPresets,
                        medicalIssues,
                        setMedicalIssues
                      )
                    }
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                      active
                        ? "bg-rose-500 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
            <textarea
              rows={2}
              value={medicalIssues}
              onChange={(e) => setMedicalIssues(e.target.value)}
              placeholder="e.g. Mild thyroid issue taking 25mcg Thyronorm, lower back tightness, knee pain during squats..."
              className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-hidden transition"
            />
          </div>

          {/* Section 4: Allergies */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
              <AlertTriangle className="w-5 h-5 text-purple-500" />
              <span>4. Allergies & Sensitivities</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Mention any food, ingredient, or drug allergies we must strictly avoid:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {ALLERGY_PRESETS.map((tag) => {
                const active = selectedAllergyPresets.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      togglePreset(
                        tag,
                        selectedAllergyPresets,
                        setSelectedAllergyPresets,
                        allergies,
                        setAllergies
                      )
                    }
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                      active
                        ? "bg-purple-500 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
            <textarea
              rows={2}
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Lactose intolerant, allergic to raw mushrooms and Penicillin, or write None..."
              className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-hidden transition"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Health & Lifestyle Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
