
import React from 'react';
import { useGoalStore } from '@/hooks/useGoalStore';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import { Reward } from '@/types/gryt';

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'NIKE AIR ZOOM',
    description: 'Premium running shoes for your fitness journey',
    pointsCost: 2500,
    category: 'fitness',
    available: true
  },
  {
    id: '2',
    title: 'STARBUCKS $25',
    description: 'Fuel your mornings with premium coffee',
    pointsCost: 500,
    category: 'food',
    available: true
  },
  {
    id: '3',
    title: 'APPLE AIRPODS',
    description: 'Wireless earbuds for your daily motivation',
    pointsCost: 3000,
    category: 'tech',
    available: true
  },
  {
    id: '4',
    title: 'AMAZON $50',
    description: 'Get anything you need for your goals',
    pointsCost: 1000,
    category: 'shopping',
    available: true
  },
  {
    id: '5',
    title: 'NETFLIX 3 MONTHS',
    description: 'Entertainment for your well-deserved rest',
    pointsCost: 750,
    category: 'entertainment',
    available: true
  },
  {
    id: '6',
    title: 'FITBIT CHARGE',
    description: 'Track your progress with premium wearable',
    pointsCost: 4000,
    category: 'fitness',
    available: false
  }
];

const Rewards = () => {
  const { user } = useGoalStore();

  const canAfford = (cost: number) => user.growthPoints.total >= cost;

  const handleRedeem = (reward: Reward) => {
    if (canAfford(reward.pointsCost)) {
      // TODO: Implement redemption logic
      console.log(`Redeeming ${reward.title} for ${reward.pointsCost} points`);
    }
  };

  return (
    <div className="brutalist-container pb-20">
      {/* Header */}
      <div className="brutalist-header">
        <div className="text-center space-y-2">
          <h1 className="brutalist-h1">REWARDS</h1>
          <p className="font-bold">EARN YOUR SUCCESS</p>
          <div className="mt-4">
            <p className="brutalist-h2 text-3xl text-brutalist-green">{user.growthPoints.total}</p>
            <p className="font-bold">GROWTH POINTS AVAILABLE</p>
          </div>
        </div>
      </div>

      {/* Points Earning Info */}
      <div className="brutalist-section">
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4 text-center">EARN MORE POINTS</h2>
          <div className="space-y-3 font-bold">
            <div className="flex justify-between items-center">
              <span>📅 Daily Completion</span>
              <span className="text-brutalist-green">+{user.growthPoints.dailyBonus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🔥 Weekly Streak</span>
              <span className="text-brutalist-green">+{user.growthPoints.streakBonus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🏆 Goal Completion</span>
              <span className="text-brutalist-green">+500-2000</span>
            </div>
          </div>
        </BrutalistCard>
      </div>

      {/* Available Rewards */}
      <div className="brutalist-section">
        <h2 className="brutalist-h2 mb-6 text-center">AVAILABLE REWARDS</h2>
        <div className="space-y-4">
          {mockRewards.filter(r => r.available).map((reward) => (
            <BrutalistCard key={reward.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="brutalist-h2 text-lg mb-2">{reward.title}</h3>
                  <p className="font-bold text-sm mb-3">{reward.description}</p>
                  <p className="brutalist-h2 text-brutalist-green">
                    {reward.pointsCost} POINTS
                  </p>
                </div>
                <div className="ml-4">
                  {reward.category === 'fitness' && '🏃‍♂️'}
                  {reward.category === 'food' && '☕'}
                  {reward.category === 'tech' && '🎧'}
                  {reward.category === 'shopping' && '🛍️'}
                  {reward.category === 'entertainment' && '📺'}
                </div>
              </div>
              
              <BrutalistButton
                variant={canAfford(reward.pointsCost) ? 'accent' : 'secondary'}
                disabled={!canAfford(reward.pointsCost)}
                onClick={() => handleRedeem(reward)}
              >
                {canAfford(reward.pointsCost) ? '🔥 REDEEM NOW' : '💪 KEEP GRINDING'}
              </BrutalistButton>
            </BrutalistCard>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="brutalist-section">
        <h2 className="brutalist-h2 mb-6 text-center">COMING SOON</h2>
        <div className="space-y-4">
          {mockRewards.filter(r => !r.available).map((reward) => (
            <BrutalistCard key={reward.id} className="opacity-75">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="brutalist-h2 text-lg mb-2">{reward.title}</h3>
                  <p className="font-bold text-sm mb-3">{reward.description}</p>
                  <p className="brutalist-h2">
                    {reward.pointsCost} POINTS
                  </p>
                </div>
                <div className="ml-4">🔒</div>
              </div>
              
              <BrutalistButton variant="secondary" disabled>
                COMING SOON
              </BrutalistButton>
            </BrutalistCard>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'GOALS', path: '/create-goal', icon: '🎯' },
          { label: 'REWARDS', path: '/rewards', icon: '🏆' },
          { label: 'PROFILE', path: '/profile', icon: '👤' }
        ]}
      />
    </div>
  );
};

export default Rewards;
