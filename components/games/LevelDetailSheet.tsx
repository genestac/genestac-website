"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type { LevelSeed } from "@/data/journey_seed";
import type { RequirementResult } from "@/lib/evaluateRequirement";
import Link from "next/link";

interface LevelDetailSheetProps {
  level: LevelSeed | null;
  progress: RequirementResult | null;
  worldColor: string;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
}

// Map metric types to dashboard routes
const METRIC_ROUTES: Record<string, { href: string; label: string }> = {
  weight_log: { href: "/dashboard", label: "Go to Weight Tracker" },
  water_ml: { href: "/dashboard", label: "Go to Water Tracker" },
  steps: { href: "/dashboard", label: "Go to Steps Tracker" },
  sleep: { href: "/dashboard", label: "Go to Sleep Tracker" },
  sleep_quality: { href: "/dashboard", label: "Go to Sleep Tracker" },
  meals: { href: "/dashboard", label: "Go to Meal Tracker" },
  habit: { href: "/dashboard", label: "Go to Habits" },
  streak: { href: "/dashboard", label: "Go to Dashboard" },
  multi_log: { href: "/dashboard", label: "Go to Dashboard" },
  multi_streak: { href: "/dashboard", label: "Go to Dashboard" },
  xp_total: { href: "/dashboard/games", label: "Keep Going!" },
};

const TYPE_ICONS: Record<string, string> = {
  workout: "🏋️",
  water: "💧",
  nutrition: "🍎",
  steps: "👟",
  weight: "⚖️",
  sleep: "🌙",
  habit: "🌱",
  boss: "👑",
  checkpoint: "🏁",
};

export default function LevelDetailSheet({
  level,
  progress,
  worldColor,
  isOpen,
  onClose,
  isCompleted,
}: LevelDetailSheetProps) {
  if (!level) return null;

  const route = METRIC_ROUTES[level.requirement.metric] || {
    href: "/dashboard",
    label: "Go to Dashboard",
  };

  const progressPercent = progress ? Math.round(progress.progress * 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference * (1 - (progress?.progress || 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet Container */}
          <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center pointer-events-none p-0 md:p-4">
            <motion.div
              className="pointer-events-auto w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl border-t md:border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              layoutId={`level-node-${level.id}`}
            >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            <div className="px-6 pb-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${worldColor}15, ${worldColor}30)`,
                      border: `2px solid ${worldColor}60`,
                    }}
                  >
                    {TYPE_ICONS[level.type] || level.icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Level {level.order_index}
                    </p>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: worldColor }}
                    >
                      {level.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium">
                {level.description}
              </p>

              {/* Progress Circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    className="journey-progress-ring"
                  >
                    {/* Background ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    {/* Progress ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke={isCompleted ? "#f59e0b" : worldColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2
                        className="w-10 h-10 text-amber-500"
                        strokeWidth={2}
                      />
                    ) : (
                      <>
                        <span
                          className="text-2xl font-black"
                          style={{ color: worldColor }}
                        >
                          {progressPercent}%
                        </span>
                        {progress && (
                          <span className="text-xs text-slate-500 font-medium">
                            {progress.current}/{progress.target}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirement */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{
                  background: `linear-gradient(135deg, ${worldColor}08, ${worldColor}15)`,
                  border: `1px solid ${worldColor}30`,
                }}
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Requirement
                </p>
                <p className="text-slate-900 font-bold text-sm">
                  {level.requirement.description}
                </p>
              </div>

              {/* XP Reward */}
              <div className="flex items-center gap-3 bg-amber-500/10 rounded-2xl p-4 mb-6 border border-amber-200">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-500" fill="#f59e0b" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Reward
                  </p>
                  <p className="text-amber-700 font-black text-lg">
                    +{level.xp_reward} XP
                  </p>
                </div>
              </div>

              {/* Days Progress (if multi-day requirement) */}
              {level.requirement.days && level.requirement.days > 1 && progress && (
                <div className="mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
                    Daily Progress
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: level.requirement.days }).map(
                      (_, i) => {
                        const isDone = i < (progress?.current || 0);
                        return (
                          <div
                            key={i}
                            className={`
                              w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
                              ${isDone
                                ? "text-white"
                                : "bg-slate-800 text-slate-600 border border-slate-700"
                              }
                            `}
                            style={
                              isDone
                                ? {
                                    backgroundColor: worldColor,
                                    boxShadow: `0 0 8px ${worldColor}40`,
                                  }
                                : {}
                            }
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {!isCompleted && (
                <Link
                  href={route.href}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${worldColor}, ${worldColor}cc)`,
                    boxShadow: `0 4px 15px ${worldColor}40`,
                  }}
                  onClick={onClose}
                >
                  {route.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {isCompleted && (
                <div className="flex items-center justify-center gap-2 py-3 text-yellow-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  Level Completed!
                </div>
              )}
            </div>
          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>
  );
}
