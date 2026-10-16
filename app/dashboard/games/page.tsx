"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { WORLDS, LEVELS } from "@/data/journey_seed";
import {
  checkUnlocks,
  checkUnlocksAll,
  getAllLevelProgress,
  createInitialProgress,
  type UserProgress,
} from "@/lib/checkUnlocks";
import type { UserTrackingData } from "@/lib/evaluateRequirement";
import type { LevelSeed } from "@/data/journey_seed";
import JourneyMap from "@/components/games/JourneyMap";
import LevelDetailSheet from "@/components/games/LevelDetailSheet";
import XPBar from "@/components/games/XPBar";
import CelebrationOverlay from "@/components/games/CelebrationOverlay";
import { Loader2 } from "lucide-react";
import "./journey.css";

export default function GamesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress>(createInitialProgress());
  const [trackingData, setTrackingData] = useState<UserTrackingData>({
    weightHistory: [],
    waterLogs: [],
    stepsLogs: [],
    sleepLogs: [],
    meals: [],
    habitLogs: [],
    totalXp: 0,
  });

  // UI state
  const [selectedLevel, setSelectedLevel] = useState<LevelSeed | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [celebration, setCelebration] = useState<{
    visible: boolean;
    level: LevelSeed | null;
    xp: number;
  }>({ visible: false, level: null, xp: 0 });

  // Container width (responsive)
  const [containerWidth, setContainerWidth] = useState(360);

  useEffect(() => {
    const updateWidth = () => {
      const isDesktop = window.innerWidth >= 768;
      const width = isDesktop
        ? Math.min(window.innerWidth - 300, 1100)
        : Math.min(window.innerWidth - 32, 420);
      setContainerWidth(Math.max(width, 360));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Extract logs from various data formats
  const extractLogsArray = (data: any, keyNames: string[] = []): any[] => {
    if (!data) return [];
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { return []; }
    }
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      for (const key of keyNames) {
        if (Array.isArray(data[key])) return data[key];
      }
      if (Array.isArray(data.logs)) return data.logs;
      if (Array.isArray(data.history)) return data.history;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  };

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const bypass = urlParams.get("bypassAuth") === "true";

      if (bypass) {
        // Evaluate progress dynamically based on logged data
        let mockProgress: UserProgress = {
          current_level_id: 1,
          total_xp: 0,
          unlocked_level_ids: [1],
          completed_level_ids: [],
        };
        const todayStr = new Date().toISOString().split("T")[0];
        const mockTracking: UserTrackingData = {
          weightHistory: [],
          waterLogs: [],
          stepsLogs: [],
          sleepLogs: [],
          meals: [],
          habitLogs: [],
          totalXp: 0,
        };

        const unlockResult = checkUnlocks(mockProgress, mockTracking);
        if (unlockResult.unlocked && unlockResult.newCompletedIds && unlockResult.newUnlockedIds) {
          mockProgress = {
            ...mockProgress,
            total_xp: unlockResult.newTotalXp || mockProgress.total_xp,
            completed_level_ids: unlockResult.newCompletedIds,
            unlocked_level_ids: unlockResult.newUnlockedIds,
          };
          mockTracking.totalXp = mockProgress.total_xp;
        }

        setProgress(mockProgress);
        setTrackingData(mockTracking);
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const userId = session.user.id;

        // Fetch user_plans data
        const { data: userPlan } = await supabase
          .from("user_plans")
          .select("steps_history, water_history, sleep_history, measurement_history")
          .eq("user_id", userId)
          .maybeSingle();

        // Fetch weight_loss_journey from users table
        const { data: userData } = await supabase
          .from("users")
          .select("weight_loss_journey")
          .eq("id", userId)
          .maybeSingle();

        const journey = (userData?.weight_loss_journey || {}) as any;

        // Build tracking data from existing tables
        const stepsLogs = extractLogsArray(userPlan?.steps_history, ["stepsLogs", "steps_history"]);
        const waterLogs = extractLogsArray(userPlan?.water_history, ["waterLogs", "water_history"]);
        const sleepLogs = extractLogsArray(userPlan?.sleep_history, ["sleepLogs", "sleep_history"]);
        const weightHistory = Array.isArray(journey.history) ? journey.history : [];
        const meals = Array.isArray(journey.meals) ? journey.meals : [];
        const habitLogs = Array.isArray(journey.habitLogs) ? journey.habitLogs : [];

        // Merge water/sleep from both sources
        const journeyWater = extractLogsArray(journey.waterLogs, ["waterLogs"]);
        const journeySleep = extractLogsArray(journey.sleepLogs, ["sleepLogs"]);

        const mergedWater = mergeByDate(waterLogs, journeyWater);
        const mergedSleep = mergeByDate(sleepLogs, journeySleep);

        // Try to fetch existing progress
        let userProgress: UserProgress;
        try {
          const { data: progressData } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

          if (progressData) {
            userProgress = {
              current_level_id: progressData.current_level_id || 1,
              total_xp: progressData.total_xp || 0,
              unlocked_level_ids: progressData.unlocked_level_ids || [1],
              completed_level_ids: progressData.completed_level_ids || [],
            };
          } else {
            userProgress = createInitialProgress();
          }
        } catch {
          // Table might not exist yet — use initial progress
          userProgress = createInitialProgress();
        }

        const trackData: UserTrackingData = {
          weightHistory,
          waterLogs: mergedWater,
          stepsLogs,
          sleepLogs: mergedSleep,
          meals,
          habitLogs,
          totalXp: userProgress.total_xp,
        };

        // Sync progress on page load: evaluate ALL logged data against level requirements.
        // This restores progress when Supabase state is behind (e.g. first load, reset, or stale).
        // Uses sequential logic — stops the moment the active level's requirement is NOT met.
        const unlockResult = checkUnlocksAll(userProgress, trackData);

        if (unlockResult.unlocked && unlockResult.newCompletedIds && unlockResult.newUnlockedIds) {
          userProgress = {
            ...userProgress,
            total_xp: unlockResult.newTotalXp ?? userProgress.total_xp,
            completed_level_ids: unlockResult.newCompletedIds,
            unlocked_level_ids: unlockResult.newUnlockedIds,
            current_level_id: unlockResult.newUnlockedIds[unlockResult.newUnlockedIds.length - 1] || 1,
          };
          trackData.totalXp = userProgress.total_xp;

          // Persist the restored progress to Supabase
          try {
            const payload = {
              user_id: userId,
              current_level_id: userProgress.current_level_id,
              total_xp: userProgress.total_xp,
              unlocked_level_ids: userProgress.unlocked_level_ids,
              completed_level_ids: userProgress.completed_level_ids,
              updated_at: new Date().toISOString(),
            };
            const { error: saveErr } = await supabase.from("user_progress").upsert(
              payload,
              { onConflict: "user_id" }
            );
            if (saveErr) {
              console.error("Failed to save restored progress:", saveErr);
              if (saveErr.code === "23503") {
                await supabase.from("user_progress").upsert(
                  { ...payload, current_level_id: null },
                  { onConflict: "user_id" }
                );
              }
            }
          } catch (err) {
            console.error("Failed to save restored progress:", err);
          }
        } else {
          // No new unlocks, but fix unlocked_level_ids integrity from completed_level_ids
          const completedIds = userProgress.completed_level_ids;
          let maxOrder = 0;
          completedIds.forEach((id: number) => {
            const lvl = LEVELS.find((l) => l.id === id);
            if (lvl && lvl.order_index > maxOrder) maxOrder = lvl.order_index;
          });
          const correctUnlocked = LEVELS.filter((l) => l.order_index <= maxOrder + 1).map((l) => l.id);
          userProgress = {
            ...userProgress,
            unlocked_level_ids: correctUnlocked.length > 0 ? correctUnlocked : [1],
          };
        }

        setProgress(userProgress);
        setTrackingData(trackData);
      } catch (error) {
        console.error("Error loading journey data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Merge logs by date (primary wins)
  function mergeByDate<T extends { date: string }>(primary: T[], fallback: T[]): T[] {
    const map = new Map<string, T>();
    fallback.forEach((item) => {
      if (item?.date) {
        const key = item.date.includes("T") ? item.date.split("T")[0] : item.date;
        map.set(key, item);
      }
    });
    primary.forEach((item) => {
      if (item?.date) {
        const key = item.date.includes("T") ? item.date.split("T")[0] : item.date;
        map.set(key, item);
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Compute all level progress
  const levelProgress = useMemo(
    () => getAllLevelProgress(progress, trackingData),
    [progress, trackingData]
  );

  // Current world (based on active level)
  const currentWorld = useMemo(() => {
    const activeIds = progress.unlocked_level_ids.filter(
      (id) => !progress.completed_level_ids.includes(id)
    );
    const activeId = activeIds[0] || progress.unlocked_level_ids[progress.unlocked_level_ids.length - 1] || 1;
    const activeLevel = LEVELS.find((l) => l.id === activeId);
    return WORLDS.find((w) => w.id === (activeLevel?.world_id || 1)) || WORLDS[0];
  }, [progress]);

  // Next XP milestone
  const nextMilestoneXp = useMemo(() => {
    const milestones = [85, 300, 600, 1000, 1500, 2000, 3000];
    return milestones.find((m) => m > progress.total_xp) || milestones[milestones.length - 1];
  }, [progress.total_xp]);

  const handleLevelClick = useCallback((level: LevelSeed) => {
    setSelectedLevel(level);
    setIsSheetOpen(true);
  }, []);

  const handleDismissCelebration = useCallback(() => {
    setCelebration({ visible: false, level: null, xp: 0 });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
      {/* XP Bar */}
      <XPBar
        totalXp={progress.total_xp}
        nextMilestoneXp={nextMilestoneXp}
        currentWorld={currentWorld}
        completedCount={progress.completed_level_ids.length}
        totalLevels={LEVELS.length}
      />

      {/* Journey Map */}
      <JourneyMap
        levels={LEVELS}
        worlds={WORLDS}
        progress={progress}
        levelProgress={levelProgress}
        onLevelClick={handleLevelClick}
        containerWidth={containerWidth}
      />

      {/* Level Detail Sheet */}
      <LevelDetailSheet
        level={selectedLevel}
        progress={selectedLevel ? levelProgress.get(selectedLevel.id) || null : null}
        worldColor={
          selectedLevel
            ? WORLDS.find((w) => w.id === selectedLevel.world_id)?.theme_color || "#3b82f6"
            : "#3b82f6"
        }
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        isCompleted={
          selectedLevel
            ? progress.completed_level_ids.includes(selectedLevel.id)
            : false
        }
      />

      {/* Celebration Overlay */}
      <CelebrationOverlay
        isVisible={celebration.visible}
        level={celebration.level}
        xpGained={celebration.xp}
        onDismiss={handleDismissCelebration}
      />
    </div>
  );
}
