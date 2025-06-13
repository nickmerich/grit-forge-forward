
-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  points_earned INTEGER DEFAULT 0
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can create their own achievements" ON public.achievements;

CREATE POLICY "Users can view their own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own achievements" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create goal templates table
CREATE TABLE IF NOT EXISTS public.goal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_duration_days INTEGER,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert goal templates only if table is empty
INSERT INTO public.goal_templates (title, category, description, suggested_duration_days)
SELECT * FROM (VALUES
  ('Run Every Morning', 'health', 'Establish a consistent morning running routine', 30),
  ('Read 20 Minutes Daily', 'personal', 'Build a daily reading habit', 21),
  ('Learn a New Language', 'career', 'Practice language learning for 30 minutes daily', 90),
  ('Meditation Practice', 'health', 'Daily 10-minute meditation sessions', 21),
  ('Drink More Water', 'health', 'Track daily water intake goal', 30),
  ('Exercise 3x Per Week', 'health', 'Consistent workout schedule', 60),
  ('Write Daily Journal', 'personal', 'Reflect and journal every evening', 30),
  ('No Social Media Mornings', 'personal', 'Avoid social media until noon', 21)
) AS v(title, category, description, suggested_duration_days)
WHERE NOT EXISTS (SELECT 1 FROM public.goal_templates);

-- Make goal templates publicly readable
ALTER TABLE public.goal_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can view goal templates" ON public.goal_templates;
CREATE POLICY "Everyone can view goal templates" ON public.goal_templates FOR SELECT USING (true);

-- Add missing columns to existing tables safely
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Add user preferences to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_reminder_time TIME DEFAULT '09:00';

-- Update reflections table to include more fields
ALTER TABLE public.reflections ADD COLUMN IF NOT EXISTS achievements_today TEXT[];
ALTER TABLE public.reflections ADD COLUMN IF NOT EXISTS challenges_faced TEXT;
ALTER TABLE public.reflections ADD COLUMN IF NOT EXISTS lessons_learned TEXT;
