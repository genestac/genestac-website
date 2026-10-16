-- ============================================================
-- Gamified Health Journey — Database Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Worlds: themed zones that group levels
create table if not exists worlds (
  id serial primary key,
  name text not null,
  description text,
  order_index int not null default 0,
  theme_color text not null default '#22c55e',
  icon text default '🌿',
  created_at timestamptz default now()
);

-- 2. Levels: individual nodes on the journey path
create table if not exists levels (
  id serial primary key,
  world_id int references worlds(id) on delete cascade,
  order_index int not null,
  title text not null,
  description text,
  type text not null default 'habit',
  xp_reward int not null default 25,
  requirement jsonb not null default '{}',
  icon text default '⭐',
  created_at timestamptz default now(),
  unique(order_index)
);

-- 3. User progress: per-user journey state
create table if not exists public.user_progress (
  id serial not null,
  user_id uuid not null,
  current_level_id integer null,
  total_xp integer not null default 0,
  unlocked_level_ids integer[] not null default '{}'::integer[],
  completed_level_ids integer[] not null default '{}'::integer[],
  adventure_mode boolean not null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_progress_pkey primary key (id),
  constraint user_progress_user_id_key unique (user_id),
  constraint user_progress_current_level_id_fkey foreign key (current_level_id) references levels (id)
) tablespace pg_default;

