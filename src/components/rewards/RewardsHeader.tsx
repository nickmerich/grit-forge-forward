
import React from 'react';

interface RewardsHeaderProps {
  growthPoints: { total: number; spent: number } | null;
  isPremium: boolean;
}

const RewardsHeader = ({ growthPoints, isPremium }: RewardsHeaderProps) => {
  return (
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
  );
};

export default RewardsHeader;
