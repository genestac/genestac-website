"use client";

import { PremiumGate } from "@/components/PremiumGate";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  Activity,
  Dumbbell,
  Timer,
  Flame,
  CalendarHeart,
  ClipboardList,
  Edit3,
  CheckCircle2,
  HeartPulse,
  Loader2,
  Sparkles,
} from "lucide-react";
import HealthProfileModal, {
  HealthProfileData,
} from "@/components/modals/HealthProfileModal";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function getToday() {
  // JS getDay(): 0 = Sunday ... 6 = Saturday. Map to our array (monday-first).
  const jsDay = new Date().getDay();
  return daysOfWeek[(jsDay + 6) % 7];
}

export default function ExercisePlanPage() {
  const [exercisePlan, setExercisePlan] = useState<any>(null);
  const [healthProfile, setHealthProfile] = useState<HealthProfileData | null>(
    null,
  );
  const [doctorReview, setDoctorReview] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>(getToday());

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setError("Not logged in");
          setLoading(false);
          return;
        }

        setUserId(session.user.id);

        const { data, error } = await supabase
          .from("user_plans")
          .select("exercise_plan, health_profile, doctor_review")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;

        const fetchedPlan = data?.exercise_plan || {};
        const fetchedProfile = data?.health_profile || null;

        setExercisePlan(fetchedPlan);
        setHealthProfile(fetchedProfile);
        setDoctorReview(data?.doctor_review ?? false);

        // If exercise_plan data is absent for user_id in user_plans, show the popup
        const isExercisePlanAbsent =
          !fetchedPlan || Object.keys(fetchedPlan).length === 0;

        if (isExercisePlanAbsent) {
          setIsModalOpen(true);
        }
      } catch (err: any) {
        console.error(err);
        setError("Could not load exercise plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isProfileSubmitted =
    healthProfile &&
    (healthProfile.food_habits ||
      healthProfile.lifestyle_habits ||
      healthProfile.medical_issues ||
      healthProfile.allergies);

  const isPlanAbsent =
    error || !exercisePlan || Object.keys(exercisePlan).length === 0;

  // Show Under Doctor Review screen if doctor_review is false or plan is absent/generating
  if (isPlanAbsent || !doctorReview || isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 text-center bg-slate-50/50">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-left -mt-60">
          {isGenerating ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-blue-100/70 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                AI Plan Generation Active
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Generating your custom plan...
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Your health habits & medical profile have been saved! Our AI is
                preparing your personalized 7-day Exercise roadmap.
              </p>
            </div>
          ) : isProfileSubmitted || !isPlanAbsent ? (
            <>
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5">
                <AlertCircle className="w-7 h-7" />
              </div>
              <span className="inline-block px-3.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                🟡 Under Doctor Review
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Your exercise plan is under review
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Our medical experts and personal trainers are reviewing your
                AI-generated workout routine to verify physical safety and
                exercise suitability. Your plan will be unlocked as soon as
                approved by your doctor.
              </p>

              {/* Summary of submitted profile */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                {healthProfile?.lifestyle_habits && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Lifestyle & Routine:
                    </span>{" "}
                    {healthProfile.lifestyle_habits}
                  </div>
                )}
                {healthProfile?.medical_issues && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Medical / Injuries:
                    </span>{" "}
                    {healthProfile.medical_issues}
                  </div>
                )}
                {healthProfile?.food_habits && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Food Habits:
                    </span>{" "}
                    {healthProfile.food_habits}
                  </div>
                )}
                {healthProfile?.allergies && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Allergies:
                    </span>{" "}
                    {healthProfile.allergies}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow-xs"
              >
                <Edit3 className="w-4 h-4" />
                Update Habits & Regenerate Plan
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
                <ClipboardList className="w-7 h-7" />
              </div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                Action Required
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Fill in your routine & medical details
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                To help your fitness coach create a safe and effective training
                program, please share your lifestyle habits, injuries or medical
                issues, food habits, and allergies.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow-xs"
              >
                <HeartPulse className="w-4 h-4" />
                Fill Health & Routine Form
              </button>
            </>
          )}
        </div>

        <HealthProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={(res: any) => {
            if (res.isGenerating) setIsGenerating(true);
            if (res.exercise_plan) {
              setExercisePlan(res.exercise_plan);
              setIsGenerating(false);
            }
            if (res.health_profile) setHealthProfile(res.health_profile);
            if (res.doctor_review !== undefined)
              setDoctorReview(res.doctor_review);
          }}
          initialData={healthProfile}
          userId={userId}
        />
      </div>
    );
  }

  const todayPlan = exercisePlan[selectedDay];
  const isToday = selectedDay === getToday();

  return (
    <PremiumGate featureName="The Exercise Plan">
      <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Activity className="w-7 h-7 text-blue-500" strokeWidth={2} />
              Your training
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Push your limits, track your progress.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-medium text-sm text-slate-700 flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-4 h-4 text-blue-500" />
              My Health Profile
            </button>
            {doctorReview ? (
              <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-semibold text-xs border border-emerald-200">
                🟢 Doctor Approved
              </div>
            ) : (
              <div className="px-3.5 py-1.5 bg-amber-50 text-amber-800 rounded-lg font-semibold text-xs border border-amber-200">
                🟡 Under Doctor Review
              </div>
            )}
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex overflow-x-auto pb-3 mb-6 gap-2 scrollbar-hide snap-x">
          {daysOfWeek.map((day) => {
            const dayIsToday = day === getToday();
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative snap-start shrink-0 px-5 py-2.5 rounded-xl font-semibold text-md transition-colors duration-200 ${
                  selectedDay === day
                    ? "text-black border-2 border-blue-500"
                    : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-slate-200"
                }`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
                {dayIsToday && (
                  <span
                    className={`absolute  -right-1 w-2 h-2 rounded-full ${
                      selectedDay === day ? "bg-blue-400" : "bg-blue-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Daily Overview Card */}
        {todayPlan && (
          <div className="inline-block w-fit bg-blue-600 rounded-2xl p-6 md:p-7 mb-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-blue-100 font-medium mb-1.5">
                <CalendarHeart className="w-4 h-4" />
                <span className="uppercase tracking-wide text-xs whitespace-nowrap">
                  {isToday ? "Today's focus" : `${selectedDay}'s focus`}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-5 whitespace-nowrap">
                {todayPlan.type || "Rest day"}
              </h2>

              <div className="flex flex-wrap gap-3">
                {todayPlan.duration_minutes !== undefined && (
                  <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap">
                    <Timer className="w-4 h-4 text-blue-200" />
                    {todayPlan.duration_minutes} mins
                  </div>
                )}
                {todayPlan.exercises && todayPlan.exercises.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap">
                    <Flame className="w-4 h-4 text-orange-200" />
                    {todayPlan.exercises.length} exercises
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-3">
          {todayPlan?.exercises && todayPlan.exercises.length > 0 ? (
            todayPlan.exercises.map((exercise: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 md:p-5 border border-blue-400 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-0.5">
                      {exercise.name}
                    </h3>
                    {exercise.notes && (
                      <p className="text-md text-slate-500">{exercise.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-5 bg-slate-50 rounded-lg p-3 self-start md:self-auto w-full md:w-auto">
                  {exercise.sets && (
                    <div className="text-center px-2">
                      <p className="text-sm uppercase font-medium  tracking-wide">
                        Sets
                      </p>
                      <p className="font-semibold text-slate-700 text-md">
                        {exercise.sets}
                      </p>
                    </div>
                  )}
                  {exercise.reps && (
                    <>
                      <div className="w-px h-7 bg-slate-200"></div>
                      <div className="text-center px-2">
                        <p className="text-sm uppercase font-medium  tracking-wide">
                          Reps
                        </p>
                        <p className="font-semibold text-slate-700 text-md">
                          {exercise.reps}
                        </p>
                      </div>
                    </>
                  )}
                  {exercise.duration && (
                    <>
                      <div className="w-px h-7 bg-slate-200"></div>
                      <div className="text-center px-2">
                        <p className="text-sm uppercase font-medium  tracking-wide">
                          Time
                        </p>
                        <p className="font-semibold text-slate-700 text-md">
                          {exercise.duration}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-500 text-sm">
                No exercises scheduled for this day.
              </p>
            </div>
          )}
        </div>
      </div>
      <HealthProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(res: any) => {
          if (res.exercise_plan) setExercisePlan(res.exercise_plan);
          if (res.health_profile) setHealthProfile(res.health_profile);
          if (res.doctor_review !== undefined)
            setDoctorReview(res.doctor_review);
        }}
        initialData={healthProfile}
        userId={userId}
      />
    </PremiumGate>
  );
}
