"use client";

import { motion } from "framer-motion";
import { Lock, Check, Crown, Flag, Star } from "lucide-react";
import type { LevelSeed } from "@/data/journey_seed";
import type { RequirementResult } from "@/lib/evaluateRequirement";
import { useState } from "react";

export type NodeState = "locked" | "active" | "completed" | "boss" | "checkpoint";

interface LevelNodeProps {
  level: LevelSeed;
  state: NodeState;
  position: { x: number; y: number };
  progress?: RequirementResult;
  worldColor: string;
  onClick?: () => void;
  index: number;
}

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

function getProgressDetails(level: LevelSeed, progress?: RequirementResult) {
  if (!progress) {
    return {
      text: level.requirement.description,
      formattedValue: "",
      percent: 0,
    };
  }

  const { current, target, progress: pct } = progress;
  const metric = level.requirement.metric;
  const days = level.requirement.days;
  const percent = Math.min(100, Math.round(pct * 100));

  if (days && days > 1) {
    return {
      text: `${current} of ${days} days done`,
      formattedValue: `${current}/${days} days`,
      percent,
    };
  }

  if (metric === "steps") {
    const currStr = current >= 1000 ? `${(current / 1000).toFixed(1)}k` : `${current}`;
    const targStr = target >= 1000 ? `${(target / 1000).toFixed(1)}k` : `${target}`;
    return {
      text: `${currStr} / ${targStr} steps`,
      formattedValue: `${currStr}/${targStr}`,
      percent,
    };
  }

  if (metric === "water_ml") {
    return {
      text: `${current}L / ${target}L water`,
      formattedValue: `${current}/${target}L`,
      percent,
    };
  }

  if (metric === "sleep_quality" || metric === "sleep") {
    return {
      text: `${current}h / ${target}h sleep`,
      formattedValue: `${current}/${target}h`,
      percent,
    };
  }

  if (metric === "meals") {
    return {
      text: `${current} / ${target} meals`,
      formattedValue: `${current}/${target}`,
      percent,
    };
  }

  if (metric === "habit") {
    return {
      text: `${current} / ${target} habits`,
      formattedValue: `${current}/${target}`,
      percent,
    };
  }

  if (metric === "streak") {
    return {
      text: `${current} / ${target} day streak`,
      formattedValue: `${current}/${target}d`,
      percent,
    };
  }

  if (metric === "xp_total") {
    return {
      text: `${current} / ${target} XP`,
      formattedValue: `${current}/${target} XP`,
      percent,
    };
  }

  return {
    text: `${current} / ${target} completed`,
    formattedValue: `${current}/${target}`,
    percent,
  };
}

