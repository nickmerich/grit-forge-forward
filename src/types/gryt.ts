
export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  description: string;
  whyItMatters: string;
  deadline: Date;
  createdAt: Date;
  isActive: boolean;
  progress: number;
  dailyStreak: number;
  completedDays: number;
  totalDays: number;
  signature?: string;
}

export type GoalCategory = 'health' | 'career' | 'relationships' | 'skills' | 'finance' | 'personal';

export interface DailyCoaching {
  id: string;
  goalId: string;
  date: Date;
  affirmation: string;
  actionStep: string;
  completed: boolean;
  reflection?: string;
  mood?: number; // 1-5 scale
}

export interface GrowthPoints {
  total: number;
  earned: number;
  spent: number;
  level: number;
  dailyBonus: number;
  streakBonus: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currentGoal?: Goal;
  growthPoints: GrowthPoints;
  joinedAt: Date;
  timezone: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

export const GOAL_CATEGORIES: { [key in GoalCategory]: { label: string; emoji: string; examples: string[] } } = {
  health: {
    label: 'HEALTH',
    emoji: '💪',
    examples: ['Lose 20 pounds', 'Run a 5K', 'Quit smoking', 'Sleep 8 hours daily']
  },
  career: {
    label: 'CAREER',
    emoji: '🚀',
    examples: ['Get promoted', 'Learn new skill', 'Start side business', 'Network weekly']
  },
  relationships: {
    label: 'RELATIONSHIPS',
    emoji: '❤️',
    examples: ['Date weekly', 'Call family daily', 'Make new friends', 'Improve communication']
  },
  skills: {
    label: 'SKILLS',
    emoji: '🧠',
    examples: ['Learn coding', 'Master guitar', 'Speak French', 'Read 24 books']
  },
  finance: {
    label: 'FINANCE',
    emoji: '💰',
    examples: ['Save $10k', 'Pay off debt', 'Invest monthly', 'Track expenses']
  },
  personal: {
    label: 'PERSONAL',
    emoji: '✨',
    examples: ['Meditate daily', 'Journal weekly', 'Organize home', 'Build confidence']
  }
};

export const DAILY_AFFIRMATIONS = [
  "I am becoming the person I want to be through consistent action.",
  "Every small step today builds the future I desire.",
  "I have the power to create lasting change in my life.",
  "My commitment to this goal reflects my commitment to myself.",
  "Progress, not perfection, is my path to transformation.",
  "I choose growth over comfort, action over hesitation.",
  "My why is stronger than any excuse I could make.",
  "I am building unbreakable discipline one day at a time.",
  "This goal matters because I matter.",
  "I have what it takes to see this through to the end."
];
