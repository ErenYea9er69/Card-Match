import React, { useState, useEffect } from 'react';
import type { Card as CardType } from './types/gameTypes';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled, index }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (card.isFlipped || card.isMatched) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [card.isFlipped, card.isMatched]);

  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick();
    }
  };

  const getCardContent = () => {
    // Card back
    if (!card.isFlipped && !card.isMatched) {
      return (
        <div className="card-back">
          <div className="card-pattern">
            <div className="pattern-dots"></div>
          </div>
          <div className="card-shine"></div>
        </div>
      );
    }

    // Card front (matched or flipped)
    return (
      <div className="card-front">
        <div className="card-image">
          <span className="text-4xl">{getEmojiForId(card.imageId)}</span>
        </div>
        {card.isMatched && (
          <div className="match-effect">
            <div className="sparkles">✨</div>
          </div>
        )}
      </div>
    );
  };

  const getEmojiForId = (id: number): string => {
    const emojis = [
      '🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧',
      '🎸', '🎺', '🎻', '🎹', '🎲', '🎳', '🎯', '🎱',
      '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸'
    ];
    return emojis[(id - 1) % emojis.length];
  };

  return (
    <div
      className={`
        card-container
        ${card.isFlipped ? 'flipped' : ''}
        ${card.isMatched ? 'matched' : ''}
        ${card.isHint ? 'hint' : ''}
        ${isAnimating ? 'animating' : ''}
        ${disabled && !card.isFlipped ? 'disabled' : ''}
      `}
      onClick={handleClick}
      style={{
        animationDelay: `${index * 50}ms`
      }}
    >
      <div className="card-inner">
        {getCardContent()}
      </div>
      
      {/* Hint indicator */}
      {card.isHint && (
        <div className="hint-indicator animate-pulse">
          <span className="text-2xl">💡</span>
        </div>
      )}
      
      {/* Shake animation for wrong matches */}
      {card.isShaking && (
        <div className="shake-animation">
          <span className="text-2xl">❌</span>
        </div>
      )}
    </div>
  );
};

export default Card;