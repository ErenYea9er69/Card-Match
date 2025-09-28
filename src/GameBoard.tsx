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
        return 'grid-cols-4 max-w-lg';
      case 'medium':
        return 'grid-cols-4 max-w-xl';
      case 'hard':
        return 'grid-cols-6 max-w-4xl';
      default:
        return 'grid-cols-4 max-w-xl';
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Play?</h2>
          <p className="text-purple-200">Click "New Game" to start your memory challenge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Game Status */}
      {gameState === 'won' && (
        <div className="mb-8 text-center animate-bounce">
          <div className="text-6xl mb-2">🎉</div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h2>
          <p className="text-purple-200">You've completed the memory challenge!</p>
        </div>
      )}

      {/* Game Board */}
      <div className={`
        grid ${getGridClass()} gap-4 p-6 
        bg-white/10 backdrop-blur-sm rounded-2xl 
        border border-white/20 shadow-2xl
        animate-fadeInUp
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

      {/* Game Instructions */}
      {gameState === 'playing' && (
        <div className="mt-8 text-center animate-fadeIn">
          <p className="text-purple-200 text-sm">
            Find matching pairs by flipping cards two at a time!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;