export default function LevelNode({
  level,
  state,
  position,
  progress,
  worldColor,
  onClick,
  index,
}: LevelNodeProps) {
  const [shaking, setShaking] = useState(false);

  const isBoss = level.type === "boss";
  const isCheckpoint = level.type === "checkpoint";
  const size = isBoss ? 72 : isCheckpoint ? 64 : 56;
  const cardWidth = 180;

  const handleClick = () => {
    if (state === "locked") {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    onClick?.();
  };

  const progressInfo = getProgressDetails(level, progress);

  // Progress ring for active levels
  const circumference = Math.PI * (size - 8);
  const progressOffset = progress
    ? circumference * (1 - progress.progress)
    : circumference;

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{
        left: position.x - cardWidth / 2,
        top: position.y - size / 2,
        width: cardWidth,
        zIndex: state === "active" || isBoss ? 20 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.03,
      }}
      layoutId={`level-node-${level.id}`}
    >
      {/* Crown for boss levels */}
      {isBoss && state !== "locked" && (
        <motion.div
          className="journey-crown absolute -top-5 z-30"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.03 + 0.3 }}
        >
          <Crown className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
        </motion.div>
      )}

      {/* Node Button */}
      <button
        onClick={handleClick}
        className={`
          relative flex items-center justify-center rounded-full border-[3px] transition-all duration-300 cursor-pointer shrink-0
          ${shaking ? "journey-node-shake" : ""}
          ${state === "locked"
            ? "bg-slate-100 border-slate-300 journey-node-locked shadow-xs"
            : state === "active"
              ? `border-[${worldColor}] journey-node-active bg-white`
              : state === "completed"
                ? "border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-100"
                : `border-[${worldColor}] bg-white`
          }
        `}
        style={{
          width: size,
          height: size,
          ...(state === "active"
            ? {
                borderColor: worldColor,
                background: `radial-gradient(circle at center, ${worldColor}22, ${worldColor}08)`,
                boxShadow: `0 0 20px ${worldColor}40, 0 0 40px ${worldColor}20`,
                "--glow-color": worldColor
                  .replace("#", "")
                  .match(/.{2}/g)
                  ?.map((x) => parseInt(x, 16))
                  .join(", "),
              } as any
            : state === "completed"
              ? {
                  borderColor: "#fbbf24",
                  boxShadow: "0 0 12px rgba(251, 191, 36, 0.3)",
                }
              : {}),
        }}
        aria-label={`Level ${level.order_index}: ${level.title}`}
      >
        {/* Progress ring for active levels */}
        {state === "active" && progress && (
          <svg
            className="journey-progress-ring absolute inset-0"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={(size - 8) / 2}
              fill="none"
              stroke={`${worldColor}30`}
              strokeWidth="3"
            />
            <circle
              className="progress"
              cx={size / 2}
              cy={size / 2}
              r={(size - 8) / 2}
              fill="none"
              stroke={worldColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              style={
                {
                  "--circumference": circumference,
                  "--dash-offset": progressOffset,
                } as any
              }
            />
          </svg>
        )}

        {/* Icon */}
        <span className="relative z-10">
          {state === "locked" ? (
            <Lock className="w-5 h-5 text-slate-600" />
          ) : state === "completed" ? (
            <div className="relative">
              <Check className="w-6 h-6 text-yellow-400" strokeWidth={3} />
              {/* Sparkle effects */}
              <span className="journey-sparkle absolute -top-1 -right-1 text-[8px]">✨</span>
            </div>
          ) : (
            <span className="text-xl">{TYPE_ICONS[level.type] || level.icon}</span>
          )}
        </span>
      </button>

      {/* Level number badge */}
      <div
        className={`
          absolute top-0 right-10 z-20 flex items-center justify-center
          rounded-full text-xs font-extrabold min-w-[22px] h-5.5 px-1 shadow-xs
          ${state === "completed"
            ? "bg-amber-500 text-white"
            : state === "active"
              ? "text-white"
              : "bg-white text-slate-700 border border-slate-300 shadow-xs"
          }
        `}
        style={
          state === "active"
            ? { backgroundColor: worldColor, color: "#fff" }
            : {}
        }
      >
        {level.order_index}
      </div>

      {/* XP reward badge (for active/unlocked nodes) */}
      {state !== "locked" && (
        <motion.div
          className="absolute top-0 left-10 z-20 flex items-center gap-1 bg-white/95 rounded-full px-2 py-0.5 border border-amber-300 shadow-xs"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.03 + 0.2 }}
        >
          <Star className="w-3 h-3 text-amber-500" fill="#f59e0b" />
          <span className="text-[10px] font-bold text-amber-800">
            {level.xp_reward}
          </span>
        </motion.div>
      )}

      {/* ACTIVE LEVEL: Next Action + Progress Callout Card */}
      {state === "active" && (
        <motion.div
          className="mt-2 w-[185px] flex flex-col items-center bg-white/95 backdrop-blur-md rounded-xl p-2.5 border text-center shadow-xl cursor-pointer"
          style={{
            borderColor: `${worldColor}70`,
            boxShadow: `0 8px 24px ${worldColor}25, 0 2px 8px rgba(0,0,0,0.06)`,
          }}
          onClick={handleClick}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 + 0.2 }}
        >
          {/* Active indicator */}
          <div className="flex items-center gap-1 mb-1">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: worldColor }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-wider"
              style={{ color: worldColor }}
            >
              NEXT ACTION
            </span>
          </div>

          {/* Level title */}
          <p className="text-xs font-black text-slate-900 leading-tight mb-0.5">
            {level.title}
          </p>

          {/* Requirement instruction */}
          <p className="text-[11px] text-slate-700 font-bold leading-tight mb-1.5">
            {level.requirement.description}
          </p>

          {/* Progress Bar & Text */}
          {progress && (
            <div className="w-full bg-slate-50 rounded-lg p-1.5 border border-slate-200/80">
              <div className="flex items-center justify-between text-[10px] font-extrabold mb-1 px-0.5">
                <span className="text-slate-600">Progress</span>
                <span style={{ color: worldColor }}>{progressInfo.text}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressInfo.percent}%`,
                    backgroundColor: worldColor,
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* COMPLETED LEVEL Label */}
      {state === "completed" && (
        <div className="mt-1.5 flex flex-col items-center text-center max-w-[150px]">
          <p className="text-xs font-black text-amber-900 leading-tight">
            {level.title}
          </p>
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
            ✓ Done (+{level.xp_reward} XP)
          </span>
        </div>
      )}

      {/* LOCKED LEVEL Label */}
      {state === "locked" && (
        <div className="mt-1.5 flex flex-col items-center text-center max-w-[140px] opacity-85">
          <p className="text-xs font-bold text-slate-700 truncate w-full">
            {level.title}
          </p>
          <p className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-1">
            {level.requirement.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}
