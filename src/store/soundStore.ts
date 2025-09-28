import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  GameStore, 
  GameState, 
  Card, 
  Achievement, 
  PowerUp, 
  BestScores,
  Difficulty,
  Theme,
  GAME_CONFIG 
} from '../types/gameTypes';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Game State
      cards: [],
      gameState: 'ready' as GameState,
      moves: 0,
      time: 0,
      score: 0,
      matchedPairs: 0,
      selectedCards: [],
      
      // Settings
      difficulty: 'medium' as Difficulty,
      soundEnabled: true,
      theme: 'dark' as Theme,
      
      // Progress
      bestScores: {} as BestScores,
      achievements: [] as Achievement[],
      powerUps: [] as PowerUp[],

      // Actions
      setCards: (cards: Card[]) => set({ cards }),
      setGameState: (gameState: GameState) => set({ gameState }),
      setMoves: (moves: number | ((prev: number) => number)) => 
        set((state) => ({ moves: typeof moves === 'function' ? moves(state.moves) : moves })),
      setTime: (time: number | ((prev: number) => number)) => 
        set((state) => ({ time: typeof time === 'function' ? time(state.time) : time })),
      setScore: (score: number | ((prev: number) => number)) => 
        set((state) => ({ score: typeof score === 'function' ? score(state.score) : score })),
      setMatchedPairs: (matchedPairs: number | ((prev: number) => number)) => 
        set((state) => ({ matchedPairs: typeof matchedPairs === 'function' ? matchedPairs(state.matchedPairs) : matchedPairs })),
      setSelectedCards: (selectedCards: Card[]) => set({ selectedCards }),

      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
      setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),
      setTheme: (theme: Theme) => set({ theme }),

      setBestScores: (bestScores: BestScores) => set({ bestScores }),
      setAchievements: (achievements: Achievement[]) => set({ achievements }),
      setPowerUps: (powerUps: PowerUp[]) => set({ powerUps }),

      resetGame: () => {
        set({
          cards: [],
          gameState: 'ready' as GameState,
          moves: 0,
          time: 0,
          score: 0,
          matchedPairs: 0,
          selectedCards: []
        });
      },

      initializeAchievements: () => {
        const state = get();
        if (state.achievements.length === 0) {
          set({ achievements: GAME_CONFIG.achievements });
        }
      },

      initializePowerUps: () => {
        const state = get();
        if (state.powerUps.length === 0) {
          set({ powerUps: GAME_CONFIG.powerUps });
        }
      }
    }),
    {
      name: 'memocard-game-storage',
      partialize: (state) => ({
        bestScores: state.bestScores,
        achievements: state.achievements,
        powerUps: state.powerUps,
        difficulty: state.difficulty,
        soundEnabled: state.soundEnabled,
        theme: state.theme
      })
    }
  )
);