import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  GameState, 
  GameStats, 
  GameSettings, 
  HighScore, 
  Card, 
  DifficultyLevel, 
  DifficultyConfig,
  DIFFICULTY_CONFIGS,
  DEFAULT_SETTINGS,
  INITIAL_GAME_STATS 
} from './types';
import { GameUtils, SoundManager } from './utils';

// Action types
type GameAction = 
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'START_GAME'; payload: DifficultyLevel }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'FLIP_CARD'; payload: number }
  | { type: 'MATCH_CARDS'; payload: { card1Id: number; card2Id: number } }
  | { type: 'SHAKE_CARDS'; payload: { card1Id: number; card2Id: number } }
  | { type: 'CLEAR_FLIPS'; payload: { card1Id: number; card2Id: number } }
  | { type: 'UPDATE_TIME' }
  | { type: 'INCREMENT_MOVES' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'ADD_HIGH_SCORE'; payload: HighScore }
  | { type: 'LOAD_HIGH_SCORES'; payload: HighScore[] }
  | { type: 'SET_PROCESSING'; payload: boolean };

// Game state interface
interface GameContextState {
  gameState: GameState;
  gameStats: GameStats;
  settings: GameSettings;
  highScores: HighScore[];
  difficulty: DifficultyConfig;
  cards: Card[];
  selectedCards: Card[];
  isProcessing: boolean;
}

// Initial state
const initialState: GameContextState = {
  gameState: 'menu',
  gameStats: INITIAL_GAME_STATS,
  settings: DEFAULT_SETTINGS,
  highScores: [],
  difficulty: DIFFICULTY_CONFIGS.easy,
  cards: [],
  selectedCards: [],
  isProcessing: false
};

// Game reducer
function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };

    case 'START_GAME': {
      const difficulty = DIFFICULTY_CONFIGS[action.payload];
      const cards = GameUtils.generateCards(difficulty);
      return {
        ...state,
        gameState: 'playing',
        difficulty,
        cards,
        gameStats: {
          ...INITIAL_GAME_STATS,
          difficulty: action.payload
        },
        selectedCards: [],
        isProcessing: false
      };
    }

    case 'PAUSE_GAME':
      return {
        ...state,
        gameState: 'paused',
        gameStats: { ...state.gameStats, isPaused: true }
      };

    case 'RESUME_GAME':
      return {
        ...state,
        gameState: 'playing',
        gameStats: { ...state.gameStats, isPaused: false }
      };

    case 'END_GAME': {
      const score = GameUtils.calculateScore(state.gameStats, state.difficulty);
      return {
        ...state,
        gameState: 'completed',
        gameStats: {
          ...state.gameStats,
          score,
          isCompleted: true
        }
      };
    }

    case 'RESET_GAME':
      return {
        ...state,
        gameState: 'menu',
        gameStats: INITIAL_GAME_STATS,
        cards: [],
        selectedCards: [],
        isProcessing: false
      };

    case 'FLIP_CARD': {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched || state.isProcessing) {
        return state;
      }

      const newCards = state.cards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      const newSelectedCards = [...state.selectedCards, card];

      return {
        ...state,
        cards: newCards,
        selectedCards: newSelectedCards
      };
    }

    case 'MATCH_CARDS': {
      const { card1Id, card2Id } = action.payload;
      const newCards = state.cards.map(card =>
        card.id === card1Id || card.id === card2Id
          ? { ...card, isMatched: true }
          : card
      );

      const newMatches = state.gameStats.matches + 1;
      const isGameComplete = newMatches === state.difficulty.pairs;

      return {
        ...state,
        cards: newCards,
        selectedCards: [],
        gameStats: {
          ...state.gameStats,
          matches: newMatches,
          isCompleted: isGameComplete
        },
        gameState: isGameComplete ? 'completed' : state.gameState,
        isProcessing: false
      };
    }

    case 'SHAKE_CARDS': {
      const { card1Id, card2Id } = action.payload;
      const newCards = state.cards.map(card =>
        card.id === card1Id || card.id === card2Id
          ? { ...card, isShaking: true }
          : card
      );

      return {
        ...state,
        cards: newCards
      };
    }

    case 'CLEAR_FLIPS': {
      const { card1Id, card2Id } = action.payload;
      const newCards = state.cards.map(card =>
        card.id === card1Id || card.id === card2Id
          ? { ...card, isFlipped: false, isShaking: false }
          : card
      );

      return {
        ...state,
        cards: newCards,
        selectedCards: [],
        isProcessing: false
      };
    }

    case 'UPDATE_TIME':
      if (state.gameState === 'playing' && !state.gameStats.isPaused) {
        return {
          ...state,
          gameStats: {
            ...state.gameStats,
            time: state.gameStats.time + 1
          }
        };
      }
      return state;

    case 'INCREMENT_MOVES':
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          moves: state.gameStats.moves + 1
        }
      };

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      GameUtils.saveSettings(newSettings);
      
      // Update sound manager settings
      if (action.payload.soundEnabled !== undefined) {
        SoundManager.setEnabled(action.payload.soundEnabled);
      }
      if (action.payload.volume !== undefined) {
        SoundManager.setVolume(action.payload.volume);
      }

      return { ...state, settings: newSettings };
    }

    case 'ADD_HIGH_SCORE': {
      const newHighScores = GameUtils.addHighScore(action.payload, state.highScores);
      GameUtils.saveHighScores(newHighScores);
      return { ...state, highScores: newHighScores };
    }

    case 'LOAD_HIGH_SCORES':
      return { ...state, highScores: action.payload };

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };

    default:
      return state;
  }
}

