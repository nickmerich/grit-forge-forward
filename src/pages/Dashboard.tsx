
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useNotifications } from '@/hooks/useNotifications';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistProgressBar from '@/components/BrutalistProgressBar';
import BrutalistNavigation from '@/components/BrutalistNavigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentGoal, todaysCoaching, growthPoints, updateGoalProgress, isLoading } = useSupabaseGoalStore();
  const { notifications, unreadCount } = useNotifications();

  // Redirect to create goal if no active goal
  useEffect(() => {
    if (!isLoading && !currentGoal) {
      navigate('/create-goal');
    }
  }, [currentGoal, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="brutalist-container">
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-bold">LOADING YOUR GRYT...</div>
        </div>
      </div>
    );
  }

  if (!currentGoal) {
    return null; // Will redirect via useEffect
  }

  const daysLeft = Math.max(0, Math.ceil((currentGoal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercentage = Math.round(currentGoal.progress);

  return (
    <div className="brutalist-container pb-20">
      {/* Header */}
      <div className="brutalist-header">
        <div className="flex justify-between items-center mb-2">
          <h1 className="brutalist-h1">GRYT</h1>
          {unreadCount > 0 && (
            <div className="bg-brutalist-green text-brutalist-black px-2 py-1 rounded font-bold text-sm">
              {unreadCount} NEW
            </div>
          )}
        </div>
        <p className="text-center font-bold">UNLEASH YOUR POTENTIAL</p>
      </div>

      <div className="brutalist-section space-y-6">
        {/* Goal Progress */}
        <BrutalistCard>
          <div className="text-center mb-4">
            <h2 className="brutalist-h2 mb-2">{currentGoal.title}</h2>
            <p className="font-bold text-gray-600">{currentGoal.category.toUpperCase()}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>PROGRESS</span>
              <span>{progressPercentage}%</span>
            </div>
            <BrutalistProgressBar progress={currentGoal.progress} className="h-6" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-brutalist-green">{currentGoal.dailyStreak}</div>
              <div className="font-bold text-xs">STREAK</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brutalist-green">{currentGoal.completedDays}</div>
              <div className="font-bold text-xs">COMPLETED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brutalist-green">{daysLeft}</div>
              <div className="font-bold text-xs">DAYS LEFT</div>
            </div>
          </div>
        </BrutalistCard>

        {/* Today's Coaching */}
        {todaysCoaching && (
          <BrutalistCard>
            <h2 className="brutalist-h2 mb-4">💪 TODAY'S MISSION</h2>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">AFFIRMATION</h3>
              <p className="text-lg font-bold italic text-center p-4 border-2 border-brutalist-black bg-yellow-100">
                "{todaysCoaching.affirmation}"
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">ACTION STEP</h3>
              <p className="font-bold p-4 border-2 border-brutalist-black bg-blue-100">
                {todaysCoaching.actionStep}
              </p>
            </div>

            <div className="text-center">
              <BrutalistButton
                onClick={() => updateGoalProgress(!todaysCoaching.completed)}
                variant={todaysCoaching.completed ? "secondary" : "accent"}
                className="w-full text-lg py-4"
              >
                {todaysCoaching.completed ? "✅ COMPLETED TODAY" : "MARK COMPLETE"}
              </BrutalistButton>
            </div>
          </BrutalistCard>
        )}

        {/* Growth Points */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">🏆 GROWTH POINTS</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 border-2 border-brutalist-black bg-brutalist-green">
              <div className="text-2xl font-bold">{growthPoints?.total || 0}</div>
              <div className="font-bold text-sm">TOTAL POINTS</div>
            </div>
            <div className="p-4 border-2 border-brutalist-black bg-yellow-200">
              <div className="text-2xl font-bold">LVL {growthPoints?.level || 1}</div>
              <div className="font-bold text-sm">CURRENT LEVEL</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <BrutalistButton 
              onClick={() => navigate('/rewards')}
              variant="secondary"
              className="w-full"
            >
              REDEEM REWARDS
            </BrutalistButton>
          </div>
        </BrutalistCard>

        {/* Quick Actions */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">⚡ QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 gap-3">
            <BrutalistButton 
              onClick={() => navigate('/reflect')}
              variant="secondary"
              className="flex flex-col items-center p-4 h-20"
            >
              <span className="text-xl">📝</span>
              <span className="text-sm">REFLECT</span>
            </BrutalistButton>
            
            <BrutalistButton 
              onClick={() => navigate('/analytics')}
              variant="secondary" 
              className="flex flex-col items-center p-4 h-20"
            >
              <span className="text-xl">📊</span>
              <span className="text-sm">ANALYTICS</span>
            </BrutalistButton>
            
            <BrutalistButton 
              onClick={() => navigate('/coaching')}
              variant="secondary"
              className="flex flex-col items-center p-4 h-20"
            >
              <span className="text-xl">🎯</span>
              <span className="text-sm">COACHING</span>
            </BrutalistButton>
            
            <BrutalistButton 
              onClick={() => navigate('/premium')}
              variant="secondary"
              className="flex flex-col items-center p-4 h-20"
            >
              <span className="text-xl">⭐</span>
              <span className="text-sm">PREMIUM</span>
            </BrutalistButton>
          </div>
        </BrutalistCard>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <BrutalistCard>
            <h2 className="brutalist-h2 mb-4">🔔 RECENT UPDATES</h2>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-2 border-brutalist-black ${
                    !notification.read ? 'bg-brutalist-green' : 'bg-gray-100'
                  }`}
                >
                  <div className="font-bold text-sm">{notification.title}</div>
                  <div className="text-sm">{notification.message}</div>
                </div>
              ))}
            </div>
          </BrutalistCard>
        )}
      </div>

      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'ANALYTICS', path: '/analytics', icon: '📊' },
          { label: 'REFLECT', path: '/reflect', icon: '📝' },
          { label: 'PROFILE', path: '/profile', icon: '👤' }
        ]}
      />
    </div>
  );
};

export default Dashboard;
