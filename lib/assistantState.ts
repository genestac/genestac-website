// ============================================================
// Assistant State & Task Helper
// ============================================================

import { LEVELS, type LevelSeed } from "@/data/journey_seed";
import {
  evaluateRequirement,
  type UserTrackingData,
  type RequirementResult,
} from "@/lib/evaluateRequirement";
import { createInitialProgress, type UserProgress } from "@/lib/checkUnlocks";

export interface ActiveTaskDetails {
  level: LevelSeed;
  progressResult: RequirementResult;
  isCompleted: boolean;
  actionRoute: string;
  actionLabel: string;
}

const GREETED_KEY = "genestac_assistant_greeted_v1";
const REMINDER_KEY = "genestac_assistant_last_reminder";
const HOURLY_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export const DATA_LOGGED_EVENT = "genestac:data_logged";

export function notifyDataLogged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DATA_LOGGED_EVENT));
}

export function hasGreetedInSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(GREETED_KEY) === "true";
}

export function markGreetedInSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(GREETED_KEY, "true");
}

export function resetGreetedSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(GREETED_KEY);
}

export function shouldShowHourlyReminder(): boolean {
  if (typeof window === "undefined") return false;
  const lastTimeStr = localStorage.getItem(REMINDER_KEY);
  if (!lastTimeStr) return true;
  const lastTime = parseInt(lastTimeStr, 10);
  if (isNaN(lastTime)) return true;
  return Date.now() - lastTime >= HOURLY_INTERVAL_MS;
}

export function recordReminderShown(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMINDER_KEY, Date.now().toString());
}

