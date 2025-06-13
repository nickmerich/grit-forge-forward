
import React, { useState, useEffect } from 'react';
import { useSupabaseGoalStore } from '@/hooks/useSupabaseGoalStore';
import { useAchievements } from '@/hooks/useAchievements';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistNavigation from '@/components/BrutalistNavigation';
import BrutalistProgressBar from '@/components/BrutalistProgressBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const Analytics = () => {
  const { currentGoal, growthPoints } = useSupabaseGoalStore();
  const { achievements } = useAchievements();
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [moodData, setMoodData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock weekly progress data
    const generateWeeklyData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map((day, index) => ({
        day,
        completed: Math.random() > 0.3 ? 1 : 0,
        streak: Math.max(0, 7 - index + Math.floor(Math.random() * 3))
      }));
    };

    // Generate mock mood data
    const generateMoodData = () => {
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          mood: Math.floor(Math.random() * 5) + 1
        });
      }
      return last7Days;
    };

    setWeeklyProgress(generateWeeklyData());
    setMoodData(generateMoodData());
  }, []);

  const completionRate = currentGoal ? Math.round((currentGoal.completedDays / currentGoal.totalDays) * 100) : 0;
  const daysRemaining = currentGoal ? Math.max(0, Math.ceil((currentGoal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">ANALYTICS</h1>
        <p className="text-center font-bold mt-2">TRACK YOUR TRANSFORMATION</p>
      </div>

      <div className="brutalist-section space-y-6">
        {/* Key Metrics */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">📊 KEY METRICS</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brutalist-green">{currentGoal?.dailyStreak || 0}</div>
              <div className="font-bold text-sm">CURRENT STREAK</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brutalist-green">{completionRate}%</div>
              <div className="font-bold text-sm">COMPLETION RATE</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brutalist-green">{growthPoints?.total || 0}</div>
              <div className="font-bold text-sm">TOTAL POINTS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brutalist-green">{daysRemaining}</div>
              <div className="font-bold text-sm">DAYS LEFT</div>
            </div>
          </div>

          {currentGoal && (
            <div className="mb-4">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>GOAL PROGRESS</span>
                <span>{Math.round(currentGoal.progress)}%</span>
              </div>
              <BrutalistProgressBar 
                progress={currentGoal.progress} 
                className="h-4"
              />
            </div>
          )}
        </BrutalistCard>

        {/* Weekly Progress Chart */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">📅 WEEKLY PROGRESS</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="completed" fill="#00ff00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BrutalistCard>

        {/* Mood Tracking */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">😊 MOOD TRACKING</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Line type="monotone" dataKey="mood" stroke="#00ff00" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm font-bold text-gray-600">
            <p>Track your daily mood to see patterns and correlations with your progress.</p>
          </div>
        </BrutalistCard>

        {/* Achievements */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">🏆 RECENT ACHIEVEMENTS</h2>
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.slice(0, 5).map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center justify-between p-3 border-2 border-brutalist-black bg-brutalist-green"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon || '🏆'}</span>
                    <div>
                      <div className="font-bold">{achievement.title}</div>
                      {achievement.description && (
                        <div className="text-sm">{achievement.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="font-bold">+{achievement.points_earned}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎯</div>
              <p className="font-bold">Keep going to unlock your first achievement!</p>
            </div>
          )}
        </BrutalistCard>

        {/* Insights */}
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-4">💡 INSIGHTS</h2>
          <div className="space-y-4">
            <div className="p-4 border-2 border-brutalist-black bg-yellow-100">
              <div className="font-bold">🔥 STREAK POWER</div>
              <p className="text-sm mt-1">
                {currentGoal?.dailyStreak && currentGoal.dailyStreak > 0 
                  ? `You're on fire! ${currentGoal.dailyStreak} days strong. Keep it up!`
                  : "Start your streak today and build unstoppable momentum!"
                }
              </p>
            </div>
            
            <div className="p-4 border-2 border-brutalist-black bg-blue-100">
              <div className="font-bold">⚡ ENERGY LEVEL</div>
              <p className="text-sm mt-1">
                Based on your completion rate, you're showing {completionRate > 70 ? 'HIGH' : completionRate > 40 ? 'MEDIUM' : 'LOW'} energy.
                {completionRate <= 40 && " Consider adjusting your goal or breaking it into smaller steps."}
              </p>
            </div>
            
            <div className="p-4 border-2 border-brutalist-black bg-green-100">
              <div className="font-bold">🎯 RECOMMENDATION</div>
              <p className="text-sm mt-1">
                {currentGoal?.progress && currentGoal.progress > 50 
                  ? "You're past the halfway mark! This is where champions are made."
                  : "Focus on consistency over perfection. Small daily wins compound into massive results."
                }
              </p>
            </div>
          </div>
        </BrutalistCard>
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

export default Analytics;
