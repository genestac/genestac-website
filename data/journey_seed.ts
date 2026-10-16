// ============================================================
// Journey Seed Data — 5 Worlds × 10 Levels = 50 Levels
// ============================================================

export type LevelType = 'workout' | 'water' | 'nutrition' | 'steps' | 'weight' | 'sleep' | 'habit' | 'boss' | 'checkpoint';

export interface WorldSeed {
  id: number;
  name: string;
  description: string;
  order_index: number;
  theme_color: string;
  icon: string;
}

export interface LevelSeed {
  id: number;
  world_id: number;
  order_index: number;
  title: string;
  description: string;
  type: LevelType;
  xp_reward: number;
  requirement: {
    metric: string;
    target: number;
    days?: number;
    description: string;
  };
  icon: string;
}

export const WORLDS: WorldSeed[] = [
  { id: 1, name: 'Starter Meadow',   description: 'Your journey begins here. Build the foundations of healthy habits.', order_index: 1, theme_color: '#22c55e', icon: '🌿' },
  { id: 2, name: 'Hydration Falls',   description: 'Master the art of staying hydrated. Water is life!',               order_index: 2, theme_color: '#3b82f6', icon: '💧' },
  { id: 3, name: 'Iron Mountain',     description: 'Push your limits with exercise and movement challenges.',           order_index: 3, theme_color: '#f97316', icon: '🏔️' },
  { id: 4, name: 'Mindful Valley',    description: 'Rest, recover, and build lasting consistency.',                     order_index: 4, theme_color: '#8b5cf6', icon: '🧘' },
  { id: 5, name: 'Victory Summit',    description: 'The final ascent. Combine everything you\'ve learned.',             order_index: 5, theme_color: '#eab308', icon: '🏆' },
];

