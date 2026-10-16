"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import LevelNode, { type NodeState } from "./LevelNode";
import type { LevelSeed, WorldSeed } from "@/data/journey_seed";
import type { UserProgress } from "@/lib/checkUnlocks";
import type { RequirementResult } from "@/lib/evaluateRequirement";
import {
  generatePath,
  generateSmoothSVGPath,
  getPathHeight,
} from "@/lib/generatePath";

interface JourneyMapProps {
  levels: LevelSeed[];
  worlds: WorldSeed[];
  progress: UserProgress;
  levelProgress: Map<number, RequirementResult>;
  onLevelClick: (level: LevelSeed) => void;
  containerWidth?: number;
}

export default function JourneyMap({
  levels,
  worlds,
  progress,
  levelProgress,
  onLevelClick,
  containerWidth = 360,
}: JourneyMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Generate path positions
  const pathPoints = useMemo(
    () =>
      generatePath(levels.length, containerWidth, {
        amplitude: Math.min(containerWidth * 0.32, 320),
        verticalGap: containerWidth > 600 ? 170 : 150,
        startY: 90,
        frequency: 0.85,
      }),
    [levels.length, containerWidth]
  );

  const svgPath = useMemo(
    () => generateSmoothSVGPath(pathPoints),
    [pathPoints]
  );

  const totalHeight = useMemo(
    () => getPathHeight(pathPoints, 120),
    [pathPoints]
  );

  // Scroll to active node on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeNodeRef.current) {
        activeNodeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Get the first active (unlocked but not completed) level
  const activeLevelId = useMemo(() => {
    const unlocked = progress.unlocked_level_ids || [];
    const completed = progress.completed_level_ids || [];
    const active = unlocked.find((id) => !completed.includes(id));
    return active || unlocked[unlocked.length - 1] || 1;
  }, [progress]);

  // Determine the completed path length for the SVG
  const completedLevels = progress.completed_level_ids?.length || 0;
  const completedRatio = levels.length > 0 ? completedLevels / levels.length : 0;

  // Get node state (strict linear progression: completed, active, or locked)
  const getNodeState = (level: LevelSeed): NodeState => {
    if (progress.completed_level_ids?.includes(level.id)) return "completed";
    if (level.id === activeLevelId) return "active";
    return "locked";
  };

  // Get world for a level
  const getWorld = (level: LevelSeed): WorldSeed => {
    return worlds.find((w) => w.id === level.world_id) || worlds[0];
  };

  // World divider positions
  const worldDividers = useMemo(() => {
    const dividers: { worldIndex: number; world: WorldSeed; y: number }[] = [];
    let currentWorldId = -1;

    levels.forEach((level, i) => {
      if (level.world_id !== currentWorldId) {
        currentWorldId = level.world_id;
        const world = worlds.find((w) => w.id === level.world_id);
        if (world && pathPoints[i]) {
          dividers.push({
            worldIndex: i,
            world,
            y: pathPoints[i].y - 55,
          });
        }
      }
    });

    return dividers;
  }, [levels, worlds, pathPoints]);

  return (
    <div
      ref={scrollRef}
      className="journey-scroll relative w-full overflow-y-auto overflow-x-hidden flex-1 bg-slate-50"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative ambient dots */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-slate-400/25 journey-float"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Clouds/nebula blobs per world */}
        {worldDividers.map((divider) => (
          <div
            key={`cloud-${divider.worldIndex}`}
            className="absolute rounded-full blur-3xl journey-float-slow opacity-[0.14]"
            style={{
              width: 300,
              height: 300,
              left: `${20 + Math.random() * 40}%`,
              top: divider.y,
              backgroundColor: divider.world.theme_color,
              animationDelay: `${divider.worldIndex * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div
        className="relative mx-auto"
        style={{
          width: containerWidth,
          height: totalHeight,
          minHeight: "100%",
        }}
      >
        {/* SVG Path */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={containerWidth}
          height={totalHeight}
          viewBox={`0 0 ${containerWidth} ${totalHeight}`}
          fill="none"
        >
          {/* Background path (full, dimmed) */}
          <path
            d={svgPath}
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="8 6"
            opacity="0.6"
          />

          {/* Completed path (solid colored progress line) */}
          <path
            d={svgPath}
            stroke="url(#pathGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="1"
            pathLength="1"
            strokeDashoffset={1 - completedRatio}
            style={{
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />

          {/* Gradient for completed path */}
          <defs>
            <linearGradient
              id="pathGradient"
              x1="0"
              y1="0"
              x2="0"
              y2={totalHeight}
            >
              {worlds.map((world, i) => (
                <stop
                  key={world.id}
                  offset={`${(i / (worlds.length - 1)) * 100}%`}
                  stopColor={world.theme_color}
                />
              ))}
            </linearGradient>
          </defs>
        </svg>

        {/* World Dividers */}
        {worldDividers.map((divider) => (
          <motion.div
            key={`divider-${divider.worldIndex}`}
            className="absolute left-0 right-0 flex items-center justify-center z-30"
            style={{ top: divider.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm border"
              style={{
                background: `${divider.world.theme_color}15`,
                borderColor: `${divider.world.theme_color}30`,
              }}
            >
              <span className="text-sm">{divider.world.icon}</span>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: divider.world.theme_color }}
              >
                {divider.world.name}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Level Nodes */}
        {levels.map((level, index) => {
          const point = pathPoints[index];
          if (!point) return null;

          const state = getNodeState(level);
          const world = getWorld(level);
          const levelProg = levelProgress.get(level.id) || null;
          const isActive = level.id === activeLevelId;

          return (
            <div
              key={level.id}
              ref={isActive ? activeNodeRef : undefined}
            >
              <LevelNode
                level={level}
                state={state}
                position={{ x: point.x, y: point.y }}
                progress={levelProg ?? undefined}
                worldColor={world.theme_color}
                onClick={() => onLevelClick(level)}
                index={index}
              />
            </div>
          );
        })}

        {/* Finish flag at the end */}
        {pathPoints.length > 0 && (
          <motion.div
            className="absolute flex flex-col items-center z-30"
            style={{
              left: pathPoints[pathPoints.length - 1].x - 30,
              top: pathPoints[pathPoints.length - 1].y + 80,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-3xl mb-1">🏰</div>
            <p className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest">
              Victory
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
