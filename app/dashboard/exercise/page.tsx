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
} from "lucide-react";

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

        const { data, error } = await supabase
          .from("user_plans")
          .select("exercise_plan")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;
        setExercisePlan(data?.exercise_plan || {});
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

  if (error || !exercisePlan || Object.keys(exercisePlan).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          No exercise plan found
        </h2>
        <p className="text-slate-500 max-w-md text-sm">
          It looks like you don't have a personalized exercise plan assigned
          yet. Please contact your trainer.
        </p>
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
        <div className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm border border-blue-100">
          Active plan
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
    </PremiumGate>
  );
}
