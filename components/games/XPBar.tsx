"use client";

import { motion } from "framer-motion";
import { Star, Zap, Trophy } from "lucide-react";
import type { WorldSeed } from "@/data/journey_seed";

interface XPBarProps {
  totalXp: number;
  nextMilestoneXp: number;
  currentWorld: WorldSeed | null;
  completedCount: number;
  totalLevels: number;
}

export default function XPBar({
  totalXp,
  nextMilestoneXp,
  currentWorld,
  completedCount,
  totalLevels,
}: XPBarProps) {
  const progressPercent =
    nextMilestoneXp > 0 ? Math.min(100, (totalXp / nextMilestoneXp) * 100) : 0;

  return (
    <motion.div
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-xs"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <div className="px-4 py-3">
        {/* Top row: World name + Level count */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {currentWorld && (
              <>
                <span className="text-xl">{currentWorld.icon}</span>
                <h2
                  className="text-base font-black"
                  style={{ color: currentWorld.theme_color }}
                >
                  {currentWorld.name}
                </h2>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Levels completed badge */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-full px-3 py-1 border border-slate-200/80">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-slate-800">
                {completedCount}/{totalLevels}
              </span>
            </div>

            {/* Total XP badge */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 rounded-full px-3 py-1 border border-amber-500/30">
              <Star className="w-4 h-4 text-amber-500" fill="#f59e0b" />
              <motion.span
                className="text-xs font-black text-amber-800"
                key={totalXp}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {totalXp} XP
              </motion.span>
            </div>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="relative h-3 bg-slate-100 border border-slate-200/60 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: currentWorld
                ? `linear-gradient(90deg, ${currentWorld.theme_color}cc, ${currentWorld.theme_color})`
                : "linear-gradient(90deg, #3b82f6cc, #3b82f6)",
              boxShadow: currentWorld
                ? `0 0 8px ${currentWorld.theme_color}40`
                : "0 0 8px #3b82f640",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Sparkle at the end of the bar */}
          {progressPercent > 5 && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-xs"
              animate={{
                left: `${progressPercent}%`,
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ marginLeft: -3 }}
            />
          )}
        </div>

        {/* XP text */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-slate-600 font-bold">
            <Zap className="w-3.5 h-3.5 inline text-amber-500 mr-0.5" />
            Next milestone
          </span>
          <span className="text-xs text-slate-600 font-bold">
            {totalXp}/{nextMilestoneXp} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
}
