"use client";

import { PremiumGate } from "@/components/PremiumGate";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Fraunces, Inter } from "next/font/google";
import {
  Coffee,
  Moon,
  Sun,
  Sunrise,
  Utensils,
  AlertCircle,
  Apple,
} from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function DietPlanPage() {
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Default to today's actual day, but the user can still browse other days.
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const [selectedDay, setSelectedDay] = useState<string>(today);

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
          .select("diet_plan")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;
        setDietPlan(data?.diet_plan || {});
      } catch (err: any) {
        console.error(err);
        setError("Could not load diet plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  // --- Meal metadata: icon, color and a typical time-of-day, so the
  // list reads as a timeline through the day rather than a flat grid.
  const mealMeta: Record<
    string,
    {
      icon: React.ReactNode;
      time: string;
      dot: string;
      ring: string;
      chip: string;
    }
  > = {
    breakfast: {
      icon: <Sunrise className="w-[18px] h-[18px]" />,
      time: "7:30 AM",
      dot: "#F2A340",
      ring: "rgba(242,163,64,0.25)",
      chip: "bg-[#FDF2E1] text-[#8A5A12]",
    },
    lunch: {
      icon: <Sun className="w-[18px] h-[18px]" />,
      time: "1:00 PM",
      dot: "#E8604C",
      ring: "rgba(232,96,76,0.22)",
      chip: "bg-[#FCE7E3] text-[#96331F]",
    },
    snacks: {
      icon: <Coffee className="w-[18px] h-[18px]" />,
      time: "4:30 PM",
      dot: "#7C9070",
      ring: "rgba(124,144,112,0.22)",
      chip: "bg-[#EAEFE4] text-[#41522E]",
    },
    dinner: {
      icon: <Moon className="w-[18px] h-[18px]" />,
      time: "8:00 PM",
      dot: "#0B6B54",
      ring: "rgba(11,107,84,0.2)",
      chip: "bg-[#E1EFEA] text-[#0B6B54]",
    },
  };

  const mealOrder = ["breakfast", "lunch", "snacks", "dinner"];

  if (loading) {
    return (
      <div
        className={`${inter.variable} flex h-full items-center justify-center p-6 bg-[#F8F6F1]`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#0E8F6E] border-t-transparent rounded-full animate-spin" />
          <p className="font-[var(--font-body)] text-sm text-[#8A8577]">
            Loading your plan…
          </p>
        </div>
      </div>
    );
  }

  if (error || !dietPlan || Object.keys(dietPlan).length === 0) {
    return (
      <div
        className={`${fraunces.variable} ${inter.variable} flex flex-col items-center justify-center h-full p-6 text-center bg-[#F8F6F1]`}
      >
        <div className="w-16 h-16 bg-[#E1EFEA] text-[#0B6B54] rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-semibold text-[#1C2B22] mb-2">
          No diet plan yet
        </h2>
        <p className="font-[var(--font-body)] text-[#71766B] max-w-md leading-relaxed">
          You don't have a personalized diet plan assigned yet. Reach out to
          your consultant and they'll set one up with you.
        </p>
      </div>
    );
  }

  const todayPlan = dietPlan[selectedDay] || {};
  const mealsToday = mealOrder.filter((m) => todayPlan[m]);

  return (
    <PremiumGate featureName="The Diet Plan">
      <div
        className={`${fraunces.variable} ${inter.variable} min-h-full  font-(--font-body)`}
      >
        <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-3xl font-semibold tracking-[0.14em] uppercase text-[#0B6B54] mb-2">
              <Apple className="w-7   h-7" />
              Nutrition plan
            </span>
            <h1 className=" italic text-xs md:text-[2.75rem] font-semibold text-[#1C2B22] tracking-tight leading-none">
              Your day, mapped out
            </h1>
            <p className="text-[#8A8577] mt-3 text-md">
              Follow the timeline below — each stop is a meal for{" "}
              {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}.
            </p>
          </div>
          <div className="px-4 py-2 bg-white border border-[#E7E2D8] rounded-full text-xs font-semibold text-[#0B6B54] tracking-wide shadow-[0_1px_2px_rgba(28,43,34,0.04)]">
            ● Active plan
          </div>
        </div>

        {/* Day selector — ticket-strip style, defaults to today but browsable */}
        <div className="flex overflow-x-auto pb-1 mb-10 gap-1.5 scrollbar-hide border-b border-dashed border-[#E7E2D8]">
          {daysOfWeek.map((day) => {
            const active = selectedDay === day;
            const isToday = day === today;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative shrink-0 px-4 sm:px-5 py-3 text-md font-semibold transition-colors ${
                  active
                    ? "text-[#1C2B22]"
                    : "text-[#A8A398] hover:text-[#5C594F]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {day.slice(0, 3).charAt(0).toUpperCase() + day.slice(1, 3)}
                  {isToday && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#0E8F6E]"
                      aria-label="Today"
                    />
                  )}
                </span>
                {active && (
                  <span className="absolute left-3 right-3 -bottom-[1px] h-[2.5px] bg-[#0E8F6E] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        {mealsToday.length > 0 ? (
          <div className="relative pl-[52px] sm:pl-16">
            {/* spine */}
            <div className="absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-px bg-[#E7E2D8]" />

            <div className="flex flex-col gap-8">
              {mealsToday.map((mealType, i) => {
                const meta = mealMeta[mealType];

                const mealData = todayPlan[mealType];
                const mealText =
                  typeof mealData === "object" && mealData !== null
                    ? mealData.meal
                    : mealData;
                const mealImage =
                  typeof mealData === "object" && mealData !== null
                    ? mealData.image
                    : todayPlan[`${mealType}_image`];

                return (
                  <div key={mealType} className="relative">
                    {/* node */}
                    <div
                      className="absolute -left-[52px] sm:-left-16 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-[#F8F6F1]"
                      style={{ backgroundColor: meta.ring }}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{ color: meta.dot }}
                      >
                        {meta.icon}
                      </div>
                    </div>

                    {/* card */}
                    <div className="bg-white rounded-2xl border border-[#EDE9DE] overflow-hidden shadow-[0_1px_3px_rgba(28,43,34,0.05)] hover:shadow-[0_6px_20px_rgba(28,43,34,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                      {/* {mealImage && (
                        <div className="w-full h-48 bg-[#F8F6F1] overflow-hidden border-b border-[#EDE9DE]">
                          <img
                            src={mealImage}
                            alt={mealType}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )} */}
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-2.5">
                          <h3 className="font-[var(--font-display)] text-lg font-semibold text-[#1C2B22] capitalize">
                            {mealType}
                          </h3>
                          <span
                            className={`text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full ${meta.chip}`}
                          >
                            {meta.time}
                          </span>
                        </div>
                        <p className="text-[#5C594F] leading-relaxed text-[15px]">
                          {mealText}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-[#E7E2D8] rounded-2xl p-12 text-center">
            <Utensils className="w-6 h-6 text-[#A8A398] mx-auto mb-3" />
            <p className="text-[#8A8577] font-medium">
              Nothing scheduled for this day yet.
            </p>
          </div>
        )}
      </div>
    </div>
    </PremiumGate>
  );
}
