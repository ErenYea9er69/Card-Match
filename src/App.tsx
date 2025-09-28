import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './Header';
import StatsModal from './StatsModal';
import SettingsModal from './SettingsModal';
import GameBoard from './GameBoard';
import WinModal from './WinModal';
import PowerUpSystem from './PowerUpSystem';
import AchievementSystem from './AchievementSystem';
import { useGameStore } from './store/gameStore';
import { useSoundStore } from './store/soundStore';
import { generateCards, calculateScore } from './utils/gameUtils';

import type { Card, GameState, PowerUp, Achievement } from './types/gameTypes';

const App: React.FC = () => {
  const { 
    cards, 
    setCards, 
    gameState, 
    setGameState, 
    moves, 
    setMoves, 
    time, 
    setTime,
    difficulty,
    soundEnabled,
    bestScores,
    setBestScores,
    achievements,
    setAchievements,
    powerUps,
    setPowerUps,
    selectedCards,
    setSelectedCards,
    matchedPairs,
    setMatchedPairs,
    score,
    setScore
  } = useGameStore();

  const { playSound, playBackgroundMusic, stopBackgroundMusic } = useSoundStore();
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Game timer effect
  useEffect(() => {
    if (gameState === 'playing' && !gameTimerRef.current) {
      gameTimerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (gameState !== 'playing' && gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameState, setTime]);

  // Background music effect
  useEffect(() => {
    if (soundEnabled) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    return () => stopBackgroundMusic();
  }, [soundEnabled, playBackgroundMusic, stopBackgroundMusic]);

  // Initialize new game
  const initializeGame = useCallback(() => {
    setGameState('playing');
    setMoves(0);
    setTime(0);
    setMatchedPairs(0);
    setScore(0);
    setSelectedCards([]);
    setIsProcessing(false);
    
    // Stop any pending processing
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }

    // Generate and shuffle cards based on difficulty
    const newCards = generateCards(difficulty);
    setCards(newCards);
    
    // Play shuffle sound
    if (soundEnabled) {
      playSound('shuffle');
    }
  }, [difficulty, soundEnabled, playSound, setCards, setGameState, setMoves, setTime, setMatchedPairs, setScore, setSelectedCards]);

  // Handle card selection
  const handleCardSelect = useCallback((card: Card) => {
    if (gameState !== 'playing' || isProcessing || card.isFlipped || card.isMatched) {
      return;
    }

    // Start game timer on first move
    if (moves === 0 && selectedCards.length === 0) {
      setGameState('playing');
    }

    // Flip the card
    const updatedCards = cards.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    // Add to selected cards
    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(newSelectedCards);

    // Play flip sound
    if (soundEnabled) {
      playSound('flip');
    }

    // Check for match when two cards are selected
    if (newSelectedCards.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);

      const [firstCard, secondCard] = newSelectedCards;

      processingTimeoutRef.current = setTimeout(() => {
        if (firstCard.imageId === secondCard.imageId) {
          // Match found
          handleMatch(updatedCards, firstCard, secondCard);
        } else {
          // No match
          handleMismatch(updatedCards, firstCard, secondCard);
        }
      }, 1000);
    }
  }, [cards, selectedCards, gameState, isProcessing, moves, soundEnabled, playSound, setCards, setSelectedCards, setMoves]);

  // Handle matching cards
  const handleMatch = useCallback((updatedCards: Card[], firstCard: Card, secondCard: Card) => {
    const matchedCards = updatedCards.map(c => 
      c.id === firstCard.id || c.id === secondCard.id 
        ? { ...c, isMatched: true, isFlipped: true }
        : c
    );
    
    setCards(matchedCards);
    setSelectedCards([]);
    setIsProcessing(false);
    
    const newMatchedPairs = matchedPairs + 1;
    setMatchedPairs(newMatchedPairs);
    
    // Calculate and add score
    const matchScore = calculateScore('match', difficulty, time, moves);
    setScore(prev => prev + matchScore);
    
    // Play match sound
    if (soundEnabled) {
      playSound('match');
    }

    // Check for achievements
    checkAchievements(newMatchedPairs, moves + 1, time);

    // Check if game is won
    const totalPairs = getTotalPairs(difficulty);
    if (newMatchedPairs >= totalPairs) {
      handleGameWon();
    }
  }, [matchedPairs, difficulty, time, moves, soundEnabled, playSound, setCards, setSelectedCards, setMatchedPairs, setScore]);

  // Handle mismatching cards
  const handleMismatch = useCallback((updatedCards: Card[], firstCard: Card, secondCard: Card) => {
    const resetCards = updatedCards.map(c => 
      c.id === firstCard.id || c.id === secondCard.id 
        ? { ...c, isFlipped: false }
        : c
    );
    
    setCards(resetCards);
    setSelectedCards([]);
    setIsProcessing(false);
    
    // Play mismatch sound
    if (soundEnabled) {
      playSound('mismatch');
    }
  }, [soundEnabled, playSound, setCards, setSelectedCards]);

  // Handle game won
  const handleGameWon = useCallback(() => {
    setGameState('won');
    const finalScore = calculateScore('completion', difficulty, time, moves);
    setScore(finalScore);
    
    // Play win sound
    if (soundEnabled) {
      playSound('win');
    }
    
    // Update best scores
    const currentBest = bestScores[difficulty] || Infinity;
    if (moves < currentBest) {
      setBestScores({ ...bestScores, [difficulty]: moves });
    }
    
    // Show win modal after a delay
    setTimeout(() => {
      setShowWinModal(true);
    }, 1500);
  }, [difficulty, time, moves, soundEnabled, playSound, bestScores, setGameState, setScore, setBestScores, setShowWinModal]);

  // Check for achievements
  const checkAchievements = useCallback((currentPairs: number, currentMoves: number, currentTime: number) => {
    const newAchievements: Achievement[] = [];
    
    // First match achievement
    if (currentPairs === 1 && !achievements.find(a => a.id === 'first_match')) {
      newAchievements.push({
        id: 'first_match',
        title: 'First Match!',
        description: 'You found your first pair!',
        icon: '🎯',
        unlocked: true
      });
    }
    
    // Speed achievements
    if (currentTime <= 30 && currentPairs >= getTotalPairs(difficulty) && !achievements.find(a => a.id === 'speed_demon')) {
      newAchievements.push({
        id: 'speed_demon',
        title: 'Speed Demon!',
        description: 'Completed in under 30 seconds!',
        icon: '⚡',
        unlocked: true
      });
    }
    
    // Perfect game achievement
    if (currentMoves === getTotalPairs(difficulty) && !achievements.find(a => a.id === 'perfect_game')) {
      newAchievements.push({
        id: 'perfect_game',
        title: 'Perfect Game!',
        description: 'Completed with no mistakes!',
        icon: '💎',
        unlocked: true
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
      if (soundEnabled) {
        playSound('achievement');
      }
    }
  }, [difficulty, achievements, soundEnabled, playSound, setAchievements]);

  // Get total pairs for difficulty
  const getTotalPairs = (diff: 'easy' | 'medium' | 'hard'): number => {
    switch (diff) {
      case 'easy': return 6;
      case 'medium': return 8;
      case 'hard': return 12;
      default: return 8;
    }
  };

  // Use power-up
  const usePowerUp = useCallback((powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId && p.uses > 0);
    if (!powerUp || isProcessing) return;

    // Decrease uses
    setPowerUps(powerUps.map(p => 
      p.id === powerUpId ? { ...p, uses: p.uses - 1 } : p
    ));

    // Apply power-up effect
    switch (powerUpId) {
      case 'reveal':
        // Reveal all cards briefly
        const revealedCards = cards.map(c => ({ ...c, isFlipped: true }));
        setCards(revealedCards);
        setTimeout(() => {
          const hiddenCards = cards.map(c => ({ 
            ...c, 
            isFlipped: c.isMatched ? true : false 
          }));
          setCards(hiddenCards);
        }, 2000);
        break;
        
      case 'shuffle':
        // Shuffle unmatched cards
        const unmatchedCards = cards.filter(c => !c.isMatched);
        const matchedCards = cards.filter(c => c.isMatched);
        const shuffledUnmatched = [...unmatchedCards].sort(() => Math.random() - 0.5);
        const newShuffledCards = [...matchedCards, ...shuffledUnmatched];
        setCards(newShuffledCards);
        break;
        
      case 'hint':
        // Highlight a matching pair
        const unmatched = cards.filter(c => !c.isMatched && !c.isFlipped);
        if (unmatched.length >= 2) {
          const pairs = {};
          unmatched.forEach(card => {
            if (!pairs[card.imageId]) pairs[card.imageId] = [];
            pairs[card.imageId].push(card);
          });
          
          const matchingPair = Object.values(pairs).find(pair => pair.length === 2);
          if (matchingPair) {
            const hintCards = cards.map(c => {
              if (matchingPair.some(p => p.id === c.id)) {
                return { ...c, isHint: true };
              }
              return c;
            });
            setCards(hintCards);
            setTimeout(() => {
              const clearHints = cards.map(c => ({ ...c, isHint: false }));
              setCards(clearHints);
            }, 3000);
          }
        }
        break;
    }

    // Play power-up sound
    if (soundEnabled) {
      playSound('powerup');
    }
  }, [cards, powerUps, isProcessing, soundEnabled, playSound, setCards, setPowerUps]);

  // Reset game
  const resetGame = useCallback(() => {
    setShowWinModal(false);
    initializeGame();
  }, [initializeGame, setShowWinModal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <Header
          onNewGame={initializeGame}
          onStatsClick={() => setShowStats(true)}
          onSettingsClick={() => setShowSettings(true)}
          moves={moves}
          time={time}
          score={score}
          bestScore={bestScores[difficulty]}
          gameState={gameState}
        />

        {/* Main Game Area */}
        <main className="pt-24 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Power-ups */}
            <PowerUpSystem
              powerUps={powerUps}
              onUsePowerUp={usePowerUp}
              disabled={gameState !== 'playing' || isProcessing}
            />

            {/* Game Board */}
            <GameBoard
              cards={cards}
              onCardSelect={handleCardSelect}
              gameState={gameState}
              difficulty={difficulty}
            />

            {/* Achievements */}
            <AchievementSystem achievements={achievements} />
          </div>
        </main>

        {/* Modals */}
        <StatsModal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          bestScores={bestScores}
          moves={moves}
          time={time}
          score={score}
          achievements={achievements}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <WinModal
          isOpen={showWinModal}
          onClose={() => setShowWinModal(false)}
          onNewGame={resetGame}
          moves={moves}
          time={time}
          score={score}
          difficulty={difficulty}
          achievements={achievements.filter(a => a.unlocked)}
        />
      </div>
    </div>
  );
};

export default App;