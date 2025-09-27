// types.ts - Type definitions for the memory card game

export interface Card {
  id: number;
  imageId: number;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking: boolean;
}

export interface GameStats {
  moves: number;
  time: number;
  score: number;
  matches: number;
  difficulty: DifficultyLevel;
  isCompleted: boolean;
  isPaused: boolean;
}

export interface HighScore {
  id: string;
  score: number;
  time: number;
  moves: number;
  difficulty: DifficultyLevel;
  date: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  theme: GameTheme;
  showTimer: boolean;
  showMoves: boolean;
  autoFlipBack: boolean;
  flipDelay: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type GameTheme = 'default' | 'animals' | 'nature' | 'space';
export type GameState = 'menu' | 'playing' | 'paused' | 'completed' | 'settings';

export interface DifficultyConfig {
  level: DifficultyLevel;
  gridSize: number;
  pairs: number;
  timeBonus: number;
  label: string;
  description: string;
}

export interface SoundEffect {
  flip: HTMLAudioElement;
  match: HTMLAudioElement;
  win: HTMLAudioElement;
  button: HTMLAudioElement;
  error: HTMLAudioElement;
}

export interface GameContext {
  gameState: GameState;
  gameStats: GameStats;
  settings: GameSettings;
  highScores: HighScore[];
  difficulty: DifficultyConfig;
  cards: Card[];
  selectedCards: Card[];
  isProcessing: boolean;
}

// Constants
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    level: 'easy',
    gridSize: 4,
    pairs: 8,
    timeBonus: 1000,
    label: 'Easy',
    description: '4x4 grid, 8 pairs'
  },
  medium: {
    level: 'medium',
    gridSize: 6,
    pairs: 18,
    timeBonus: 1500,
    label: 'Medium',
    description: '6x6 grid, 18 pairs'
  },
  hard: {
    level: 'hard',
    gridSize: 8,
    pairs: 32,
    timeBonus: 2000,
    label: 'Hard',
    description: '8x8 grid, 32 pairs'
  },
  expert: {
    level: 'expert',
    gridSize: 10,
    pairs: 50,
    timeBonus: 2500,
    label: 'Expert',
    description: '10x10 grid, 50 pairs'
  }
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.7,
  theme: 'default',
  showTimer: true,
  showMoves: true,
  autoFlipBack: true,
  flipDelay: 800
};

export const INITIAL_GAME_STATS: GameStats = {
  moves: 0,
  time: 0,
  score: 0,
  matches: 0,
  difficulty: 'easy',
  isCompleted: false,
  isPaused: false
};