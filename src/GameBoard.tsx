import React from 'react';
import type { Card as CardType, GameState, Difficulty } from './types/gameTypes';
import Card from './Card';

interface GameBoardProps {
  cards: CardType[];
  onCardSelect: (card: CardType) => void;
  gameState: GameState;
  difficulty: Difficulty;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  cards, 
  onCardSelect, 
  gameState,
  difficulty 
}) => {
  const getGridClass = () => {
    switch (difficulty) {
      case 'easy':
        return 'grid-cols-4'; // 4x3 = 12 cards
      case 'medium':
        return 'grid-cols-4'; // 4x4 = 16 cards
      case 'hard':
        return 'grid-cols-6'; // 6x4 = 24 cards
      default:
        return 'grid-cols-4';
    }
  };

  const getContainerSize = () => {
    switch (difficulty) {
      case 'easy':
        return 'max-w-2xl max-h-96'; // Smaller for easy
      case 'medium':
        return 'max-w-3xl max-h-[32rem]'; // Medium size
      case 'hard':
        return 'max-w-5xl max-h-[36rem]'; // Larger but constrained height
      default:
        return 'max-w-3xl max-h-[32rem]';
    }
  };

  const getGapSize = () => {
    switch (difficulty) {
      case 'easy':
        return 'gap-4';
      case 'medium':
        return 'gap-3';
      case 'hard':
        return 'gap-2'; // Smaller gaps for hard mode to fit more cards
      default:
        return 'gap-3';
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Play?</h2>
          <p className="text-purple-200">Click "New Game" to start your memory challenge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Game Status */}
      {gameState === 'won' && (
        <div className="mb-4 text-center animate-bounce">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-1">Congratulations!</h2>
          <p className="text-purple-200 text-sm">You've completed the memory challenge!</p>
        </div>
      )}

      {/* Game Board - Responsive and always fits on screen */}
      <div className={`
        grid ${getGridClass()} ${getContainerSize()} ${getGapSize()} 
        p-4 w-full h-full
        bg-white/10 backdrop-blur-sm rounded-2xl 
        border border-white/20 shadow-2xl
        animate-fadeInUp
        flex-1 max-h-full overflow-hidden
      `}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => onCardSelect(card)}
            disabled={gameState !== 'playing'}
            index={index}
          />
        ))}
      </div>

      {/* Game Instructions - Compact */}
      {gameState === 'playing' && (
        <div className="mt-2 text-center animate-fadeIn">
          <p className="text-purple-200 text-sm">
            Find matching pairs by flipping cards two at a time!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;