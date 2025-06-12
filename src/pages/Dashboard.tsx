
import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useSubscription } from '@/hooks/useSubscription';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import BrutalistProgressBar from '@/components/BrutalistProgressBar';

const Dashboard = () => {
  const { currentGoal, todaysCoaching, growthPoints, updateGoalProgress } = useSupabaseGoalStore();
  const { isPremium } = useSubscription();

  const handleToggleProgress = () => {
    if (todaysCoaching) {
      updateGoalProgress(!todaysCoaching.completed);
    }
  };

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">GRYT DASHBOARD</h1>
        <div className="flex justify-center items-center space-x-4">
          <div className="text-center">
            <p className="font-bold">{growthPoints?.total || 0} POINTS</p>
            <p className="text-sm">Level {growthPoints?.level || 1}</p>
          </div>
          {isPremium && (
            <div className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-sm">
              PRO ⭐
            </div>
          )}
        </div>
      </div>

      <div className="brutalist-section space-y-6">
        {!isPremium && (
          <BrutalistCard>
            <div className="text-center">
              <h2 className="brutalist-h2 mb-4">UNLOCK YOUR POTENTIAL</h2>
              <p className="mb-4">Upgrade to GRYT Pro for advanced features:</p>
              <ul className="text-left mb-6 space-y-1">
                <li>🧠 Advanced AI Coach</li>
                <li>🎯 Multi-Goal Tracking</li>
                <li>📊 Analytics Dashboard</li>
                <li>🏆 Exclusive Rewards</li>
              </ul>
              <Link to="/premium">
                <BrutalistButton variant="accent" className="w-full">
                  UPGRADE TO PRO - $9.99/MONTH
                </BrutalistButton>
              </Link>
            </div>
          </BrutalistCard>
        )}

        {currentGoal ? (
          <>
            <BrutalistCard>
              <h2 className="brutalist-h2 mb-4">YOUR CURRENT GOAL</h2>
              <h3 className="font-bold text-lg mb-2">{currentGoal.title}</h3>
              <BrutalistProgressBar progress={currentGoal.progress} className="mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-bold">STREAK: {currentGoal.dailyStreak} days</p>
                  <p className="font-bold">PROGRESS: {Math.round(currentGoal.progress)}%</p>
                </div>
                <div>
                  <p className="font-bold">COMPLETED: {currentGoal.completedDays} days</p>
                  <p className="font-bold">TOTAL: {currentGoal.totalDays} days</p>
                </div>
              </div>
            </BrutalistCard>

            {todaysCoaching && (
              <BrutalistCard>
                <h2 className="brutalist-h2 mb-4">TODAY'S COACHING</h2>
                <div className="mb-4">
                  <h3 className="font-bold mb-2">DAILY AFFIRMATION</h3>
                  <p className="italic">{todaysCoaching.affirmation}</p>
                </div>
                <div className="mb-6">
                  <h3 className="font-bold mb-2">ACTION STEP</h3>
                  <p>{todaysCoaching.actionStep}</p>
                </div>
                <BrutalistButton
                  onClick={handleToggleProgress}
                  variant={todaysCoaching.completed ? 'secondary' : 'accent'}
                  className="w-full"
                >
                  {todaysCoaching.completed ? 'COMPLETED ✓' : 'MARK COMPLETE'}
                </BrutalistButton>
              </BrutalistCard>
            )}
          </>
        ) : (
          <BrutalistCard>
            <div className="text-center">
              <h2 className="brutalist-h2 mb-4">START YOUR JOURNEY</h2>
              <p className="mb-6">Create your first goal and begin transforming your life!</p>
              <Link to="/create-goal">
                <BrutalistButton variant="accent" className="w-full">
                  CREATE YOUR FIRST GOAL
                </BrutalistButton>
              </Link>
            </div>
          </BrutalistCard>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Link to="/content">
            <BrutalistCard>
              <div className="text-center">
                <span className="text-2xl mb-2 block">📚</span>
                <h3 className="font-bold">CONTENT</h3>
                <p className="text-sm">Courses & Guides</p>
              </div>
            </BrutalistCard>
          </Link>

          <Link to="/coaching">
            <BrutalistCard>
              <div className="text-center">
                <span className="text-2xl mb-2 block">👨‍🏫</span>
                <h3 className="font-bold">COACHING</h3>
                <p className="text-sm">1:1 Sessions</p>
                {!isPremium && (
                  <span className="text-xs bg-yellow-400 text-black px-1 rounded">PRO</span>
                )}
              </div>
            </BrutalistCard>
          </Link>
        </div>
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

export default Dashboard;
