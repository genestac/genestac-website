"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { User, Check, Loader2 } from "lucide-react";

interface AgeGenderPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (age: number, gender: "male" | "female" | "other") => Promise<void>;
}

export default function AgeGenderPrompt({
  isOpen,
  onClose,
  onSave,
}: AgeGenderPromptProps) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ age?: string; gender?: string }>({});

  const ageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      ageRef.current?.focus();
      setAge("");
      setGender("male");
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const errs: { age?: string; gender?: string } = {};
    if (!age) {
      errs.age = "Age is required";
    } else if (isNaN(Number(age)) || Number(age) < 18 || Number(age) > 120) {
      errs.age = "Enter a valid age (18-120)";
    }
    if (!gender) errs.gender = "Gender is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(Number(age), gender);
      onClose();
      toast.success("Age and gender saved");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Personal Details
            </h3>
            <p className="text-[11px] text-slate-500">
              We need your age & gender for recommendations
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Age *
            </label>
            <input
              ref={ageRef}
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="18"
              max="120"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.age && (
              <p className="text-[11px] text-red-500 mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Gender *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["male", "female", "other"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition ${
                    gender === g
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-[11px] text-red-500 mt-1">{errors.gender}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