export const LEVELS: LevelSeed[] = [
  // ── World 1: Starter Meadow (Levels 1–10) ──
  { id: 1,  world_id: 1, order_index: 1,  title: 'First Step',        description: 'Log your weight for the first time.',                     type: 'weight',     xp_reward: 20,  requirement: { metric: 'weight_log', target: 1, days: 1, description: 'Log your weight once' },                            icon: '⚖️' },
  { id: 2,  world_id: 1, order_index: 2,  title: 'Hydration Starter', description: 'Drink at least 1L of water today.',                       type: 'water',      xp_reward: 20,  requirement: { metric: 'water_ml', target: 1, days: 1, description: 'Drink 1L of water in a day' },                        icon: '💧' },
  { id: 3,  world_id: 1, order_index: 3,  title: 'Breakfast Club',    description: 'Log your first meal.',                                    type: 'nutrition',  xp_reward: 20,  requirement: { metric: 'meals', target: 1, days: 1, description: 'Log 1 meal' },                                          icon: '🍎' },
  { id: 4,  world_id: 1, order_index: 4,  title: 'Step Counter',      description: 'Take 3000 steps in a day.',                               type: 'steps',      xp_reward: 25,  requirement: { metric: 'steps', target: 3000, days: 1, description: 'Walk 3,000 steps in a day' },                         icon: '👟' },
  { id: 5,  world_id: 1, order_index: 5,  title: 'Early Bird',        description: 'XP checkpoint — you\'re making progress!',                type: 'checkpoint', xp_reward: 50,  requirement: { metric: 'xp_total', target: 85, description: 'Earn 85 total XP' },                                        icon: '🏁' },
  { id: 6,  world_id: 1, order_index: 6,  title: 'Dream Logger',      description: 'Log your sleep for the first time.',                      type: 'sleep',      xp_reward: 20,  requirement: { metric: 'sleep', target: 1, days: 1, description: 'Log your sleep once' },                                 icon: '🌙' },
  { id: 7,  world_id: 1, order_index: 7,  title: 'Habit Seed',        description: 'Complete all 3 daily habits.',                             type: 'habit',      xp_reward: 25,  requirement: { metric: 'habit', target: 3, days: 1, description: 'Complete all 3 daily habits in a day' },                 icon: '🌱' },
  { id: 8,  world_id: 1, order_index: 8,  title: 'Weigh-In Streak',   description: 'Log your weight for 3 consecutive days.',                  type: 'weight',     xp_reward: 30,  requirement: { metric: 'weight_log', target: 1, days: 3, description: 'Log weight for 3 consecutive days' },               icon: '📊' },
  { id: 9,  world_id: 1, order_index: 9,  title: 'Full Tracker',      description: 'Log weight, water, and steps all in one day.',             type: 'habit',      xp_reward: 35,  requirement: { metric: 'multi_log', target: 3, days: 1, description: 'Log weight + water + steps in a single day' },       icon: '📋' },
  { id: 10, world_id: 1, order_index: 10, title: 'Meadow Guardian',   description: 'BOSS: Maintain a 5-day logging streak.',                  type: 'boss',       xp_reward: 100, requirement: { metric: 'streak', target: 5, description: 'Maintain a 5-day logging streak' },                          icon: '👑' },

  // ── World 2: Hydration Falls (Levels 11–20) ──
  { id: 11, world_id: 2, order_index: 11, title: 'Water Warrior',     description: 'Drink 2L of water in a day.',                             type: 'water',      xp_reward: 25,  requirement: { metric: 'water_ml', target: 2, days: 1, description: 'Drink 2L of water in a day' },                        icon: '🚰' },
  { id: 12, world_id: 2, order_index: 12, title: 'Meal Prep Pro',     description: 'Log 3 meals in a single day.',                            type: 'nutrition',  xp_reward: 30,  requirement: { metric: 'meals', target: 3, days: 1, description: 'Log 3 meals in one day' },                               icon: '🥗' },
  { id: 13, world_id: 2, order_index: 13, title: 'Step Up',           description: 'Walk 5000 steps in a day.',                               type: 'steps',      xp_reward: 30,  requirement: { metric: 'steps', target: 5000, days: 1, description: 'Walk 5,000 steps in a day' },                         icon: '🏃' },
  { id: 14, world_id: 2, order_index: 14, title: 'Sleep Routine',     description: 'Log sleep for 3 consecutive days.',                       type: 'sleep',      xp_reward: 30,  requirement: { metric: 'sleep', target: 1, days: 3, description: 'Log sleep for 3 consecutive days' },                     icon: '😴' },
  { id: 15, world_id: 2, order_index: 15, title: 'Halfway Hero',      description: 'XP checkpoint — keep going!',                             type: 'checkpoint', xp_reward: 60,  requirement: { metric: 'xp_total', target: 300, description: 'Earn 300 total XP' },                                       icon: '🏁' },
  { id: 16, world_id: 2, order_index: 16, title: 'Hydration Habit',   description: 'Drink 2L of water for 3 consecutive days.',               type: 'water',      xp_reward: 40,  requirement: { metric: 'water_ml', target: 2, days: 3, description: 'Drink 2L of water for 3 days in a row' },             icon: '💦' },
  { id: 17, world_id: 2, order_index: 17, title: 'Weight Watcher',    description: 'Log your weight for 7 days total.',                       type: 'weight',     xp_reward: 35,  requirement: { metric: 'weight_log', target: 1, days: 7, description: 'Log weight 7 times total' },                        icon: '📈' },
  { id: 18, world_id: 2, order_index: 18, title: 'Calorie Tracker',   description: 'Log meals for 5 days total.',                             type: 'nutrition',  xp_reward: 35,  requirement: { metric: 'meals', target: 1, days: 5, description: 'Log at least 1 meal for 5 different days' },             icon: '🔥' },
  { id: 19, world_id: 2, order_index: 19, title: 'Hydro Master',      description: 'Drink 2.5L of water for 5 consecutive days.',             type: 'water',      xp_reward: 50,  requirement: { metric: 'water_ml', target: 2.5, days: 5, description: 'Drink 2.5L of water for 5 days in a row' },         icon: '🌊' },
  { id: 20, world_id: 2, order_index: 20, title: 'Falls Conqueror',   description: 'BOSS: Hit water + steps + weight goals for 5 days.',      type: 'boss',       xp_reward: 120, requirement: { metric: 'multi_streak', target: 3, days: 5, description: 'Log water, steps & weight for 5 consecutive days' }, icon: '👑' },

  // ── World 3: Iron Mountain (Levels 21–30) ──
  { id: 21, world_id: 3, order_index: 21, title: 'Power Walk',        description: 'Walk 8000 steps in a day.',                               type: 'steps',      xp_reward: 35,  requirement: { metric: 'steps', target: 8000, days: 1, description: 'Walk 8,000 steps in a day' },                         icon: '🦶' },
  { id: 22, world_id: 3, order_index: 22, title: 'Iron Will',         description: 'Maintain a 7-day logging streak.',                        type: 'habit',      xp_reward: 50,  requirement: { metric: 'streak', target: 7, description: 'Maintain a 7-day logging streak' },                             icon: '💪' },
  { id: 23, world_id: 3, order_index: 23, title: 'Meal Master',       description: 'Log 3 meals a day for 3 consecutive days.',               type: 'nutrition',  xp_reward: 45,  requirement: { metric: 'meals', target: 3, days: 3, description: 'Log 3 meals per day for 3 consecutive days' },           icon: '🍽️' },
  { id: 24, world_id: 3, order_index: 24, title: 'Sleepwalker',       description: 'Log 7+ hours of sleep for 5 consecutive days.',           type: 'sleep',      xp_reward: 40,  requirement: { metric: 'sleep_quality', target: 7, days: 5, description: 'Log 7+ hours sleep for 5 days in a row' },       icon: '🛌' },
  { id: 25, world_id: 3, order_index: 25, title: 'Mountain Base',     description: 'XP checkpoint — you\'re climbing strong!',                type: 'checkpoint', xp_reward: 75,  requirement: { metric: 'xp_total', target: 600, description: 'Earn 600 total XP' },                                       icon: '🏁' },
  { id: 26, world_id: 3, order_index: 26, title: 'Step Marathon',     description: 'Walk 10,000 steps in a single day.',                      type: 'steps',      xp_reward: 50,  requirement: { metric: 'steps', target: 10000, days: 1, description: 'Walk 10,000 steps in a day' },                       icon: '🏅' },
  { id: 27, world_id: 3, order_index: 27, title: 'Hydration Peak',    description: 'Drink 3L of water for 3 consecutive days.',               type: 'water',      xp_reward: 45,  requirement: { metric: 'water_ml', target: 3, days: 3, description: 'Drink 3L of water for 3 days in a row' },             icon: '⛰️' },
  { id: 28, world_id: 3, order_index: 28, title: 'Consistency King',  description: 'Complete all habits for 7 consecutive days.',             type: 'habit',      xp_reward: 60,  requirement: { metric: 'habit', target: 3, days: 7, description: 'Complete all 3 daily habits for 7 consecutive days' },   icon: '🎯' },
  { id: 29, world_id: 3, order_index: 29, title: 'Weight Champion',   description: 'Log weight for 14 days total.',                           type: 'weight',     xp_reward: 50,  requirement: { metric: 'weight_log', target: 1, days: 14, description: 'Log your weight 14 times total' },                 icon: '🏋️' },
  { id: 30, world_id: 3, order_index: 30, title: 'Iron Titan',        description: 'BOSS: 10-day streak with all trackers active.',           type: 'boss',       xp_reward: 150, requirement: { metric: 'multi_streak', target: 4, days: 10, description: 'Log water, steps, weight & sleep for 10 consecutive days' }, icon: '👑' },

  // ── World 4: Mindful Valley (Levels 31–40) ──
  { id: 31, world_id: 4, order_index: 31, title: 'Zen Start',         description: 'Log 8 hours of sleep.',                                   type: 'sleep',      xp_reward: 30,  requirement: { metric: 'sleep_quality', target: 8, days: 1, description: 'Get 8+ hours of sleep in a night' },              icon: '🧘' },
  { id: 32, world_id: 4, order_index: 32, title: 'Habit Chain',       description: 'Complete all habits for 10 consecutive days.',             type: 'habit',      xp_reward: 70,  requirement: { metric: 'habit', target: 3, days: 10, description: 'Complete all 3 daily habits for 10 consecutive days' }, icon: '🔗' },
  { id: 33, world_id: 4, order_index: 33, title: 'Nutrition Sage',    description: 'Log 3 meals a day for 7 consecutive days.',               type: 'nutrition',  xp_reward: 60,  requirement: { metric: 'meals', target: 3, days: 7, description: 'Log 3 meals per day for 7 consecutive days' },           icon: '🥑' },
  { id: 34, world_id: 4, order_index: 34, title: 'Deep Sleep',        description: 'Log 7+ hours sleep for 10 consecutive days.',             type: 'sleep',      xp_reward: 60,  requirement: { metric: 'sleep_quality', target: 7, days: 10, description: 'Log 7+ hours sleep for 10 consecutive days' },  icon: '💤' },
  { id: 35, world_id: 4, order_index: 35, title: 'Valley Oasis',      description: 'XP checkpoint — you\'re becoming legendary!',             type: 'checkpoint', xp_reward: 100, requirement: { metric: 'xp_total', target: 1000, description: 'Earn 1,000 total XP' },                                    icon: '🏁' },
  { id: 36, world_id: 4, order_index: 36, title: 'Steady Stepper',    description: 'Walk 8000+ steps for 7 consecutive days.',                type: 'steps',      xp_reward: 65,  requirement: { metric: 'steps', target: 8000, days: 7, description: 'Walk 8,000+ steps for 7 days in a row' },             icon: '🚶' },
  { id: 37, world_id: 4, order_index: 37, title: 'Water Monk',        description: 'Drink 3L of water for 7 consecutive days.',               type: 'water',      xp_reward: 60,  requirement: { metric: 'water_ml', target: 3, days: 7, description: 'Drink 3L of water for 7 days in a row' },             icon: '🪷' },
  { id: 38, world_id: 4, order_index: 38, title: '14-Day Warrior',    description: 'Maintain a 14-day logging streak.',                       type: 'habit',      xp_reward: 80,  requirement: { metric: 'streak', target: 14, description: 'Maintain a 14-day logging streak' },                            icon: '⚔️' },
  { id: 39, world_id: 4, order_index: 39, title: 'Weight Veteran',    description: 'Log weight for 21 days total.',                           type: 'weight',     xp_reward: 60,  requirement: { metric: 'weight_log', target: 1, days: 21, description: 'Log your weight 21 times total' },                 icon: '🎖️' },
  { id: 40, world_id: 4, order_index: 40, title: 'Valley Sage',       description: 'BOSS: 14-day streak with all 5 trackers.',                type: 'boss',       xp_reward: 200, requirement: { metric: 'multi_streak', target: 5, days: 14, description: 'Log all 5 trackers for 14 consecutive days' },      icon: '👑' },

  // ── World 5: Victory Summit (Levels 41–50) ──
  { id: 41, world_id: 5, order_index: 41, title: 'Summit Approach',   description: 'Walk 10,000 steps for 5 consecutive days.',               type: 'steps',      xp_reward: 70,  requirement: { metric: 'steps', target: 10000, days: 5, description: 'Walk 10,000+ steps for 5 days in a row' },           icon: '🥾' },
  { id: 42, world_id: 5, order_index: 42, title: 'Ocean Drinker',     description: 'Drink 3L of water for 10 consecutive days.',              type: 'water',      xp_reward: 75,  requirement: { metric: 'water_ml', target: 3, days: 10, description: 'Drink 3L of water for 10 days in a row' },           icon: '🌊' },
  { id: 43, world_id: 5, order_index: 43, title: 'Iron Chef',         description: 'Log 3 meals a day for 14 consecutive days.',              type: 'nutrition',  xp_reward: 80,  requirement: { metric: 'meals', target: 3, days: 14, description: 'Log 3 meals per day for 14 consecutive days' },         icon: '👨‍🍳' },
  { id: 44, world_id: 5, order_index: 44, title: 'Dream Master',      description: 'Log 8+ hours sleep for 10 consecutive days.',             type: 'sleep',      xp_reward: 75,  requirement: { metric: 'sleep_quality', target: 8, days: 10, description: 'Log 8+ hours sleep for 10 consecutive days' },  icon: '✨' },
  { id: 45, world_id: 5, order_index: 45, title: 'Summit Gate',       description: 'XP checkpoint — the peak is near!',                      type: 'checkpoint', xp_reward: 125, requirement: { metric: 'xp_total', target: 1500, description: 'Earn 1,500 total XP' },                                    icon: '🏁' },
  { id: 46, world_id: 5, order_index: 46, title: '21-Day Legend',     description: 'Maintain a 21-day logging streak.',                       type: 'habit',      xp_reward: 100, requirement: { metric: 'streak', target: 21, description: 'Maintain a 21-day logging streak' },                           icon: '🌟' },
  { id: 47, world_id: 5, order_index: 47, title: 'Marathon Walker',   description: 'Walk 10,000+ steps for 10 consecutive days.',             type: 'steps',      xp_reward: 90,  requirement: { metric: 'steps', target: 10000, days: 10, description: 'Walk 10,000+ steps for 10 days in a row' },         icon: '🏃‍♂️' },
  { id: 48, world_id: 5, order_index: 48, title: 'Perfect Month',     description: 'Log weight for 30 days total.',                           type: 'weight',     xp_reward: 100, requirement: { metric: 'weight_log', target: 1, days: 30, description: 'Log your weight 30 times total' },                 icon: '📅' },
  { id: 49, world_id: 5, order_index: 49, title: '30-Day Master',     description: 'Maintain a 30-day logging streak.',                       type: 'habit',      xp_reward: 150, requirement: { metric: 'streak', target: 30, description: 'Maintain a 30-day logging streak' },                           icon: '💎' },
  { id: 50, world_id: 5, order_index: 50, title: 'Summit Champion',   description: 'BOSS: 21-day streak with all trackers at max targets.',   type: 'boss',       xp_reward: 300, requirement: { metric: 'multi_streak', target: 5, days: 21, description: 'Log all 5 trackers for 21 consecutive days' },      icon: '🏆' },
];

// Total possible XP: sum of all xp_rewards
export const TOTAL_POSSIBLE_XP = LEVELS.reduce((sum, l) => sum + l.xp_reward, 0);

// Get world for a given level
export function getWorldForLevel(levelOrderIndex: number): WorldSeed | undefined {
  const level = LEVELS.find(l => l.order_index === levelOrderIndex);
  if (!level) return undefined;
  return WORLDS.find(w => w.id === level.world_id);
}

// Get levels for a world
export function getLevelsForWorld(worldId: number): LevelSeed[] {
  return LEVELS.filter(l => l.world_id === worldId).sort((a, b) => a.order_index - b.order_index);
}
