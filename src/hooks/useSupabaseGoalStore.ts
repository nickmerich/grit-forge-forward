
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Goal, DailyCoaching, GrowthPoints } from '@/types/gryt';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseGoalStore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [todaysCoaching, setTodaysCoaching] = useState<DailyCoaching | null>(null);
  const [growthPoints, setGrowthPoints] = useState<GrowthPoints | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setProfile(null);
      setCurrentGoal(null);
      setTodaysCoaching(null);
      setGrowthPoints(null);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch growth points
      const { data: pointsData } = await supabase
        .from('growth_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (pointsData) {
        setGrowthPoints({
          total: pointsData.total_points,
          earned: pointsData.earned_points,
          spent: pointsData.spent_points,
          level: pointsData.current_level,
          dailyBonus: pointsData.daily_bonus,
          streakBonus: pointsData.streak_bonus,
        });
      }

      // Fetch active goal
      const { data: goalData } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (goalData && goalData.length > 0) {
        const goal = goalData[0];
        const formattedGoal: Goal = {
          id: goal.id,
          title: goal.title,
          category: goal.category as Goal['category'],
          description: goal.description,
          whyItMatters: goal.why_it_matters,
          deadline: new Date(goal.deadline),
          createdAt: new Date(goal.created_at),
          isActive: goal.is_active,
          progress: Number(goal.progress),
          dailyStreak: goal.daily_streak,
          completedDays: goal.completed_days,
          totalDays: goal.total_days,
          signature: goal.signature,
        };
        setCurrentGoal(formattedGoal);

        // Fetch today's coaching for this goal
        const today = new Date().toISOString().split('T')[0];
        const { data: coachingData } = await supabase
          .from('daily_coaching')
          .select('*')
          .eq('goal_id', goal.id)
          .eq('date', today)
          .single();

        if (coachingData) {
          const coaching: DailyCoaching = {
            id: coachingData.id,
            goalId: coachingData.goal_id,
            date: new Date(coachingData.date),
            affirmation: coachingData.affirmation,
            actionStep: coachingData.action_step,
            completed: coachingData.completed,
            reflection: coachingData.reflection,
            mood: coachingData.mood_score,
          };
          setTodaysCoaching(coaching);
        } else {
          // Generate today's coaching if it doesn't exist
          await generateTodaysCoaching(goal.id);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTodaysCoaching = async (goalId: string) => {
    if (!user || !currentGoal) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // For now, use sample affirmations and action steps
      const affirmations = [
        "I am becoming stronger and more disciplined with every step I take.",
        "Every small action today builds the future I desire.",
        "I have the power to create lasting change in my life.",
        "My commitment to this goal reflects my commitment to myself.",
        "Progress, not perfection, is my path to transformation.",
      ];
      
      const actionSteps = [
        "Take 5 minutes to visualize your success today.",
        "Write down one thing you're grateful for in your journey.",
        "Complete your main task before checking any notifications.",
        "Share your progress with someone who supports you.",
        "Reflect on how far you've come since starting.",
      ];

      const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      const actionStep = actionSteps[Math.floor(Math.random() * actionSteps.length)];

      const { data, error } = await supabase
        .from('daily_coaching')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          date: today,
          affirmation,
          action_step: actionStep,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const coaching: DailyCoaching = {
          id: data.id,
          goalId: data.goal_id,
          date: new Date(data.date),
          affirmation: data.affirmation,
          actionStep: data.action_step,
          completed: data.completed,
          reflection: data.reflection,
          mood: data.mood_score,
        };
        setTodaysCoaching(coaching);
      }
    } catch (error) {
      console.error('Error generating coaching:', error);
    }
  };

  const updateGoalProgress = async (completed: boolean) => {
    if (!user || !currentGoal || !todaysCoaching) return;

    try {
      // Update coaching completion
      const { error: coachingError } = await supabase
        .from('daily_coaching')
        .update({ completed })
        .eq('id', todaysCoaching.id);

      if (coachingError) throw coachingError;

      // Calculate new progress
      const progressChange = 100 / currentGoal.totalDays;
      const newProgress = completed 
        ? Math.min(100, currentGoal.progress + progressChange)
        : Math.max(0, currentGoal.progress - progressChange);
      
      const newCompletedDays = completed 
        ? currentGoal.completedDays + 1 
        : Math.max(0, currentGoal.completedDays - 1);
      
      const newStreak = completed 
        ? currentGoal.dailyStreak + 1 
        : 0;

      // Update goal
      const { error: goalError } = await supabase
        .from('goals')
        .update({
          progress: newProgress,
          completed_days: newCompletedDays,
          daily_streak: newStreak,
        })
        .eq('id', currentGoal.id);

      if (goalError) throw goalError;

      // Update growth points if completed
      if (completed && !todaysCoaching.completed && growthPoints) {
        const pointsEarned = growthPoints.dailyBonus + 
          (newStreak % 7 === 0 ? growthPoints.streakBonus : 0);
        
        const { error: pointsError } = await supabase
          .from('growth_points')
          .update({
            total_points: growthPoints.total + pointsEarned,
            earned_points: growthPoints.earned + pointsEarned,
          })
          .eq('user_id', user.id);

        if (pointsError) throw pointsError;

        setGrowthPoints({
          ...growthPoints,
          total: growthPoints.total + pointsEarned,
          earned: growthPoints.earned + pointsEarned,
        });

        toast({
          title: "Points Earned!",
          description: `+${pointsEarned} points for completing today's action!`,
        });
      }

      // Update local state
      setCurrentGoal({
        ...currentGoal,
        progress: newProgress,
        completedDays: newCompletedDays,
        dailyStreak: newStreak,
      });

      setTodaysCoaching({
        ...todaysCoaching,
        completed,
      });

    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'isActive' | 'progress' | 'dailyStreak' | 'completedDays' | 'totalDays'>) => {
    if (!user) return null;

    try {
      const totalDays = Math.ceil(
        (goalData.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          category: goalData.category,
          description: goalData.description,
          why_it_matters: goalData.whyItMatters,
          deadline: goalData.deadline.toISOString().split('T')[0],
          signature: goalData.signature,
          total_days: totalDays,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newGoal: Goal = {
          id: data.id,
          title: data.title,
          category: data.category as Goal['category'],
          description: data.description,
          whyItMatters: data.why_it_matters,
          deadline: new Date(data.deadline),
          createdAt: new Date(data.created_at),
          isActive: data.is_active,
          progress: Number(data.progress),
          dailyStreak: data.daily_streak,
          completedDays: data.completed_days,
          totalDays: data.total_days,
          signature: data.signature,
        };

        setCurrentGoal(newGoal);
        await generateTodaysCoaching(data.id);
        
        toast({
          title: "Goal Created!",
          description: "Your journey begins now. Let's make it happen!",
        });

        return newGoal;
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
    return null;
  };

  return {
    profile,
    currentGoal,
    todaysCoaching,
    growthPoints,
    isLoading,
    updateGoalProgress,
    createGoal,
    fetchUserData,
  };
};
