// ============================================================
// Unlock Engine — checks if the next level should unlock
// Called after any user tracking action
// ============================================================

import { LEVELS, type LevelSeed } from '@/data/journey_seed';
import { evaluateRequirement, type UserTrackingData, type RequirementResult } from './evaluateRequirement';

export interface UserProgress {
  current_level_id: number;
  total_xp: number;
  unlocked_level_ids: number[];
  completed_level_ids: number[];
}

export interface UnlockResult {
  unlocked: boolean;
  level?: LevelSeed;
  xpGained?: number;
  newTotalXp?: number;
  newCompletedIds?: number[];
  newUnlockedIds?: number[];
}

/**
 * Derive the canonical unlocked_level_ids from a completed set.
 * Includes all completed levels PLUS the single next (active) level.
 */
function deriveUnlocked(completedIds: number[]): number[] {
  let maxOrder = 0;
  completedIds.forEach((id) => {
    const lvl = LEVELS.find((l) => l.id === id);
    if (lvl && lvl.order_index > maxOrder) maxOrder = lvl.order_index;
  });
  return LEVELS.filter((l) => l.order_index <= maxOrder + 1).map((l) => l.id);
}

/**
 * checkUnlocks — action-triggered check.
 * Evaluates AT MOST 1 level per call: the current active level.
 * If its requirement is met, completes it and reveals the next level.
 * This prevents cascade unlocks from a single action.
 */
export function checkUnlocks(
  progress: UserProgress,
  trackingData: UserTrackingData
): UnlockResult {
  const { completed_level_ids } = progress;
  let totalXp = progress.total_xp;
  const newCompleted = [...completed_level_ids];

  // Find the first uncompleted level (the active level)
  const activeLevel = LEVELS.find((l) => !newCompleted.includes(l.id));
  if (!activeLevel) return { unlocked: false }; // all 50 levels done

  // Evaluate ONLY the active level requirement
  const result = evaluateRequirement(activeLevel.requirement, {
    ...trackingData,
    totalXp,
  });

  console.log('[Journey] checkUnlocks active level:', `#${activeLevel.order_index} ${activeLevel.title}`, '| met:', result.met);

  if (result.met) {
    newCompleted.push(activeLevel.id);
    totalXp += activeLevel.xp_reward;

    const newUnlocked = deriveUnlocked(newCompleted);

    return {
      unlocked: true,
      level: activeLevel,
      xpGained: activeLevel.xp_reward,
      newTotalXp: totalXp,
      newCompletedIds: newCompleted,
      newUnlockedIds: newUnlocked,
    };
  }

  // Requirement NOT met — also fix unlocked_level_ids if they're out of sync
  const correctUnlocked = deriveUnlocked(newCompleted);
  const needsSync =
    correctUnlocked.length !== progress.unlocked_level_ids.length ||
    correctUnlocked.some((id) => !progress.unlocked_level_ids.includes(id));

  if (needsSync) {
    return {
      unlocked: true, // signal sync needed (xpGained=0 so no celebration)
      xpGained: 0,
      newTotalXp: totalXp,
      newCompletedIds: newCompleted,
      newUnlockedIds: correctUnlocked,
    };
  }

  return { unlocked: false };
}

/**
 * checkUnlocksAll — page-load batch check.
 * Loops and completes ALL historically-met levels without celebrations.
 * Used once on page load to restore correct state from Supabase data.
 */
export function checkUnlocksAll(
  progress: UserProgress,
  trackingData: UserTrackingData
): UnlockResult {
  const newCompleted = [...progress.completed_level_ids];
  let totalXp = progress.total_xp;
  let totalXpGained = 0;
  let lastLevel: LevelSeed | undefined;

  let changed = true;
  while (changed) {
    changed = false;
    const activeLevel = LEVELS.find((l) => !newCompleted.includes(l.id));
    if (!activeLevel) break;

    const result = evaluateRequirement(activeLevel.requirement, {
      ...trackingData,
      totalXp,
    });

    if (result.met) {
      newCompleted.push(activeLevel.id);
      totalXp += activeLevel.xp_reward;
      totalXpGained += activeLevel.xp_reward;
      lastLevel = activeLevel;
      changed = true;
    }
    // If requirement NOT met, stop — strict sequential progression
  }

  const newUnlocked = deriveUnlocked(newCompleted);

  const changed2 =
    newCompleted.length !== progress.completed_level_ids.length ||
    newUnlocked.length !== progress.unlocked_level_ids.length;

  if (changed2) {
    return {
      unlocked: true,
      level: lastLevel,
      xpGained: totalXpGained,
      newTotalXp: totalXp,
      newCompletedIds: newCompleted,
      newUnlockedIds: newUnlocked,
    };
  }

  return { unlocked: false };
}

/**
 * Get the progress for all levels (for displaying in the UI).
 */
export function getAllLevelProgress(
  progress: UserProgress,
  trackingData: UserTrackingData
): Map<number, RequirementResult> {
  const results = new Map<number, RequirementResult>();

  for (const level of LEVELS) {
    const dataWithXp = { ...trackingData, totalXp: progress.total_xp };
    results.set(level.id, evaluateRequirement(level.requirement, dataWithXp));
  }

  return results;
}

/**
 * Initialize progress for a new user (unlock level 1).
 */
export function createInitialProgress(): UserProgress {
  return {
    current_level_id: 1,
    total_xp: 0,
    unlocked_level_ids: [1],
    completed_level_ids: [],
  };
}
