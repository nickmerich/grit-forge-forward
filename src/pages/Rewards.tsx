
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useSubscription } from '@/hooks/useSubscription';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import { useToast } from '@/hooks/use-toast';

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
      // In a real implementation, this would integrate with reward fulfillment APIs
      // For now, we'll simulate the redemption
      const { error } = await supabase
        .from('redemptions')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          reward_id: rewardId,
          points_spent: pointsCost,
          status: 'processing',
        });

      if (error) throw error;

      // Update user's growth points
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

  const canRedeem = (reward: Reward) => {
    if (reward.is_premium && !isPremium) return false;
    return growthPoints ? growthPoints.total >= reward.points_cost : false;
  };

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">REWARDS STORE</h1>
        <div className="text-center">
          <p className="font-bold text-lg">
            YOUR POINTS: {growthPoints?.total || 0} 🏆
          </p>
          {!isPremium && (
            <p className="text-sm text-gray-600 mt-2">
              Upgrade to Pro for exclusive rewards!
            </p>
          )}
        </div>
      </div>

      <div className="brutalist-section">
        <div className="flex space-x-2 mb-6">
          <BrutalistButton
            variant={filter === 'all' ? 'default' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            ALL
          </BrutalistButton>
          <BrutalistButton
            variant={filter === 'free' ? 'default' : 'secondary'}
            onClick={() => setFilter('free')}
          >
            FREE
          </BrutalistButton>
          <BrutalistButton
            variant={filter === 'premium' ? 'default' : 'secondary'}
            onClick={() => setFilter('premium')}
          >
            PRO ⭐
          </BrutalistButton>
        </div>

        <div className="space-y-4">
          {filteredRewards.map((reward) => (
            <BrutalistCard key={reward.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-lg">{reward.title}</h3>
                    {reward.is_premium && (
                      <span className="bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{reward.description}</p>
                  {reward.brand_partner && (
                    <p className="text-sm font-bold text-gray-600">
                      Partner: {reward.brand_partner}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-xl mb-2">{reward.points_cost} pts</p>
                  
                  {reward.is_premium && !isPremium ? (
                    <BrutalistButton variant="secondary" disabled>
                      PRO ONLY
                    </BrutalistButton>
                  ) : (
                    <BrutalistButton
                      onClick={() => redeemReward(reward.id, reward.points_cost)}
                      disabled={!canRedeem(reward) || isRedeeming === reward.id}
                      variant={canRedeem(reward) ? 'accent' : 'secondary'}
                    >
                      {isRedeeming === reward.id ? 'REDEEMING...' : 
                       canRedeem(reward) ? 'REDEEM' : 'NOT ENOUGH'}
                    </BrutalistButton>
                  )}
                </div>
              </div>
            </BrutalistCard>
          ))}
        </div>

        {filteredRewards.length === 0 && (
          <BrutalistCard>
            <div className="text-center py-8">
              <h3 className="font-bold text-lg mb-2">NO REWARDS FOUND</h3>
              <p className="text-gray-600">Try adjusting your filter or check back later!</p>
            </div>
          </BrutalistCard>
        )}
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
