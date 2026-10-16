// ============================================================
// Requirement Evaluator — checks level requirements against user data
// Works client-side with data already fetched from Supabase
// ============================================================

export interface Requirement {
  metric: string;
  target: number;
  days?: number;
  description: string;
}

export interface UserTrackingData {
  weightHistory: { date: string; weight: number }[];
  waterLogs: { date: string; amount: number }[];
  stepsLogs: { date: string; steps: number }[];
  sleepLogs: { date: string; hours: number }[];
  meals: { date: string; mealType?: string }[];
  habitLogs: { date: string; habits: Record<string, boolean> }[];
  totalXp: number;
}

export interface RequirementResult {
  met: boolean;
  current: number;
  target: number;
  progress: number; // 0-1
  description: string;
}

/**
 * Get today's date string in YYYY-MM-DD format.
 */
function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get an array of the last N date strings (YYYY-MM-DD), ending at today.
 */
function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * Normalize a date string to YYYY-MM-DD.
 */
function normalizeDate(dateStr: string): string {
  if (dateStr.includes('T')) return dateStr.split('T')[0];
  return dateStr;
}

/**
 * Count consecutive days (ending at today or yesterday) where a predicate is true.
 */
function countConsecutiveDays(
  logs: { date: string }[],
  predicate: (log: any) => boolean
): number {
  const logDates = new Set(
    logs.filter(predicate).map(l => normalizeDate(l.date))
  );

  let streak = 0;
  const today = new Date();

  // Start from today and work backwards
  for (let i = 0; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];

    if (logDates.has(dateKey)) {
      streak++;
    } else if (i === 0) {
      // Today hasn't been logged yet — that's ok, continue checking from yesterday
      continue;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Count total days where a predicate is true.
 */
function countTotalDays(
  logs: { date: string }[],
  predicate: (log: any) => boolean
): number {
  const uniqueDates = new Set(
    logs.filter(predicate).map(l => normalizeDate(l.date))
  );
  return uniqueDates.size;
}

/**
 * Evaluate a requirement against user tracking data.
 */
export function evaluateRequirement(
  requirement: Requirement,
  data: UserTrackingData
): RequirementResult {
  const { metric, target, days } = requirement;

  switch (metric) {
    case 'weight_log': {
      // Count how many unique days the user has logged weight
      const totalDays = countTotalDays(
        data.weightHistory,
        () => true
      );
      const needed = days || 1;
      return {
        met: totalDays >= needed,
        current: Math.min(totalDays, needed),
        target: needed,
        progress: Math.min(1, totalDays / needed),
        description: requirement.description,
      };
    }

    case 'water_ml': {
      // Check if user drank >= target liters for N consecutive days
      if (days && days > 1) {
        const waterByDate: Record<string, number> = {};
        data.waterLogs.forEach(l => {
          const d = normalizeDate(l.date);
          waterByDate[d] = Math.max(waterByDate[d] || 0, Number(l.amount) || 0);
        });
        const qualifyingDays = Object.entries(waterByDate)
          .filter(([, amount]) => amount >= target)
          .map(([date]) => ({ date }));
        const consecutiveDays = countConsecutiveDays(qualifyingDays, () => true);
        return {
          met: consecutiveDays >= days,
          current: Math.min(consecutiveDays, days),
          target: days,
          progress: Math.min(1, consecutiveDays / days),
          description: requirement.description,
        };
      }
      // Single day: check water logged today
      const today = todayStr();
      const localDate = new Date();
      const localToday = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

      const todayLogs = data.waterLogs.filter(l => {
        const d = normalizeDate(l.date);
        return d === today || d === localToday;
      });

      // Sum all of today's water entries (in case there are multiple), not just max
      const todayAmount = todayLogs.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

      return {
        met: todayAmount >= target,
        current: Number(todayAmount.toFixed(2)),
        target,
        progress: Math.min(1, todayAmount / target),
        description: requirement.description,
      };
    }

    case 'steps': {
      if (days && days > 1) {
        const consecutiveDays = countConsecutiveDays(
          data.stepsLogs,
          (log: any) => log.steps >= target
        );
        return {
          met: consecutiveDays >= days,
          current: Math.min(consecutiveDays, days),
          target: days,
          progress: Math.min(1, consecutiveDays / days),
          description: requirement.description,
        };
      }
      const today = todayStr();
      const localDate = new Date();
      const localToday = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

      const todayLogs = data.stepsLogs.filter(l => {
        const d = normalizeDate(l.date);
        return d === today || d === localToday;
      });
      const todaySteps = todayLogs.reduce((maxVal, l) => Math.max(maxVal, Number(l.steps) || 0), 0);

      return {
        met: todaySteps >= target,
        current: todaySteps,
        target,
        progress: Math.min(1, todaySteps / target),
        description: requirement.description,
      };
    }

    case 'sleep': {
      // Count days where sleep was logged
      if (days && days > 1) {
        const consecutiveDays = countConsecutiveDays(
          data.sleepLogs,
          () => true
        );
        return {
          met: consecutiveDays >= days,
          current: Math.min(consecutiveDays, days),
          target: days,
          progress: Math.min(1, consecutiveDays / days),
          description: requirement.description,
        };
      }
      const logged = data.sleepLogs.length > 0;
      return {
        met: logged,
        current: logged ? 1 : 0,
        target: 1,
        progress: logged ? 1 : 0,
        description: requirement.description,
      };
    }

    case 'sleep_quality': {
      // Check if user slept >= target hours for N consecutive days
      if (days && days > 1) {
        const consecutiveDays = countConsecutiveDays(
          data.sleepLogs,
          (log: any) => log.hours >= target
        );
        return {
          met: consecutiveDays >= days,
          current: Math.min(consecutiveDays, days),
          target: days,
          progress: Math.min(1, consecutiveDays / days),
          description: requirement.description,
        };
      }
      const today = todayStr();
      const localDate = new Date();
      const localToday = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      const yesterday = new Date(localDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      const todayLog = data.sleepLogs.find(l => {
        const d = normalizeDate(l.date);
        return d === today || d === localToday || d === yesterdayStr;
      });
      const hours = todayLog?.hours || 0;
      return {
        met: hours >= target,
        current: hours,
        target,
        progress: Math.min(1, hours / target),
        description: requirement.description,
      };
    }

    case 'meals': {
      if (days && days > 1) {
        // Count days with at least `target` meals logged
        const mealsByDate: Record<string, number> = {};
        data.meals.forEach(m => {
          const d = normalizeDate(m.date);
          mealsByDate[d] = (mealsByDate[d] || 0) + 1;
        });

        if (target > 1) {
          // Need `target` meals per day for `days` consecutive days
          const fakeLogs = Object.entries(mealsByDate)
            .filter(([, count]) => count >= target)
            .map(([date]) => ({ date }));
          const consecutive = countConsecutiveDays(fakeLogs, () => true);
          return {
            met: consecutive >= days,
            current: Math.min(consecutive, days),
            target: days,
            progress: Math.min(1, consecutive / days),
            description: requirement.description,
          };
        } else {
          // At least 1 meal for `days` different days
          const totalDays = Object.keys(mealsByDate).length;
          return {
            met: totalDays >= days,
            current: Math.min(totalDays, days),
            target: days,
            progress: Math.min(1, totalDays / days),
            description: requirement.description,
          };
        }
      }
      // Single day
      const today = todayStr();
      const localDate = new Date();
      const localToday = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      const todayMeals = data.meals.filter(m => {
        const d = normalizeDate(m.date);
        return d === today || d === localToday;
      });
      return {
        met: todayMeals.length >= target,
        current: todayMeals.length,
        target,
        progress: Math.min(1, todayMeals.length / target),
        description: requirement.description,
      };
    }

    case 'habit': {
      if (days && days > 1) {
        const consecutiveDays = countConsecutiveDays(
          data.habitLogs,
          (log: any) => {
            const completed = Object.values(log.habits || {}).filter(Boolean).length;
            return completed >= target;
          }
        );
        return {
          met: consecutiveDays >= days,
          current: Math.min(consecutiveDays, days),
          target: days,
          progress: Math.min(1, consecutiveDays / days),
          description: requirement.description,
        };
      }
      const today = todayStr();
      const localDate = new Date();
      const localToday = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      const todayHabits = data.habitLogs.find(l => {
        const d = normalizeDate(l.date);
        return d === today || d === localToday;
      });
      const completed = todayHabits ? Object.values(todayHabits.habits || {}).filter(Boolean).length : 0;
      return {
        met: completed >= target,
        current: completed,
        target,
        progress: Math.min(1, completed / target),
        description: requirement.description,
      };
    }

    case 'streak': {
      // Count consecutive logging days (any tracker)
      const allDates = new Set<string>();
      data.weightHistory.forEach(l => allDates.add(normalizeDate(l.date)));
      data.waterLogs.forEach(l => allDates.add(normalizeDate(l.date)));
      data.stepsLogs.forEach(l => allDates.add(normalizeDate(l.date)));
      data.sleepLogs.forEach(l => allDates.add(normalizeDate(l.date)));

      let streak = 0;
      const today = new Date();
      for (let i = 0; i <= 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        if (allDates.has(dateKey)) {
          streak++;
        } else if (i === 0) {
          continue;
        } else {
          break;
        }
      }

      return {
        met: streak >= target,
        current: Math.min(streak, target),
        target,
        progress: Math.min(1, streak / target),
        description: requirement.description,
      };
    }

    case 'multi_log': {
      // Check if multiple trackers were used today
      const today = todayStr();
      let count = 0;
      if (data.weightHistory.some(l => normalizeDate(l.date) === today)) count++;
      if (data.waterLogs.some(l => normalizeDate(l.date) === today)) count++;
      if (data.stepsLogs.some(l => normalizeDate(l.date) === today)) count++;
      if (data.sleepLogs.some(l => normalizeDate(l.date) === today)) count++;
      if (data.meals.some(l => normalizeDate(l.date) === today)) count++;

      return {
        met: count >= target,
        current: count,
        target,
        progress: Math.min(1, count / target),
        description: requirement.description,
      };
    }

    case 'multi_streak': {
      // Check if `target` different trackers were all logged for `days` consecutive days
      const daysNeeded = days || 1;

      // For each day, count how many trackers were active
      const trackersByDay: Record<string, Set<string>> = {};

      const addTracker = (date: string, tracker: string) => {
        const d = normalizeDate(date);
        if (!trackersByDay[d]) trackersByDay[d] = new Set();
        trackersByDay[d].add(tracker);
      };

      data.weightHistory.forEach(l => addTracker(l.date, 'weight'));
      data.waterLogs.forEach(l => addTracker(l.date, 'water'));
      data.stepsLogs.forEach(l => addTracker(l.date, 'steps'));
      data.sleepLogs.forEach(l => addTracker(l.date, 'sleep'));
      data.meals.forEach(l => addTracker(l.date, 'meals'));

      // Count consecutive days where >= target trackers were used
      const qualifyingDays = Object.entries(trackersByDay)
        .filter(([, trackers]) => trackers.size >= target)
        .map(([date]) => ({ date }));

      const consecutive = countConsecutiveDays(qualifyingDays, () => true);

      return {
        met: consecutive >= daysNeeded,
        current: Math.min(consecutive, daysNeeded),
        target: daysNeeded,
        progress: Math.min(1, consecutive / daysNeeded),
        description: requirement.description,
      };
    }

    case 'xp_total': {
      return {
        met: data.totalXp >= target,
        current: Math.min(data.totalXp, target),
        target,
        progress: Math.min(1, data.totalXp / target),
        description: requirement.description,
      };
    }

    default:
      return {
        met: false,
        current: 0,
        target: target || 1,
        progress: 0,
        description: requirement.description,
      };
  }
}
