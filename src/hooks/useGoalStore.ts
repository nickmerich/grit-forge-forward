
import { useState, useEffect } from 'react';
import { Goal, DailyCoaching, GrowthPoints, User } from '@/types/gryt';

// Mock data for development
const mockUser: User = {
  id: '1',
  name: 'GRYT USER',
  email: 'user@gryt.app',
  growthPoints: {
    total: 1250,
    earned: 1250,
    spent: 0,
    level: 3,
    dailyBonus: 25,
    streakBonus: 50
  },
  joinedAt: new Date('2024-01-01'),
  timezone: 'America/New_York'
};

const mockGoal: Goal = {
  id: '1',
  title: 'RUN EVERY MORNING',
  category: 'health',
  description: 'Run for 30 minutes every morning before 8 AM',
  whyItMatters: 'Running will give me the energy and confidence I need to tackle every challenge in my life. It will make me physically and mentally stronger, setting the tone for success in all areas.',
  deadline: new Date('2024-07-01'),
  createdAt: new Date('2024-06-01'),
  isActive: true,
  progress: 68,
  dailyStreak: 12,
  completedDays: 21,
  totalDays: 31,
  signature: 'John Doe'
};

const mockCoaching: DailyCoaching = {
  id: '1',
  goalId: '1',
  date: new Date(),
  affirmation: "I am becoming stronger and more disciplined with every step I take.",
  actionStep: "Lay out your running clothes before bed tonight.",
  completed: false
};

export const useGoalStore = () => {
  const [user, setUser] = useState<User>(mockUser);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(mockGoal);
  const [todaysCoaching, setTodaysCoaching] = useState<DailyCoaching>(mockCoaching);
  const [isLoading, setIsLoading] = useState(false);

  const updateGoalProgress = (completed: boolean) => {
    if (!currentGoal) return;
    
    const newProgress = completed 
      ? Math.min(100, currentGoal.progress + (100 / currentGoal.totalDays))
      : Math.max(0, currentGoal.progress - (100 / currentGoal.totalDays));
    
    const updatedGoal = {
      ...currentGoal,
      progress: newProgress,
      completedDays: completed 
        ? currentGoal.completedDays + 1 
        : Math.max(0, currentGoal.completedDays - 1),
      dailyStreak: completed 
        ? currentGoal.dailyStreak + 1 
        : 0
    };

    setCurrentGoal(updatedGoal);
    
    // Update coaching completion
    setTodaysCoaching({
      ...todaysCoaching,
      completed: completed
    });

    // Award points if completed
    if (completed && !todaysCoaching.completed) {
      const points = user.growthPoints.dailyBonus + 
                   (currentGoal.dailyStreak % 7 === 0 ? user.growthPoints.streakBonus : 0);
      
      setUser({
        ...user,
        growthPoints: {
          ...user.growthPoints,
          total: user.growthPoints.total + points,
          earned: user.growthPoints.earned + points
        }
      });
    }
  };

  const createGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'isActive' | 'progress' | 'dailyStreak' | 'completedDays' | 'totalDays'>) => {
    const totalDays = Math.ceil((goalData.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: true,
      progress: 0,
      dailyStreak: 0,
      completedDays: 0,
      totalDays: totalDays
    };

    setCurrentGoal(newGoal);
    setUser({ ...user, currentGoal: newGoal });
    
    return newGoal;
  };

  const completeGoal = () => {
    if (!currentGoal) return;
    
    const completionBonus = 500 * (currentGoal.totalDays / 30); // More points for longer goals
    
    setUser({
      ...user,
      growthPoints: {
        ...user.growthPoints,
        total: user.growthPoints.total + completionBonus,
        earned: user.growthPoints.earned + completionBonus
      }
    });

    setCurrentGoal({
      ...currentGoal,
      isActive: false,
      progress: 100
    });
  };

  return {
    user,
    currentGoal,
    todaysCoaching,
    isLoading,
    updateGoalProgress,
    createGoal,
    completeGoal,
    setUser,
    setCurrentGoal
  };
};
