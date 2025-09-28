import type { Card, Difficulty } from '../types/gameTypes';

export const GAME_CONFIG = {
  difficulties: {
    easy: { pairs: 6, grid: { cols: 4, rows: 3 } },
    medium: { pairs: 8, grid: { cols: 4, rows: 4 } },
    hard: { pairs: 12, grid: { cols: 6, rows: 4 } }
  },
  
  scoring: {
    baseMatch: 100,
    timeBonus: 2,
    moveBonus: 50,
    completionBonus: 1000,
    difficultyMultiplier: {
      easy: 1,
      medium: 1.5,
      hard: 2
    }
  },
  
  powerUps: [
    { id: 'reveal', name: 'Reveal All', type: 'reveal' as const, uses: 3 },
    { id: 'shuffle', name: 'Shuffle', type: 'shuffle' as const, uses: 2 },
    { id: 'hint', name: 'Hint', type: 'hint' as const, uses: 5 }
  ],
  
  achievements: [
    {
      id: 'first_match',
      title: 'First Match!',
      description: 'You found your first pair!',
      icon: '🎯',
      unlocked: false
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon!',
      description: 'Completed in under 30 seconds!',
      icon: '⚡',
      unlocked: false
    },
    {
      id: 'perfect_game',
      title: 'Perfect Game!',
      description: 'Completed with no mistakes!',
      icon: '💎',
      unlocked: false
    },
    {
      id: 'marathon',
      title: 'Marathon Runner!',
      description: 'Played 10 games',
      icon: '🏃',
      unlocked: false
    },
    {
      id: 'master',
      title: 'Memory Master!',
      description: 'Won on hard difficulty',
      icon: '🧠',
      unlocked: false
    },
    {
      id: 'collector',
      title: 'Achievement Collector!',
      description: 'Unlocked 5 achievements',
      icon: '🏅',
      unlocked: false
    }
  ]
};

export const generateCards = (difficulty: Difficulty): Card[] => {
  const config = GAME_CONFIG.difficulties[difficulty];
  const totalPairs = config.pairs;
  
  // Generate random image IDs
  const availableImages = Array.from({ length: 24 }, (_, i) => i + 1);
  const shuffledImages = availableImages.sort(() => Math.random() - 0.5);
  const selectedImages = shuffledImages.slice(0, totalPairs);
  
  // Create pairs and shuffle them
  const cardPairs = [...selectedImages, ...selectedImages];
  const shuffledPairs = cardPairs.sort(() => Math.random() - 0.5);
  
  // Create card objects
  const cards: Card[] = shuffledPairs.map((imageId, index) => ({
    id: index,
    imageId,
    isFlipped: false,
    isMatched: false,
    isShaking: false
  }));
  
  return cards;
};

export const calculateScore = (
  action: 'match' | 'completion',
  difficulty: Difficulty,
  time: number,
  moves: number
): number => {
  const { scoring } = GAME_CONFIG;
  const multiplier = scoring.difficultyMultiplier[difficulty];
  
  switch (action) {
    case 'match':
      // Base score for matching a pair
      const baseScore = scoring.baseMatch;
      
      // Time bonus - faster matches get more points
      const timeBonus = Math.max(0, scoring.timeBonus * (30 - time));
      
      // Move bonus - fewer moves get more points
      const moveBonus = Math.max(0, scoring.moveBonus * (10 - moves));
      
      return Math.floor((baseScore + timeBonus + moveBonus) * multiplier);
      
    case 'completion':
      // Completion bonus
      const completionBonus = scoring.completionBonus;
      
      // Time bonus for completing quickly
      const completionTimeBonus = Math.max(0, scoring.timeBonus * (120 - time));
      
      // Move bonus for completing efficiently
      const completionMoveBonus = Math.max(0, scoring.moveBonus * (20 - moves));
      
      return Math.floor((completionBonus + completionTimeBonus + completionMoveBonus) * multiplier);
      
    default:
      return 0;
  }
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const getEmojiForId = (id: number): string => {
  const emojis = [
    '🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧',
    '🎸', '🎺', '🎻', '🎹', '🎲', '🎳', '🎯', '🎱',
    '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸',
    '🚀', '🛸', '🌟', '💫', '⭐', '🌙', '☀️', '🌈',
    '🦄', '🐉', '🐲', '🦁', '🐯', '🐻', '🐼', '🦊',
    '🍕', '🍔', '🍟', '🍦', '🍩', '🍪', '🎂', '🧁'
  ];
  return emojis[(id - 1) % emojis.length];
};

export const getGridClass = (difficulty: Difficulty): string => {
  const config = GAME_CONFIG.difficulties[difficulty];
  const { cols } = config.grid;
  
  const maxWidths: { [key: string]: string } = {
    4: 'max-w-xl',
    6: 'max-w-4xl'
  };
  
  return `grid-cols-${cols} ${maxWidths[cols] || 'max-w-xl'}`;
};

export const getTotalPairs = (difficulty: Difficulty): number => {
  return GAME_CONFIG.difficulties[difficulty].pairs;
};

export const createAchievement = (
  id: string,
  title: string,
  description: string,
  icon: string
) => ({
  id,
  title,
  description,
  icon,
  unlocked: false,
  notified: false
});

export const createPowerUp = (
  id: string,
  name: string,
  type: 'reveal' | 'shuffle' | 'hint' | 'time' | 'freeze',
  uses: number
) => ({
  id,
  name,
  type,
  uses,
  cooldown: 0
});

// Animation utilities
export const getCardAnimationDelay = (index: number): string => {
  return `${index * 50}ms`;
};

export const getStaggeredAnimationClass = (index: number): string => {
  return `animate-fadeInUp`;
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};