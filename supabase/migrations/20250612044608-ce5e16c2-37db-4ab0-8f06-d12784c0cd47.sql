
-- Create subscriptions table for Premium GRYT Pro
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_type TEXT NOT NULL DEFAULT 'free',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create coaching_sessions table for solo coaching services
CREATE TABLE public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled',
  session_notes TEXT,
  zoom_link TEXT,
  booking_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create content_purchases table for premium content
CREATE TABLE public.content_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  price_paid INTEGER NOT NULL,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  access_expires_at TIMESTAMPTZ
);

-- Create premium_content table
CREATE TABLE public.premium_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL,
  price INTEGER NOT NULL,
  file_url TEXT,
  preview_content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_goals table for multi-goal tracking (premium feature)
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  target_date DATE,
  progress NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reflections table for journaling feature
CREATE TABLE public.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  reflection_text TEXT,
  gratitude_note TEXT,
  tomorrow_intention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add premium columns to existing tables
ALTER TABLE public.profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE public.rewards ADD COLUMN is_premium BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can manage subscriptions" ON public.subscriptions
FOR ALL USING (true);

-- RLS policies for coaching sessions
CREATE POLICY "Users can view own coaching sessions" ON public.coaching_sessions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own coaching sessions" ON public.coaching_sessions
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS policies for content purchases
CREATE POLICY "Users can view own content purchases" ON public.content_purchases
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own content purchases" ON public.content_purchases
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS policies for premium content (public read)
CREATE POLICY "Anyone can view premium content" ON public.premium_content
FOR SELECT USING (true);

-- RLS policies for user goals
CREATE POLICY "Users can manage own goals" ON public.user_goals
FOR ALL USING (user_id = auth.uid());

-- RLS policies for reflections
CREATE POLICY "Users can manage own reflections" ON public.reflections
FOR ALL USING (user_id = auth.uid());

-- Insert sample premium content
INSERT INTO public.premium_content (title, description, content_type, price) VALUES
('Goal-Setting Masterclass', 'Comprehensive video course on the GRYT method for achieving any goal', 'course', 9700),
('Career Advancement Guide', 'Step-by-step guide to accelerate your career growth', 'guide', 2900),
('Fitness Goal Templates', 'Ready-to-use templates for fitness and health goals', 'template', 1900),
('Success Planning Workbook', 'Printable journal and planning tools for goal achievement', 'workbook', 3900);

-- Insert sample premium rewards
INSERT INTO public.rewards (title, description, points_cost, category, is_premium) VALUES
('Netflix Premium - 1 Month', 'One month of Netflix premium subscription', 1200, 'digital', true),
('Spotify Premium - 3 Months', 'Three months of Spotify premium access', 2500, 'digital', true),
('Steam Gift Card - $50', '$50 Steam gift card for gaming purchases', 4000, 'digital', true),
('Uber Credits - $25', '$25 in Uber ride credits', 2000, 'digital', true);

-- Update growth_points for new premium bonuses
ALTER TABLE public.growth_points ADD COLUMN premium_multiplier NUMERIC DEFAULT 1.0;
