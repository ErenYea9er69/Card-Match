import React from 'react';
import type { PowerUp } from './types/gameTypes';

interface PowerUpSystemProps {
  powerUps: PowerUp[];
  onUsePowerUp: (powerUpId: string) => void;
  disabled: boolean;
}

const PowerUpSystem: React.FC<PowerUpSystemProps> = ({ 
  powerUps, 
  onUsePowerUp, 
  disabled 
}) => {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'reveal': return '👁️';
      case 'shuffle': return '🔄';
      case 'hint': return '💡';
      case 'time': return '⏰';
      case 'freeze': return '❄️';
      default: return '🎯';
    }
  };

  const getPowerUpDescription = (type: string) => {
    switch (type) {
      case 'reveal': return 'Reveal all cards for 2 seconds';
      case 'shuffle': return 'Shuffle unmatched cards';
      case 'hint': return 'Highlight a matching pair';
      case 'time': return 'Add 30 seconds to timer';
      case 'freeze': return 'Freeze timer for 10 seconds';
      default: return 'Special power-up';
    }
  };

  if (powerUps.length === 0) return null;

  return (
    <div className="mb-8 animate-fadeInDown">
      <div className="flex items-center justify-center gap-4 mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          Power-ups
        </h3>
      </div>
      
      <div className="flex justify-center gap-4 flex-wrap">
        {powerUps.map((powerUp) => (
          <button
            key={powerUp.id}
            onClick={() => onUsePowerUp(powerUp.id)}
            disabled={disabled || powerUp.uses <= 0}
            className={`
              relative group
              p-4 rounded-xl transition-all duration-300
              ${powerUp.uses > 0 && !disabled
                ? 'bg-gradient-to-br from-purple-600/80 to-indigo-600/80 hover:from-purple-500 hover:to-indigo-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl border border-purple-400/50'
                : 'bg-gray-600/50 cursor-not-allowed opacity-50 border border-gray-500/30'
              }
            `}
          >
            {/* Power-up Icon */}
            <div className="text-3xl mb-2 group-hover:animate-bounce">
              {getPowerUpIcon(powerUp.type)}
            </div>
            
            {/* Power-up Name */}
            <div className="text-white font-bold text-sm mb-1">
              {powerUp.name}
            </div>
            
            {/* Uses Counter */}
            {powerUp.uses > 0 && (
              <div className="text-yellow-400 text-xs font-bold">
                {powerUp.uses} left
              </div>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
              {getPowerUpDescription(powerUp.type)}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
            </div>
            
            {/* Cooldown overlay */}
            {powerUp.cooldown && powerUp.cooldown > 0 && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">{powerUp.cooldown}s</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PowerUpSystem;