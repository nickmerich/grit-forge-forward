
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useSubscription } from '@/hooks/useSubscription';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import { useToast } from '@/hooks/use-toast';
import RewardsHeader from '@/components/rewards/RewardsHeader';
import RewardFilters from '@/components/rewards/RewardFilters';
import RewardsList from '@/components/rewards/RewardsList';

interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  category: string;
  brand_partner: string | null;
  image_url: string | null;
  available: boolean;
  is_premium: boolean | null;
}

const Rewards = () => {
  const { growthPoints } = useSupabaseGoalStore();
  const { isPremium } = useSubscription();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('available', true)
        .order('points_cost', { ascending: true });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const redeemReward = async (rewardId: string, pointsCost: number) => {
    if (!growthPoints || growthPoints.total < pointsCost) {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points for this reward.",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(rewardId);
    try {
      const { error } = await supabase
        .from('redemptions')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          reward_id: rewardId,
          points_spent: pointsCost,
          status: 'processing',
        });

      if (error) throw error;

      const { error: pointsError } = await supabase
        .from('growth_points')
        .update({
          total_points: growthPoints.total - pointsCost,
          spent_points: growthPoints.spent + pointsCost,
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (pointsError) throw pointsError;

      toast({
        title: "Reward Redeemed!",
        description: "Your reward is being processed. Check your email for details.",
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Redemption Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(null);
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (filter === 'free') return !reward.is_premium;
    if (filter === 'premium') return reward.is_premium;
    return true;
  });

  return (
    <div className="brutalist-container pb-20">
      <RewardsHeader growthPoints={growthPoints} isPremium={isPremium} />

      <div className="brutalist-section">
        <RewardFilters filter={filter} onFilterChange={setFilter} />
        <RewardsList
          rewards={filteredRewards}
          isPremium={isPremium}
          growthPoints={growthPoints}
          isRedeeming={isRedeeming}
          onRedeem={redeemReward}
        />
      </div>

      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'GOALS', path: '/create-goal', icon: '🎯' },
          { label: 'REWARDS', path: '/rewards', icon: '🏆' },
          { label: 'PRO', path: '/premium', icon: '⭐' }
        ]}
      />
    </div>
  );
};

export default Rewards;
