import type { Card, Difficulty, GAME_CONFIG } from '../types/gameTypes';

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
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
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