function normalizeDateStr(dateStr?: string): string {
  if (!dateStr) return "";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function getTodayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Identify the current active task that the user needs to do next.
 * Evaluates real-time daily routine (weight, time-based meals, water, steps, sleep) first!
 */
export function getActiveTaskInfo(
  progress: UserProgress,
  trackingData: UserTrackingData,
): ActiveTaskDetails | null {
  const today = getTodayStr();

  // 1. Check weight logged today
  const weightLoggedToday = (trackingData.weightHistory || []).some(
    (w) => normalizeDateStr(w.date) === today,
  );

  // 2. Check meals logged today
  const todayMeals = (trackingData.meals || []).filter(
    (m) => normalizeDateStr(m.date) === today,
  );

  const hasBreakfast = todayMeals.some((m) => {
    const type = (m.mealType || "").toLowerCase();
    return type.includes("morning") || type.includes("breakfast");
  });

  const hasLunch = todayMeals.some((m) => {
    const type = (m.mealType || "").toLowerCase();
    return type.includes("lunch");
  });

  const hasSnacks = todayMeals.some((m) => {
    const type = (m.mealType || "").toLowerCase();
    return type.includes("snack");
  });

  const hasDinner = todayMeals.some((m) => {
    const type = (m.mealType || "").toLowerCase();
    return type.includes("dinner");
  });

  // 3. Check water logged today
  const todayWaterLogs = (trackingData.waterLogs || []).filter(
    (w) => normalizeDateStr(w.date) === today,
  );
  const waterToday = todayWaterLogs.reduce(
    (maxVal, l) => Math.max(maxVal, Number(l.amount) || 0),
    0,
  );

  // 4. Check steps logged today
  const todayStepLog = (trackingData.stepsLogs || []).find(
    (s) => normalizeDateStr(s.date) === today,
  );
  const stepsToday = todayStepLog?.steps || 0;

  // 5. Check sleep logged today or yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  const sleepLoggedToday = (trackingData.sleepLogs || []).some(
    (s) =>
      normalizeDateStr(s.date) === today ||
      normalizeDateStr(s.date) === yesterdayStr,
  );

  const currentHour = new Date().getHours();

  // Create a dynamic LevelSeed for smart routine tasks
  const makeDynamicTask = (
    id: number,
    order: number,
    icon: string,
    title: string,
    description: string,
    actionRoute: string,
    actionLabel: string,
  ): ActiveTaskDetails => {
    const level: LevelSeed = {
      id,
      world_id: 1,
      order_index: order,
      title,
      description,
      type: "nutrition",
      icon,
      requirement: { metric: "daily_routine", target: 1, description },
      xp_reward: 10,
    };

    return {
      level,
      progressResult: {
        met: false,
        current: 0,
        target: 1,
        progress: 0,
        description,
      },
      isCompleted: false,
      actionRoute,
      actionLabel,
    };
  };

  // --- SMART ROUTINE TIME-BASED EVALUATION ---

  // Priority A: Daily Weight Log (if weight has not been logged today)
  if (!weightLoggedToday) {
    return makeDynamicTask(
      901,
      1,
      "⚖️",
      "Log Today's Weight",
      "Log your weight for today to update your journey progress.",
      "/dashboard",
      "Log Weight Now",
    );
  }

  // Priority B: Morning / Breakfast (before 11 AM)
  if (currentHour < 11 && !hasBreakfast) {
    return makeDynamicTask(
      902,
      2,
      "🌅",
      "Breakfast Time",
      "Don't forget to have & log your healthy Breakfast (7:30 AM).",
      "/dashboard/diet",
      "Log Breakfast Now",
    );
  }

  // Priority C: Lunch Time Window (11 AM - 3 PM)
  if (currentHour >= 11 && currentHour < 15) {
    if (!hasBreakfast && !hasLunch) {
      return makeDynamicTask(
        903,
        3,
        "⚠️",
        "Skipped Breakfast?",
        "Did you skip Breakfast or forget to log it? Please avoid skipping meals! Also, remember to have your Lunch at 1:00 PM.",
        "/dashboard/diet",
        "Log Meals Now",
      );
    }
    if (!hasLunch) {
      return makeDynamicTask(
        904,
        3,
        "☀️",
        "Lunch Time",
        "Don't forget to have & log your Lunch around 1:00 PM.",
        "/dashboard/diet",
        "Log Lunch Now",
      );
    }
  }

  // Priority D: Afternoon Snacks Window (3 PM - 7 PM)
  if (currentHour >= 15 && currentHour < 19) {
    if (!hasLunch && !hasSnacks) {
      return makeDynamicTask(
        905,
        4,
        "⚠️",
        "Skipped Lunch?",
        "You haven't logged Lunch today. Did you skip it or forget to log? Stay nourished! Also time for your afternoon snack (4:30 PM).",
        "/dashboard/diet",
        "Log Meals Now",
      );
    }
    if (!hasSnacks) {
      return makeDynamicTask(
        906,
        4,
        "☕",
        "Afternoon Snack",
        "Time for a healthy afternoon snack (4:30 PM). Stay energized!",
        "/dashboard/diet",
        "Log Snack Now",
      );
    }
  }

  // Priority E: Dinner Time Window (7 PM - 10 PM)
  if (currentHour >= 19 && currentHour < 22) {
    if (!hasLunch && !hasDinner) {
      return makeDynamicTask(
        907,
        5,
        "⚠️",
        "Missed Previous Meals?",
        "You haven't logged Lunch today. Don't forget to log previous meals and enjoy your Dinner around 8:00 PM.",
        "/dashboard/diet",
        "Log Meals Now",
      );
    }
    if (!hasDinner) {
      return makeDynamicTask(
        908,
        5,
        "🌙",
        "Dinner Time",
        "Don't forget to have & log your Dinner around 8:00 PM.",
        "/dashboard/diet",
        "Log Dinner Now",
      );
    }
  }

  // Priority F: Night & Sleep (10 PM onwards)
  if (currentHour >= 22) {
    if (!hasDinner && !sleepLoggedToday) {
      return makeDynamicTask(
        909,
        6,
        "⚠️",
        "Did You Have Dinner?",
        "Don't forget to log your Dinner before heading to sleep for optimal recovery.",
        "/dashboard/diet",
        "Log Dinner Now",
      );
    }
    if (!sleepLoggedToday) {
      return makeDynamicTask(
        910,
        6,
        "😴",
        "Wind Down & Sleep",
        "Log your sleep duration to track your recovery cycles.",
        "/dashboard",
        "Log Sleep Now",
      );
    }
  }

  // Priority G: Hydration Interstitial Nudge
  if (waterToday < 2.0 && currentHour >= 9 && currentHour < 21) {
    return makeDynamicTask(
      907,
      7,
      "💧",
      "Hydration Reminder",
      `You've drunk ${waterToday.toFixed(1)}L today. Remember to drink water! (Goal: 2.5L)`,
      "/dashboard",
      "Log Water Now",
    );
  }

  // Priority H: Step Goal Interstitial Nudge
  if (stepsToday < 5000 && currentHour >= 12 && currentHour < 22) {
    return makeDynamicTask(
      908,
      8,
      "👟",
      "Daily Step Nudge",
      `You're at ${stepsToday.toLocaleString()} steps today. Take a short walk to reach your target!`,
      "/dashboard",
      "Log Steps Now",
    );
  }

  // Fallback: Gamified Level Progression
  const unlockedIds = progress.unlocked_level_ids || [1];
  const completedIds = progress.completed_level_ids || [];

  let activeLevelId = unlockedIds.find((id) => !completedIds.includes(id));

  if (!activeLevelId) {
    const maxCompletedOrder = LEVELS.filter((l) =>
      completedIds.includes(l.id),
    ).reduce((max, l) => Math.max(max, l.order_index), 0);
    const nextLevel = LEVELS.find(
      (l) => l.order_index === maxCompletedOrder + 1,
    );
    activeLevelId = nextLevel ? nextLevel.id : LEVELS[LEVELS.length - 1].id;
  }

  const level = LEVELS.find((l) => l.id === activeLevelId) || LEVELS[0];
  const dataWithXp = { ...trackingData, totalXp: progress.total_xp };
  const progressResult = evaluateRequirement(level.requirement, dataWithXp);
  const isCompleted = completedIds.includes(level.id);

  let actionRoute = "/dashboard";
  let actionLabel = "Log Activity";

  switch (level.requirement.metric) {
    case "water_ml":
      actionRoute = "/dashboard";
      actionLabel = "Log Water Now";
      break;
    case "weight_log":
      actionRoute = "/dashboard";
      actionLabel = "Log Weight Now";
      break;
    case "steps":
      actionRoute = "/dashboard";
      actionLabel = "Log Steps Now";
      break;
    case "sleep":
    case "sleep_quality":
      actionRoute = "/dashboard";
      actionLabel = "Log Sleep Now";
      break;
    case "meals":
      actionRoute = "/dashboard/diet";
      actionLabel = "Log Meals Now";
      break;
    case "habit":
      actionRoute = "/dashboard";
      actionLabel = "Complete Habits";
      break;
    default:
      actionRoute = "/dashboard/games";
      actionLabel = "View Journey Map";
      break;
  }

  return {
    level,
    progressResult,
    isCompleted,
    actionRoute,
    actionLabel,
  };
}
