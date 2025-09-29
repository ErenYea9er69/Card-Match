import React, { useState, useEffect } from 'react';
import type { Card as CardType } from './types/gameTypes';
import { getImagePathForId } from './utils/gameUtils';

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
    // Card back - New unique geometric pattern design
    if (!card.isFlipped && !card.isMatched) {
      return (
        <div className="card-back relative w-full h-full rounded-xl overflow-hidden">
          {/* Multi-layered geometric background */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
              background: `
                radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.8) 0%, transparent 35%),
                radial-gradient(circle at 75% 25%, rgba(99, 102, 241, 0.8) 0%, transparent 35%),
                radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.8) 0%, transparent 35%),
                radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.8) 0%, transparent 35%),
                linear-gradient(45deg, 
                  rgba(147, 51, 234, 0.1) 0%, 
                  rgba(99, 102, 241, 0.1) 25%, 
                  rgba(168, 85, 247, 0.1) 50%, 
                  rgba(139, 92, 246, 0.1) 75%, 
                  rgba(147, 51, 234, 0.1) 100%
                ),
                repeating-conic-gradient(
                  from 0deg at 50% 50%,
                  rgba(255, 255, 255, 0.1) 0deg,
                  transparent 15deg,
                  rgba(255, 255, 255, 0.1) 30deg,
                  transparent 45deg
                )
              `,
              backgroundSize: '80px 80px, 80px 80px, 80px 80px, 80px 80px, 100% 100%, 40px 40px',
            }}
          ></div>
          
          {/* Border gradient */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              border: '3px solid',
              borderImage: 'linear-gradient(45deg, #9333ea, #6366f1, #a855f7, #8b5cf6) 1',
              boxShadow: `
                0 0 20px rgba(147, 51, 234, 0.3),
                inset 0 0 20px rgba(255, 255, 255, 0.1),
                0 8px 32px rgba(0, 0, 0, 0.3)
              `
            }}
          ></div>

          {/* Central ornamental design */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-spin" style={{animationDuration: '8s'}}></div>
              {/* Inner counter-spinning ring */}
              <div className="absolute inset-2 rounded-full border-2 border-purple-300/50 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
              {/* Center diamond */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-white/40 to-purple-200/40 rotate-45 rounded-sm shadow-inner"></div>
              </div>
              {/* Corner dots with staggered pulse */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
          
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-white/40"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-white/40"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-white/40"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-white/40"></div>
          
          {/* Subtle crosshatch pattern overlay */}
          <div 
            className="absolute inset-0 opacity-20 rounded-xl" 
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255, 255, 255, 0.1) 10px,
                  rgba(255, 255, 255, 0.1) 11px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 10px,
                  rgba(255, 255, 255, 0.1) 10px,
                  rgba(255, 255, 255, 0.1) 11px
                )
              `
            }}
          ></div>

          {/* Original card shine effect */}
          <div className="card-shine"></div>
        </div>
      );
    }

    // Card front (matched or flipped) - Show image
    return (
      <div className="card-front relative w-full h-full rounded-xl overflow-hidden">
        <div className="card-image w-full h-full">
          <img 
            src={getImagePathForId(card.imageId)} 
            alt={`Card ${card.imageId}`}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
        </div>
        {card.isMatched && (
          <div className="match-effect absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <div className="sparkles text-4xl animate-bounce">✨</div>
          </div>
        )}
      </div>
    );
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
        <div className="hint-indicator animate-pulse absolute -top-2 -right-2 z-10 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
          <span className="text-2xl">💡</span>
        </div>
      )}
      
      {/* Shake animation for wrong matches */}
      {card.isShaking && (
        <div className="shake-animation absolute -top-2 -right-2 z-10 bg-red-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg animate-shake">
          <span className="text-2xl">❌</span>
        </div>
      )}
    </div>
  );
};

export default Card;