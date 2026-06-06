-- ============================================================================
-- MEAL PLANNER SETUP MIGRATIONS
-- Run these in your Supabase SQL editor to create tables for the meal planner
-- ============================================================================

-- 1. USER_SETTINGS TABLE
-- Stores user meal planner preferences (spice level, protein preferences, etc.)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spice_level TEXT DEFAULT 'any' CHECK (spice_level IN ('low', 'medium', 'high', 'any')),
  protein_preferences JSONB DEFAULT '["chicken", "beef", "fish", "pork", "ground_beef", "ground_chicken", "ground_pork", "ground_turkey", "vegetarian", "eggs"]'::jsonb,
  meal_frequency TEXT DEFAULT '3_meals' CHECK (meal_frequency IN ('2_plus_snacks', '3_meals', '4_meals', '3_plus_snack')),
  variety_level TEXT DEFAULT 'some_repeat' CHECK (variety_level IN ('same_daily', 'some_repeat', 'always_different')),
  include_shakes BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. MEAL_PLANS TABLE
-- Stores daily meal plans (breakfast, lunch, dinner, snack)
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  meals JSONB NOT NULL,
  total_calories INT,
  total_protein INT,
  total_carbs INT,
  total_fat INT,
  accuracy_score INT,
  locked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

-- 3. EXTEND MEAL_LOGS TABLE
-- Add columns to track meal plan origin and confirmation status
ALTER TABLE meal_logs
  ADD COLUMN IF NOT EXISTS meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', NULL)),
  ADD COLUMN IF NOT EXISTS meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'manual' CHECK (plan_status IN ('manual', 'from_plan')),
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP;

-- 4. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_date ON meal_plans(plan_date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_date ON meal_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON meal_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_meal_logs_plan_id ON meal_logs(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_status ON meal_logs(plan_status);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR USER_SETTINGS
-- Users can only view/edit their own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- 7. RLS POLICIES FOR MEAL_PLANS
-- Users can only view/edit their own meal plans
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" ON meal_plans
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" ON meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- 8. CREATE OR REPLACE FUNCTIONS FOR AUTO-TIMESTAMPS
-- Update updated_at timestamp on user_settings
CREATE OR REPLACE FUNCTION update_user_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_timestamp
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_user_settings_timestamp();

-- Update updated_at timestamp on meal_plans
CREATE OR REPLACE FUNCTION update_meal_plans_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meal_plans_timestamp
BEFORE UPDATE ON meal_plans
FOR EACH ROW
EXECUTE FUNCTION update_meal_plans_timestamp();

-- ============================================================================
-- Optional: Check if tables exist (debugging)
-- SELECT * FROM user_settings LIMIT 1;
-- SELECT * FROM meal_plans LIMIT 1;
-- ============================================================================
