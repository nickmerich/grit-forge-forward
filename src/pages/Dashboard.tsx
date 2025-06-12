
import React from 'react';
import { useGoalStore } from '@/hooks/useGoalStore';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistProgressBar from '@/components/BrutalistProgressBar';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import { DAILY_AFFIRMATIONS } from '@/types/gryt';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, currentGoal, todaysCoaching, updateGoalProgress } = useGoalStore();
  const navigate = useNavigate();

  if (!currentGoal) {
    return (
      <div className="brutalist-container">
        <div className="brutalist-header">
          <h1 className="brutalist-h1 text-center">GRYT</h1>
          <p className="text-center text-lg font-bold mt-2">BECOME THE BEST VERSION OF YOU</p>
        </div>

        <div className="brutalist-section text-center space-y-6">
          <BrutalistCard>
            <h2 className="brutalist-h2 mb-4">NO ACTIVE GOAL</h2>
            <p className="font-bold mb-6">
              EVERY LEGEND STARTS WITH A SINGLE DECISION.
              <br />
              WHAT'S YOURS?
            </p>
            <BrutalistButton onClick={() => navigate('/create-goal')}>
              SET YOUR GOAL
            </BrutalistButton>
          </BrutalistCard>
        </div>

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
  }

  const daysLeft = Math.ceil((currentGoal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const todaysAffirmation = DAILY_AFFIRMATIONS[Math.floor(Math.random() * DAILY_AFFIRMATIONS.length)];

  return (
    <div className="brutalist-container pb-20">
      {/* Header */}
      <div className="brutalist-header">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="brutalist-h1">GRYT</h1>
            <p className="font-bold">LEVEL {user.growthPoints.level}</p>
          </div>
          <div className="text-right">
            <p className="brutalist-h2">{user.growthPoints.total}</p>
            <p className="text-sm font-bold">POINTS</p>
          </div>
        </div>
        
        <BrutalistProgressBar 
          progress={currentGoal.progress} 
          label={`${currentGoal.title} PROGRESS`}
          className="mb-4"
        />
        
        <div className="flex justify-between text-sm font-bold">
          <span>🔥 {currentGoal.dailyStreak} DAY STREAK</span>
          <span>⏰ {daysLeft} DAYS LEFT</span>
        </div>
      </div>

      {/* Daily Affirmation */}
      <div className="brutalist-section">
        <BrutalistCard glow>
          <h2 className="brutalist-h2 mb-4 text-center">TODAY'S POWER</h2>
          <p className="text-center font-bold text-lg leading-relaxed">
            "{todaysAffirmation}"
          </p>
        </BrutalistCard>
      </div>

      {/* Action Step */}
      <div className="brutalist-section">
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">TODAY'S ACTION</h2>
          <p className="font-bold mb-6 text-lg">
            {todaysCoaching.actionStep}
          </p>
          
          <div className="space-y-4">
            {!todaysCoaching.completed ? (
              <BrutalistButton 
                variant="accent" 
                onClick={() => updateGoalProgress(true)}
              >
                ✅ MARK COMPLETE (+{user.growthPoints.dailyBonus} POINTS)
              </BrutalistButton>
            ) : (
              <div className="space-y-4">
                <BrutalistCard className="bg-brutalist-green border-brutalist-black">
                  <p className="brutalist-h2 text-center">✅ COMPLETED TODAY</p>
                  <p className="text-center font-bold">+{user.growthPoints.dailyBonus} POINTS EARNED</p>
                </BrutalistCard>
                <BrutalistButton 
                  variant="secondary" 
                  onClick={() => updateGoalProgress(false)}
                >
                  UNDO COMPLETION
                </BrutalistButton>
              </div>
            )}
          </div>
        </BrutalistCard>
      </div>

      {/* Goal Details */}
      <div className="brutalist-section">
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">YOUR WHY</h2>
          <p className="font-bold mb-4">
            {currentGoal.whyItMatters}
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="brutalist-h2 text-2xl">{currentGoal.completedDays}</p>
              <p className="text-sm font-bold">DAYS DONE</p>
            </div>
            <div>
              <p className="brutalist-h2 text-2xl">{currentGoal.totalDays - currentGoal.completedDays}</p>
              <p className="text-sm font-bold">DAYS LEFT</p>
            </div>
          </div>
        </BrutalistCard>
      </div>

      {/* Quick Actions */}
      <div className="brutalist-section space-y-4">
        <BrutalistButton variant="secondary" onClick={() => navigate('/journal')}>
          📝 DAILY REFLECTION
        </BrutalistButton>
        <BrutalistButton variant="secondary" onClick={() => navigate('/rewards')}>
          🏆 VIEW REWARDS
        </BrutalistButton>
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

export default Dashboard;
