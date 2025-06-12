
import React from 'react';
import BrutalistCard from '@/components/BrutalistCard';
import RewardCard from './RewardCard';

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

interface RewardsListProps {
  rewards: Reward[];
  isPremium: boolean;
  growthPoints: { total: number; spent: number } | null;
  isRedeeming: string | null;
  onRedeem: (rewardId: string, pointsCost: number) => void;
}

const RewardsList = ({ rewards, isPremium, growthPoints, isRedeeming, onRedeem }: RewardsListProps) => {
  const canRedeem = (reward: Reward) => {
    if (reward.is_premium && !isPremium) return false;
    return growthPoints ? growthPoints.total >= reward.points_cost : false;
  };

  if (rewards.length === 0) {
    return (
      <BrutalistCard>
        <div className="text-center py-8">
          <h3 className="font-bold text-lg mb-2">NO REWARDS FOUND</h3>
          <p className="text-gray-600">Try adjusting your filter or check back later!</p>
        </div>
      </BrutalistCard>
    );
  }

  return (
    <div className="space-y-4">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          isPremium={isPremium}
          canRedeem={canRedeem(reward)}
          isRedeeming={isRedeeming === reward.id}
          onRedeem={onRedeem}
        />
      ))}
    </div>
  );
};

export default RewardsList;
