import React from 'react';
import type { GameState } from './types/gameTypes';

interface HeaderProps {
  onNewGame: () => void;
  onStatsClick?: () => void;
  onSettingsClick?: () => void;
  moves: number;
  time: number;
  score: number;
  bestScore?: number;
  gameState: GameState;
}

const Header: React.FC<HeaderProps> = ({ 
  onNewGame, 
  onStatsClick, 
  onSettingsClick,
  moves,
  time,
  score,
  bestScore,
  gameState
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatScore = (points: number) => {
    return points.toLocaleString();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center animate-fadeInDown">
      <div
        className="
          flex items-center justify-between text-white w-full max-w-6xl
          bg-gradient-to-r from-purple-800/80 via-purple-700/80 to-indigo-800/80
          backdrop-blur-md border border-purple-400/40
          rounded-full shadow-2xl px-6 py-3
          transform transition-all duration-500 ease-out
          hover:scale-105 hover:shadow-purple-500/25 hover:shadow-3xl
          animate-pulse-subtle
        "
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(126, 34, 206, 0.8) 25%, rgba(124, 58, 237, 0.8) 50%, rgba(99, 102, 241, 0.8) 75%, rgba(139, 92, 246, 0.8) 100%)',
          animation: 'gradientShift 12s cubic-bezier(0.4, 0, 0.2, 1) infinite, fadeInDown 1s ease-out',
          backgroundSize: '400% 400%'
        }}
      >
        {/* Game Title */}
        <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600/80 to-indigo-700/80 backdrop-blur-md border border-purple-300/40 flex items-center justify-center overflow-hidden transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-lg">
            <div className="text-2xl animate-spin-slow">🎮</div>
          </div>
          <span className="font-bold text-2xl bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-105">
            MemoCard Pro
          </span>
        </div>

        {/* Game Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <span className="text-purple-200">Time: </span>
              <span className="font-bold text-white">{formatTime(time)}</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <span className="text-purple-200">Moves: </span>
              <span className="font-bold text-white">{moves}</span>
            </div>
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-300/30">
              <span className="text-yellow-200">Score: </span>
              <span className="font-bold text-yellow-100">{formatScore(score)}</span>
            </div>
            {bestScore && (
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-green-300/30">
                <span className="text-green-200">Best: </span>
                <span className="font-bold text-green-100">{bestScore} moves</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStatsClick || (() => alert('Stats feature coming soon!'))}
            className="
              px-5 py-2.5 text-sm font-medium text-purple-700
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-r from-white to-purple-50
              hover:from-purple-50 hover:to-white hover:scale-105
              border border-purple-200/50 shadow-md hover:shadow-lg
              transform hover:-translate-y-0.5 active:scale-95
              flex items-center gap-2
            "
          >
            <span className="text-lg">📊</span>
            <span>Stats</span>
          </button>
          
          <button
            onClick={onSettingsClick || (() => alert('Settings feature coming soon!'))}
            className="
              px-5 py-2.5 text-sm font-medium text-purple-700
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-r from-white to-purple-50
              hover:from-purple-50 hover:to-white hover:scale-105
              border border-purple-200/50 shadow-md hover:shadow-lg
              transform hover:-translate-y-0.5 active:scale-95
              flex items-center gap-2
            "
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </button>
          
          <button
            onClick={onNewGame}
            disabled={gameState === 'playing'}
            className="
              px-6 py-2.5 text-sm font-bold text-white
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-r from-green-500 to-emerald-500
              hover:from-green-600 hover:to-emerald-600 hover:scale-105
              border border-green-400/50 shadow-lg hover:shadow-xl
              transform hover:-translate-y-0.5 active:scale-95
              flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:scale-100 disabled:hover:-translate-y-0
            "
          >
            <span className="text-lg">🔄</span>
            <span>{gameState === 'playing' ? 'Playing...' : 'New Game'}</span>
          </button>
        </div>

        {/* Game State Indicator */}
        <div className="flex items-center gap-2">
          <div className={`
            w-3 h-3 rounded-full animate-pulse
            ${gameState === 'playing' ? 'bg-green-400' : 
              gameState === 'won' ? 'bg-yellow-400' : 
              'bg-gray-400'}
          `}></div>
          <span className="text-sm font-medium capitalize">
            {gameState === 'playing' ? 'Playing' : 
             gameState === 'won' ? 'Won!' : 
             'Ready'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;