// Context interface
interface GameContextType {
  state: GameContextState;
  actions: {
    setGameState: (state: GameState) => void;
    startGame: (difficulty: DifficultyLevel) => void;
    pauseGame: () => void;
    resumeGame: () => void;
    endGame: () => void;
    resetGame: () => void;
    flipCard: (cardId: number) => void;
    updateSettings: (settings: Partial<GameSettings>) => void;
    addHighScore: (score: HighScore) => void;
  };
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize game on mount
  useEffect(() => {
    // Initialize sound manager
    SoundManager.initialize();
    
    // Load saved settings
    const savedSettings = GameUtils.loadSettings();
    if (savedSettings) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: savedSettings });
    }
    
    // Load high scores
    const savedHighScores = GameUtils.loadHighScores();
    dispatch({ type: 'LOAD_HIGH_SCORES', payload: savedHighScores });
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.gameState === 'playing' && !state.gameStats.isPaused) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME' });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.gameState, state.gameStats.isPaused]);

  // Handle card matching logic
  useEffect(() => {
    if (state.selectedCards.length === 2) {
      const [card1, card2] = state.selectedCards;
      dispatch({ type: 'SET_PROCESSING', payload: true });
      dispatch({ type: 'INCREMENT_MOVES' });

      if (GameUtils.cardsMatch(card1, card2)) {
        // Cards match
        SoundManager.play('match');
        setTimeout(() => {
          dispatch({ type: 'MATCH_CARDS', payload: { card1Id: card1.id, card2Id: card2.id } });
        }, 300);
      } else {
        // Cards don't match
        SoundManager.play('error');
        setTimeout(() => {
          dispatch({ type: 'SHAKE_CARDS', payload: { card1Id: card1.id, card2Id: card2.id } });
        }, 300);
        
        setTimeout(() => {
          dispatch({ type: 'CLEAR_FLIPS', payload: { card1Id: card1.id, card2Id: card2.id } });
        }, state.settings.flipDelay);
      }
    }
  }, [state.selectedCards, state.settings.flipDelay]);

  // Handle game completion
  useEffect(() => {
    if (state.gameStats.isCompleted && state.gameState === 'completed') {
      SoundManager.play('win');
      
      // Add high score if applicable
      const score = GameUtils.calculateScore(state.gameStats, state.difficulty);
      if (GameUtils.isHighScore(score, state.highScores)) {
        const newHighScore: HighScore = {
          id: GameUtils.generateId(),
          score,
          time: state.gameStats.time,
          moves: state.gameStats.moves,
          difficulty: state.difficulty.level,
          date: new Date().toISOString()
        };
        dispatch({ type: 'ADD_HIGH_SCORE', payload: newHighScore });
      }
    }
  }, [state.gameStats.isCompleted, state.gameState]);

  // Actions
  const actions = {
    setGameState: useCallback((gameState: GameState) => {
      dispatch({ type: 'SET_GAME_STATE', payload: gameState });
    }, []),

    startGame: useCallback((difficulty: DifficultyLevel) => {
      SoundManager.play('button');
      dispatch({ type: 'START_GAME', payload: difficulty });
    }, []),

    pauseGame: useCallback(() => {
      SoundManager.play('button');
      dispatch({ type: 'PAUSE_GAME' });
    }, []),

    resumeGame: useCallback(() => {
      SoundManager.play('button');
      dispatch({ type: 'RESUME_GAME' });
    }, []),

    endGame: useCallback(() => {
      dispatch({ type: 'END_GAME' });
    }, []),

    resetGame: useCallback(() => {
      SoundManager.play('button');
      dispatch({ type: 'RESET_GAME' });
    }, []),

    flipCard: useCallback((cardId: number) => {
      SoundManager.play('flip');
      dispatch({ type: 'FLIP_CARD', payload: cardId });
    }, []),

    updateSettings: useCallback((settings: Partial<GameSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }, []),

    addHighScore: useCallback((score: HighScore) => {
      dispatch({ type: 'ADD_HIGH_SCORE', payload: score });
    }, [])
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};