
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoalStore } from '@/hooks/useGoalStore';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';

const ContractCeremony = () => {
  const navigate = useNavigate();
  const { currentGoal } = useGoalStore();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (currentGoal) {
      setShowCelebration(true);
    }
  }, [currentGoal]);

  if (!currentGoal) {
    navigate('/create-goal');
    return null;
  }

  const daysToComplete = Math.ceil((currentGoal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="brutalist-container">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brutalist-black text-brutalist-white">
          <div className="text-center animate-brutalist-pulse">
            <h1 className="brutalist-h1 text-6xl mb-4">🔥</h1>
            <h2 className="brutalist-h2 text-4xl mb-4">CONTRACT</h2>
            <h2 className="brutalist-h2 text-4xl mb-4">SIGNED</h2>
            <p className="font-bold text-xl">THE JOURNEY BEGINS NOW</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">COMMITMENT CEREMONY</h1>
        <p className="text-center font-bold mt-2">YOUR TRANSFORMATION STARTS TODAY</p>
      </div>

      <div className="brutalist-section space-y-6">
        {/* Contract Display */}
        <BrutalistCard glow>
          <div className="text-center space-y-4">
            <h2 className="brutalist-h2">OFFICIAL GRYT CONTRACT</h2>
            
            <div className="border-4 border-brutalist-black p-6 bg-brutalist-white">
              <p className="font-bold mb-4">
                I, <span className="brutalist-h2">{currentGoal.signature}</span>, HEREBY COMMIT TO:
              </p>
              
              <h3 className="brutalist-h2 mb-4">{currentGoal.title}</h3>
              
              <p className="font-bold mb-4">{currentGoal.description}</p>
              
              <div className="space-y-2 mb-4">
                <p className="font-bold">🎯 CATEGORY: {currentGoal.category.toUpperCase()}</p>
                <p className="font-bold">⏰ DEADLINE: {currentGoal.deadline.toLocaleDateString()}</p>
                <p className="font-bold">📅 DURATION: {daysToComplete} DAYS</p>
                <p className="font-bold">📝 SIGNED: {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="border-t-4 border-brutalist-black pt-4">
                <p className="font-bold text-sm">WHY THIS MATTERS:</p>
                <p className="italic font-bold mt-2">{currentGoal.whyItMatters}</p>
              </div>
            </div>
          </div>
        </BrutalistCard>

        {/* Commitment Pledge */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4 text-center">THE GRYT PLEDGE</h2>
          <div className="space-y-3 font-bold">
            <p>✊ I WILL SHOW UP EVERY DAY</p>
            <p>🔥 I WILL PUSH THROUGH RESISTANCE</p>
            <p>💪 I WILL HONOR MY COMMITMENT</p>
            <p>🏆 I WILL BECOME WHO I'M MEANT TO BE</p>
            <p>⚡ I WILL DEVELOP UNBREAKABLE GRYT</p>
          </div>
        </BrutalistCard>

        {/* Action Steps */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4 text-center">WHAT HAPPENS NEXT</h2>
          <div className="space-y-4 font-bold">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">📱</span>
              <p>Daily coaching and action steps</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">📊</span>
              <p>Real-time progress tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🏆</span>
              <p>Growth Points for every completed day</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🎁</span>
              <p>Real rewards for your achievements</p>
            </div>
          </div>
        </BrutalistCard>

        {/* Start Journey */}
        <div className="space-y-4">
          <BrutalistButton 
            variant="accent" 
            onClick={() => {
              setShowCelebration(false);
              setTimeout(() => navigate('/'), 500);
            }}
          >
            🚀 START MY JOURNEY
          </BrutalistButton>
          
          <BrutalistButton 
            variant="secondary" 
            onClick={() => navigate('/create-goal')}
          >
            📝 CREATE ANOTHER GOAL
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
};

export default ContractCeremony;