-- 4. XP events: audit log of all XP earned
create table if not exists xp_events (
  id serial primary key,
  user_id uuid not null,
  level_id int references levels(id) default null,
  source text not null,
  xp int not null default 0,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_levels_world_id on levels(world_id);
create index if not exists idx_levels_order_index on levels(order_index);
create index if not exists idx_user_progress_user_id on public.user_progress using btree (user_id) tablespace pg_default;
create index if not exists idx_xp_events_user_id on xp_events(user_id);
create index if not exists idx_xp_events_created_at on xp_events(created_at);

-- RLS policies
alter table user_progress enable row level security;
alter table xp_events enable row level security;

create policy "Users can view own progress"
  on user_progress for select using (auth.uid() = user_id);

create policy "Users can update own progress"
  on user_progress for update using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on user_progress for insert with check (auth.uid() = user_id);

create policy "Users can view own xp events"
  on xp_events for select using (auth.uid() = user_id);

create policy "Users can insert own xp events"
  on xp_events for insert with check (auth.uid() = user_id);

alter table worlds enable row level security;
alter table levels enable row level security;

create policy "Anyone can read worlds"
  on worlds for select using (true);

create policy "Anyone can read levels"
  on levels for select using (true);

-- 5. Seed Worlds
insert into worlds (id, name, description, order_index, theme_color, icon) values
(1, 'Starter Meadow', 'Your journey begins here. Build the foundations of healthy habits.', 1, '#22c55e', '🌿'),
(2, 'Hydration Falls', 'Master the art of staying hydrated. Water is life!', 2, '#3b82f6', '💧'),
(3, 'Iron Mountain', 'Push your limits with exercise and movement challenges.', 3, '#f97316', '🏔️'),
(4, 'Mindful Valley', 'Rest, recover, and build lasting consistency.', 4, '#8b5cf6', '🧘'),
(5, 'Victory Summit', 'The final ascent. Combine everything you''ve learned.', 5, '#eab308', '🏆')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index,
  theme_color = excluded.theme_color,
  icon = excluded.icon;

-- 6. Seed Levels
insert into levels (id, world_id, order_index, title, description, type, xp_reward, requirement, icon) values
(1, 1, 1, 'First Step', 'Log your weight for the first time.', 'weight', 20, '{"metric": "weight_log", "target": 1, "days": 1, "description": "Log your weight once"}', '⚖️'),
(2, 1, 2, 'Hydration Starter', 'Drink at least 1L of water today.', 'water', 20, '{"metric": "water_ml", "target": 1, "days": 1, "description": "Drink 1L of water in a day"}', '💧'),
(3, 1, 3, 'Breakfast Club', 'Log your first meal.', 'nutrition', 20, '{"metric": "meals", "target": 1, "days": 1, "description": "Log 1 meal"}', '🍎'),
(4, 1, 4, 'Step Counter', 'Take 3000 steps in a day.', 'steps', 25, '{"metric": "steps", "target": 3000, "days": 1, "description": "Walk 3,000 steps in a day"}', '👟'),
(5, 1, 5, 'Early Bird', 'XP checkpoint — you''re making progress!', 'checkpoint', 50, '{"metric": "xp_total", "target": 85, "description": "Earn 85 total XP"}', '🏁'),
(6, 1, 6, 'Dream Logger', 'Log your sleep for the first time.', 'sleep', 20, '{"metric": "sleep", "target": 1, "days": 1, "description": "Log your sleep once"}', '🌙'),
(7, 1, 7, 'Habit Seed', 'Complete all 3 daily habits.', 'habit', 25, '{"metric": "habit", "target": 3, "days": 1, "description": "Complete all 3 daily habits in a day"}', '🌱'),
(8, 1, 8, 'Weigh-In Streak', 'Log your weight for 3 consecutive days.', 'weight', 30, '{"metric": "weight_log", "target": 1, "days": 3, "description": "Log weight for 3 consecutive days"}', '📊'),
(9, 1, 9, 'Full Tracker', 'Log weight, water, and steps all in one day.', 'habit', 35, '{"metric": "multi_log", "target": 3, "days": 1, "description": "Log weight + water + steps in a single day"}', '📋'),
(10, 1, 10, 'Meadow Guardian', 'BOSS: Maintain a 5-day logging streak.', 'boss', 100, '{"metric": "streak", "target": 5, "description": "Maintain a 5-day logging streak"}', '👑'),
(11, 2, 11, 'Water Warrior', 'Drink 2L of water in a day.', 'water', 25, '{"metric": "water_ml", "target": 2, "days": 1, "description": "Drink 2L of water in a day"}', '🚰'),
(12, 2, 12, 'Meal Prep Pro', 'Log 3 meals in a single day.', 'nutrition', 30, '{"metric": "meals", "target": 3, "days": 1, "description": "Log 3 meals in one day"}', '🥗'),
(13, 2, 13, 'Step Up', 'Walk 5000 steps in a day.', 'steps', 30, '{"metric": "steps", "target": 5000, "days": 1, "description": "Walk 5,000 steps in a day"}', '🏃'),
(14, 2, 14, 'Sleep Routine', 'Log sleep for 3 consecutive days.', 'sleep', 30, '{"metric": "sleep", "target": 1, "days": 3, "description": "Log sleep for 3 consecutive days"}', '😴'),
(15, 2, 15, 'Halfway Hero', 'XP checkpoint — keep going!', 'checkpoint', 60, '{"metric": "xp_total", "target": 300, "description": "Earn 300 total XP"}', '🏁'),
(16, 2, 16, 'Hydration Habit', 'Drink 2L of water for 3 consecutive days.', 'water', 40, '{"metric": "water_ml", "target": 2, "days": 3, "description": "Drink 2L of water for 3 days in a row"}', '💦'),
(17, 2, 17, 'Weight Watcher', 'Log your weight for 7 days total.', 'weight', 35, '{"metric": "weight_log", "target": 1, "days": 7, "description": "Log weight 7 times total"}', '📈'),
(18, 2, 18, 'Calorie Tracker', 'Log meals for 5 days total.', 'nutrition', 35, '{"metric": "meals", "target": 1, "days": 5, "description": "Log at least 1 meal for 5 different days"}', '🔥'),
(19, 2, 19, 'Hydro Master', 'Drink 2.5L of water for 5 consecutive days.', 'water', 50, '{"metric": "water_ml", "target": 2.5, "days": 5, "description": "Drink 2.5L of water for 5 days in a row"}', '🌊'),
(20, 2, 20, 'Falls Conqueror', 'BOSS: Hit water + steps + weight goals for 5 days.', 'boss', 120, '{"metric": "multi_streak", "target": 3, "days": 5, "description": "Log water, steps & weight for 5 consecutive days"}', '👑'),
(21, 3, 21, 'Power Walk', 'Walk 8000 steps in a day.', 'steps', 35, '{"metric": "steps", "target": 8000, "days": 1, "description": "Walk 8,000 steps in a day"}', '🦶'),
(22, 3, 22, 'Iron Will', 'Maintain a 7-day logging streak.', 'habit', 50, '{"metric": "streak", "target": 7, "description": "Maintain a 7-day logging streak"}', '💪'),
(23, 3, 23, 'Meal Master', 'Log 3 meals a day for 3 consecutive days.', 'nutrition', 45, '{"metric": "meals", "target": 3, "days": 3, "description": "Log 3 meals per day for 3 consecutive days"}', '🍽️'),
(24, 3, 24, 'Sleepwalker', 'Log 7+ hours of sleep for 5 consecutive days.', 'sleep', 40, '{"metric": "sleep_quality", "target": 7, "days": 5, "description": "Log 7+ hours sleep for 5 days in a row"}', '🛌'),
(25, 3, 25, 'Mountain Base', 'XP checkpoint — you''re climbing strong!', 'checkpoint', 75, '{"metric": "xp_total", "target": 600, "description": "Earn 600 total XP"}', '🏁'),
(26, 3, 26, 'Step Marathon', 'Walk 10,000 steps in a single day.', 'steps', 50, '{"metric": "steps", "target": 10000, "days": 1, "description": "Walk 10,000 steps in a day"}', '🏅'),
(27, 3, 27, 'Hydration Peak', 'Drink 3L of water for 3 consecutive days.', 'water', 45, '{"metric": "water_ml", "target": 3, "days": 3, "description": "Drink 3L of water for 3 days in a row"}', '⛰️'),
(28, 3, 28, 'Consistency King', 'Complete all habits for 7 consecutive days.', 'habit', 60, '{"metric": "habit", "target": 3, "days": 7, "description": "Complete all 3 daily habits for 7 consecutive days"}', '🎯'),
(29, 3, 29, 'Weight Champion', 'Log weight for 14 days total.', 'weight', 50, '{"metric": "weight_log", "target": 1, "days": 14, "description": "Log your weight 14 times total"}', '🏋️'),
(30, 3, 30, 'Iron Titan', 'BOSS: 10-day streak with all trackers active.', 'boss', 150, '{"metric": "multi_streak", "target": 4, "days": 10, "description": "Log water, steps, weight & sleep for 10 consecutive days"}', '👑'),
(31, 4, 31, 'Zen Start', 'Log 8 hours of sleep.', 'sleep', 30, '{"metric": "sleep_quality", "target": 8, "days": 1, "description": "Get 8+ hours of sleep in a night"}', '🧘'),
(32, 4, 32, 'Habit Chain', 'Complete all habits for 10 consecutive days.', 'habit', 70, '{"metric": "habit", "target": 3, "days": 10, "description": "Complete all 3 daily habits for 10 consecutive days"}', '🔗'),
(33, 4, 33, 'Nutrition Sage', 'Log 3 meals a day for 7 consecutive days.', 'nutrition', 60, '{"metric": "meals", "target": 3, "days": 7, "description": "Log 3 meals per day for 7 consecutive days"}', '🥑'),
(34, 4, 34, 'Deep Sleep', 'Log 7+ hours sleep for 10 consecutive days.', 'sleep', 60, '{"metric": "sleep_quality", "target": 7, "days": 10, "description": "Log 7+ hours sleep for 10 consecutive days"}', '💤'),
(35, 4, 35, 'Valley Oasis', 'XP checkpoint — you''re becoming legendary!', 'checkpoint', 100, '{"metric": "xp_total", "target": 1000, "description": "Earn 1,000 total XP"}', '🏁'),
(36, 4, 36, 'Steady Stepper', 'Walk 8000+ steps for 7 consecutive days.', 'steps', 65, '{"metric": "steps", "target": 8000, "days": 7, "description": "Walk 8,000+ steps for 7 days in a row"}', '🚶'),
(37, 4, 37, 'Water Monk', 'Drink 3L of water for 7 consecutive days.', 'water', 60, '{"metric": "water_ml", "target": 3, "days": 7, "description": "Drink 3L of water for 7 days in a row"}', '🪷'),
(38, 4, 38, '14-Day Warrior', 'Maintain a 14-day logging streak.', 'habit', 80, '{"metric": "streak", "target": 14, "description": "Maintain a 14-day logging streak"}', '⚔️'),
(39, 4, 39, 'Weight Veteran', 'Log weight for 21 days total.', 'weight', 60, '{"metric": "weight_log", "target": 1, "days": 21, "description": "Log your weight 21 times total"}', '🎖️'),
(40, 4, 40, 'Valley Sage', 'BOSS: 14-day streak with all 5 trackers.', 'boss', 200, '{"metric": "multi_streak", "target": 5, "days": 14, "description": "Log all 5 trackers for 14 consecutive days"}', '👑'),
(41, 5, 41, 'Summit Approach', 'Walk 10,000 steps for 5 consecutive days.', 'steps', 70, '{"metric": "steps", "target": 10000, "days": 5, "description": "Walk 10,000+ steps for 5 days in a row"}', '🥾'),
(42, 5, 42, 'Ocean Drinker', 'Drink 3L of water for 10 consecutive days.', 'water', 75, '{"metric": "water_ml", "target": 3, "days": 10, "description": "Drink 3L of water for 10 days in a row"}', '🌊'),
(43, 5, 43, 'Iron Chef', 'Log 3 meals a day for 14 consecutive days.', 'nutrition', 80, '{"metric": "meals", "target": 3, "days": 14, "description": "Log 3 meals per day for 14 consecutive days"}', '👨‍🍳'),
(44, 5, 44, 'Dream Master', 'Log 8+ hours sleep for 10 consecutive days.', 'sleep', 75, '{"metric": "sleep_quality", "target": 8, "days": 10, "description": "Log 8+ hours sleep for 10 consecutive days"}', '✨'),
(45, 5, 45, 'Summit Gate', 'XP checkpoint — the peak is near!', 'checkpoint', 125, '{"metric": "xp_total", "target": 1500, "description": "Earn 1,500 total XP"}', '🏁'),
(46, 5, 46, '21-Day Legend', 'Maintain a 21-day logging streak.', 'habit', 100, '{"metric": "streak", "target": 21, "description": "Maintain a 21-day logging streak"}', '🌟'),
(47, 5, 47, 'Marathon Walker', 'Walk 10,000+ steps for 10 consecutive days.', 'steps', 90, '{"metric": "steps", "target": 10000, "days": 10, "description": "Walk 10,000+ steps for 10 days in a row"}', '🏃‍♂️'),
(48, 5, 48, 'Perfect Month', 'Log weight for 30 days total.', 'weight', 100, '{"metric": "weight_log", "target": 1, "days": 30, "description": "Log your weight 30 times total"}', '📅'),
(49, 5, 49, '30-Day Master', 'Maintain a 30-day logging streak.', 'habit', 150, '{"metric": "streak", "target": 30, "description": "Maintain a 30-day logging streak"}', '💎'),
(50, 5, 50, 'Summit Champion', 'BOSS: 21-day streak with all trackers at max targets.', 'boss', 300, '{"metric": "multi_streak", "target": 5, "days": 21, "description": "Log all 5 trackers for 21 consecutive days"}', '🏆')
on conflict (id) do update set
  world_id = excluded.world_id,
  order_index = excluded.order_index,
  title = excluded.title,
  description = excluded.description,
  type = excluded.type,
  xp_reward = excluded.xp_reward,
  requirement = excluded.requirement,
  icon = excluded.icon;
