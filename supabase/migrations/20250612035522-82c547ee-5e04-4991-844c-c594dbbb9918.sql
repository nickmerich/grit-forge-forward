
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('health', 'career', 'relationships', 'skills', 'finance', 'personal')),
  description TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  deadline DATE NOT NULL,
  signature TEXT,
  is_active BOOLEAN DEFAULT true,
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  daily_streak INTEGER DEFAULT 0,
  completed_days INTEGER DEFAULT 0,
  total_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily coaching table
CREATE TABLE public.daily_coaching (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  affirmation TEXT NOT NULL,
  action_step TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(goal_id, date)
);

-- Create progress logs table
CREATE TABLE public.progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create growth points table
CREATE TABLE public.growth_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_points INTEGER DEFAULT 0,
  earned_points INTEGER DEFAULT 0,
  spent_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  daily_bonus INTEGER DEFAULT 25,
  streak_bonus INTEGER DEFAULT 50,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  category TEXT NOT NULL,
  brand_partner TEXT,
  image_url TEXT,
  external_id TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create redemptions table
CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'fulfilled', 'cancelled')),
  tracking_code TEXT,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_coaching ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily coaching
CREATE POLICY "Users can view their own coaching" ON public.daily_coaching
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own coaching" ON public.daily_coaching
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own coaching" ON public.daily_coaching
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for progress logs
CREATE POLICY "Users can view their own progress" ON public.progress_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON public.progress_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.progress_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for growth points
CREATE POLICY "Users can view their own points" ON public.growth_points
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own points" ON public.growth_points
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own points" ON public.growth_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for rewards (public read)
CREATE POLICY "Anyone can view available rewards" ON public.rewards
  FOR SELECT USING (available = true);

-- Create RLS policies for redemptions
CREATE POLICY "Users can view their own redemptions" ON public.redemptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own redemptions" ON public.redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.growth_points (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample rewards
INSERT INTO public.rewards (title, description, points_cost, category, brand_partner, available) VALUES
('NIKE AIR ZOOM', 'Premium running shoes for your fitness journey', 2500, 'fitness', 'Nike', true),
('STARBUCKS $25', 'Fuel your mornings with premium coffee', 500, 'food', 'Starbucks', true),
('APPLE AIRPODS', 'Wireless earbuds for your daily motivation', 3000, 'tech', 'Apple', true),
('AMAZON $50', 'Get anything you need for your goals', 1000, 'shopping', 'Amazon', true),
('NETFLIX 3 MONTHS', 'Entertainment for your well-deserved rest', 750, 'entertainment', 'Netflix', true),
('FITBIT CHARGE', 'Track your progress with premium wearable', 4000, 'fitness', 'Fitbit', false);
