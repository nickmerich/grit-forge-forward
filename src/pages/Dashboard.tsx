
import React from 'react';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useAuth } from '@/hooks/useAuth';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistProgressBar from '@/components/BrutalistProgressBar';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import { DAILY_AFFIRMATIONS } from '@/types/gryt';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { signOut } = useAuth();
  const { profile, currentGoal, todaysCoaching, growthPoints, isLoading, updateGoalProgress } = useSupabaseGoalStore();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="brutalist-container">
        <div className="brutalist-header text-center">
          <h1 className="brutalist-h1">GRYT</h1>
          <p className="font-bold">LOADING YOUR DATA...</p>
        </div>
      </div>
    );
  }

  if (!currentGoal) {
    return (
      <div className="brutalist-container">
        <div className="brutalist-header">
          <div className="flex justify-between items-center mb-4">
            <h1 className="brutalist-h1">GRYT</h1>
            <BrutalistButton variant="secondary" onClick={signOut}>
              LOGOUT
            </BrutalistButton>
          </div>
          <p className="text-center text-lg font-bold mt-2">
            WELCOME {profile?.full_name?.toUpperCase() || 'GRYT USER'}
          </p>
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
  const todaysAffirmation = todaysCoaching?.affirmation || DAILY_AFFIRMATIONS[Math.floor(Math.random() * DAILY_AFFIRMATIONS.length)];

  return (
    <div className="brutalist-container pb-20">
      {/* Header */}
      <div className="brutalist-header">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="brutalist-h1">GRYT</h1>
            <p className="font-bold">LEVEL {growthPoints?.level || 1}</p>
          </div>
          <div className="text-right">
            <p className="brutalist-h2">{growthPoints?.total || 0}</p>
            <p className="text-sm font-bold">POINTS</p>
            <BrutalistButton variant="secondary" onClick={signOut} className="mt-2 text-xs">
              LOGOUT
            </BrutalistButton>
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
            {todaysCoaching?.actionStep || "Take one step towards your goal today."}
          </p>
          
          <div className="space-y-4">
            {!todaysCoaching?.completed ? (
              <BrutalistButton 
                variant="accent" 
                onClick={() => updateGoalProgress(true)}
              >
                ✅ MARK COMPLETE (+{growthPoints?.dailyBonus || 25} POINTS)
              </BrutalistButton>
            ) : (
              <div className="space-y-4">
                <BrutalistCard className="bg-brutalist-green border-brutalist-black">
                  <p className="brutalist-h2 text-center">✅ COMPLETED TODAY</p>
                  <p className="text-center font-bold">+{growthPoints?.dailyBonus || 25} POINTS EARNED</p>
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
