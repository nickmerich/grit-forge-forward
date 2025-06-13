
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description?: string;
  icon?: string;
  unlocked_at: string;
  points_earned: number;
  goal_id?: string;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (achievementData: {
    type: string;
    title: string;
    description?: string;
    icon?: string;
    points_earned?: number;
    goal_id?: string;
  }) => {
    if (!user) return;

    try {
      // Check if achievement already exists
      const { data: existing } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', achievementData.type)
        .eq('goal_id', achievementData.goal_id || null)
        .single();

      if (existing) return; // Achievement already unlocked

      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          ...achievementData,
          points_earned: achievementData.points_earned || 0
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAchievements(prev => [data, ...prev]);
        
        // Create notification for new achievement
        await createNotification({
          title: '🏆 Achievement Unlocked!',
          message: `You earned: ${achievementData.title}`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const checkStreakAchievements = (streak: number) => {
    const streakMilestones = [3, 7, 14, 30, 60, 100];
    
    streakMilestones.forEach(milestone => {
      if (streak === milestone) {
        unlockAchievement({
          type: 'streak',
          title: `${milestone} Day Streak`,
          description: `Maintained a ${milestone} day streak!`,
          icon: '🔥',
          points_earned: milestone * 10
        });
      }
    });
  };

  const checkGoalAchievements = (goalProgress: number, goalId: string) => {
    const progressMilestones = [25, 50, 75, 100];
    
    progressMilestones.forEach(milestone => {
      if (Math.floor(goalProgress) === milestone) {
        unlockAchievement({
          type: 'progress',
          title: `${milestone}% Complete`,
          description: `Reached ${milestone}% progress on your goal!`,
          icon: milestone === 100 ? '🎯' : '📈',
          points_earned: milestone === 100 ? 500 : milestone * 2,
          goal_id: goalId
        });
      }
    });
  };

  return {
    achievements,
    loading,
    unlockAchievement,
    checkStreakAchievements,
    checkGoalAchievements,
    fetchAchievements
  };
};
