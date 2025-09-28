export type GameState = 'ready' | 'playing' | 'won' | 'paused';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'dark' | 'light' | 'neon';

export interface Card {
  id: number;
  imageId: number;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking: boolean;
  isHint?: boolean;
}

export interface PowerUp {
  id: string;
  name: string;
  type: 'reveal' | 'shuffle' | 'hint' | 'time' | 'freeze';
  uses: number;
  cooldown?: number;
  cost?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  notified?: boolean;
  unlockedAt?: number;
}

export interface GameStats {
  moves: number;
  time: number;
  score: number;
  difficulty: Difficulty;
  matchedPairs: number;
  totalPairs: number;
}

export interface GameSettings {
  difficulty: Difficulty;
  soundEnabled: boolean;
  theme: Theme;
  musicVolume: number;
  sfxVolume: number;
}

export interface BestScores {
  [key: string]: number;
}

export interface GameStore {
  // Game State
  cards: Card[];
  gameState: GameState;
  moves: number;
  time: number;
  score: number;
  matchedPairs: number;
  selectedCards: Card[];
  
  // Settings
  difficulty: Difficulty;
  soundEnabled: boolean;
  theme: Theme;
  
  // Progress
  bestScores: BestScores;
  achievements: Achievement[];
  powerUps: PowerUp[];
  
  // Actions
  setCards: (cards: Card[]) => void;
  setGameState: (state: GameState) => void;
  setMoves: (moves: number | ((prev: number) => number)) => void;
  setTime: (time: number | ((prev: number) => number)) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setMatchedPairs: (pairs: number | ((prev: number) => number)) => void;
  setSelectedCards: (cards: Card[]) => void;
  
  setDifficulty: (difficulty: Difficulty) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTheme: (theme: Theme) => void;
  
  setBestScores: (scores: BestScores) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setPowerUps: (powerUps: PowerUp[]) => void;
  
  resetGame: () => void;
  initializeAchievements: () => void;
  initializePowerUps: () => void;
}

export interface SoundStore {
  musicVolume: number;
  sfxVolume: number;
  
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  
  playSound: (soundType: string) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

export interface CardData {
  id: number;
  emoji: string;
  name: string;
}

// Game constants
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