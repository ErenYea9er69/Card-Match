import React from 'react';
import type { GameState } from './types/gameTypes';

interface HeaderProps {
  onNewGame: () => void;
  onPauseResume: () => void;
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
  onPauseResume,
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

  const isGameActive = gameState === 'playing' || gameState === 'paused';

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
          <div className="h-10 w-10 rounded-full overflow-hidden transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-lg">
            <video
              src="/vd/logo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-2xl bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-105">
            MemoCard
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
        <div className="flex items-center gap-4">
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
          
          {/* Pause/Resume Button - Only show when game is active */}
          {isGameActive && (
            <button
              onClick={onPauseResume}
              className={`
                px-6 py-2.5 text-sm font-bold text-white
                rounded-full cursor-pointer transition-all duration-300
                ${gameState === 'playing'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-red-400/50'
                  : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 border-yellow-400/50'
                }
                border shadow-lg hover:shadow-xl
                transform hover:-translate-y-0.5 active:scale-95 hover:scale-105
                flex items-center gap-2
              `}
            >
              <span className="text-lg">{gameState === 'playing' ? '⏸️' : '▶️'}</span>
              <span>{gameState === 'playing' ? 'Pause' : 'Resume'}</span>
            </button>
          )}
          
          {/* New Game Button */}
          <button
            onClick={onNewGame}
            className="
              px-6 py-2.5 text-sm font-bold text-white
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-r from-green-500 to-emerald-500
              hover:from-green-600 hover:to-emerald-600 hover:scale-105
              border border-green-400/50 shadow-lg hover:shadow-xl
              transform hover:-translate-y-0.5 active:scale-95
              flex items-center gap-2
            "
          >
            <span className="text-lg">🔄</span>
            <span>New Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;