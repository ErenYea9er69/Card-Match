import React from 'react';
import { useGame } from './GameContext';
import { GameUtils } from './utils';

const GameBoard: React.FC = () => {
  const { state, actions } = useGame();
  const { cards, difficulty, isProcessing } = state;

  const handleCardClick = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || isProcessing) {
      return;
    }

    // Don't allow more than 2 cards to be flipped
    const flippedCards = cards.filter(c => c.isFlipped && !c.isMatched);
    if (flippedCards.length >= 2) {
      return;
    }

    actions.flipCard(cardId);
  };

  const { columns } = GameUtils.getGridDimensions(difficulty);

  // Calculate card size based on difficulty and screen size
  const getCardSize = () => {
    const baseSize = 120;
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 640) { // Mobile
      return Math.max(60, Math.min(baseSize, (screenWidth - 40) / columns - 8));
    } else if (screenWidth < 1024) { // Tablet
      return Math.max(80, Math.min(baseSize, (screenWidth - 100) / columns - 10));
    } else { // Desktop
      return Math.max(100, Math.min(baseSize, 800 / columns - 10));
    }
  };

  const cardSize = getCardSize();

  // Calculate container size
  const containerWidth = Math.min(800, columns * (cardSize + 10) - 10 + 40);
  const gridGap = Math.max(4, Math.min(10, cardSize / 12));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      {/* Game Board Container */}
      <div 
        className="relative bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-5 sm:p-8"
        style={{
          width: `${containerWidth}px`,
          maxWidth: '95vw'
        }}
      >
        {/* Difficulty Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-purple-400/30">
            {difficulty.label} - {difficulty.pairs} pairs
          </div>
        </div>

        {/* Game Grid */}
        <div 
          className="grid justify-center"
          style={{
            gridTemplateColumns: `repeat(${columns}, ${cardSize}px)`,
            gap: `${gridGap}px`
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                relative cursor-pointer transition-all duration-300 ease-out
                hover:scale-105 hover:-translate-y-1 hover:shadow-2xl
                [perspective:1000px] [transform-style:preserve-3d]
                ${card.isShaking ? 'animate-shake' : ''}
                ${card.isMatched ? 'opacity-70 scale-95' : ''}
                ${isProcessing && !card.isFlipped ? 'pointer-events-none opacity-50' : ''}
              `}
              style={{
                width: `${cardSize}px`,
                height: `${cardSize}px`
              }}
              onClick={() => handleCardClick(card.id)}
            >
              {/* Card Front (Back Design) */}
              <div 
                className={`
                  absolute w-full h-full [backface-visibility:hidden]
                  transition-transform duration-500 ease-out
                  select-none pointer-events-none
                  rounded-xl overflow-hidden shadow-lg border-2 border-white/20
                  ${card.isFlipped ? '[transform:rotateY(180deg)]' : ''}
                `}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]"></div>
                  
                  {/* Card back design */}
                  <div className="absolute inset-2 border border-white/30 rounded-lg flex items-center justify-center">
                    <div className="text-white/40 text-2xl font-bold transform rotate-45">
                      ?
                    </div>
                  </div>
                  
                  {/* Sparkle effect */}
                  <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
              
              {/* Card Back (Image) */}
              <div 
                className={`
                  absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(-180deg)]
                  transition-transform duration-500 ease-out
                  select-none pointer-events-none
                  rounded-xl overflow-hidden shadow-lg border-2 border-white/20
                  ${card.isFlipped ? '[transform:rotateY(0deg)]' : ''}
                `}
              >
                <img 
                  src={`/assets/img${card.imageId}.jpg`}
                  alt="card-content"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Success overlay for matched cards */}
                {card.isMatched && (
                  <div className="absolute inset-0 bg-green-500/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-xl animate-pulse">✓</div>
                  </div>
                )}
                
                {/* Glow effect for matched cards */}
                {card.isMatched && (
                  <div className="absolute inset-0 rounded-xl animate-pulse">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/30 to-blue-400/30 animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when no cards */}
        {cards.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-white/60 text-center">
              <div className="text-6xl mb-4">🎴</div>
              <p className="text-lg">Loading cards...</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 w-full max-w-md">
        <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/20">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ 
              width: `${(state.gameStats.matches / difficulty.pairs) * 100}%` 
            }}
          >
            <div className="h-full bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-purple-200 mt-2">
          <span>{state.gameStats.matches} matches</span>
          <span>{difficulty.pairs} total</span>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-3px) translateY(-1px); }
          50% { transform: translateX(3px) translateY(1px); }
          75% { transform: translateX(-2px) translateY(-1px); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        /* Custom card flip animations */
        [transform\:rotateY\(180deg\)] {
          transform: rotateY(180deg);
        }
        
        [transform\:rotateY\(-180deg\)] {
          transform: rotateY(-180deg);
        }
        
        [transform\:rotateY\(0deg\)] {
          transform: rotateY(0deg);
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .grid {
            gap: 0.25rem;
          }
        }
        
        /* Smooth hover effects */
        @media (hover: hover) {
          .cursor-pointer:hover {
            filter: brightness(1.1);
          }
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GameBoard;