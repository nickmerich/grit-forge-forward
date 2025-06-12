
import React from 'react';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';

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

interface RewardCardProps {
  reward: Reward;
  isPremium: boolean;
  canRedeem: boolean;
  isRedeeming: boolean;
  onRedeem: (rewardId: string, pointsCost: number) => void;
}

const RewardCard = ({ reward, isPremium, canRedeem, isRedeeming, onRedeem }: RewardCardProps) => {
  return (
    <BrutalistCard>
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
              onClick={() => onRedeem(reward.id, reward.points_cost)}
              disabled={!canRedeem || isRedeeming}
              variant={canRedeem ? 'accent' : 'secondary'}
            >
              {isRedeeming ? 'REDEEMING...' : 
               canRedeem ? 'REDEEM' : 'NOT ENOUGH'}
            </BrutalistButton>
          )}
        </div>
      </div>
    </BrutalistCard>
  );
};

export default RewardCard;
