import React from 'react';
import { Pause, Play, RotateCcw, Settings, Trophy, Home } from 'lucide-react';
import { useGame } from './GameContext';
import { GameUtils } from './utils';

const Header: React.FC = () => {
  const { state, actions } = useGame();
  const { gameState, gameStats, difficulty } = state;

  const handlePauseResume = () => {
    if (gameStats.isPaused) {
      actions.resumeGame();
    } else {
      actions.pauseGame();
    }
  };

  const handleNewGame = () => {
    if (gameState === 'playing' || gameState === 'paused') {
      if (window.confirm('Are you sure you want to start a new game? Current progress will be lost.')) {
        actions.startGame(difficulty.level);
      }
    } else {
      actions.setGameState('menu');
    }
  };

  const handleSettings = () => {
    actions.setGameState('settings');
  };

  const handleHighScores = () => {
    actions.setGameState('menu'); // Will show high scores in menu
  };

  const handleHome = () => {
    if (gameState === 'playing' || gameState === 'paused') {
      if (window.confirm('Are you sure you want to return to menu? Current progress will be lost.')) {
        actions.resetGame();
      }
    } else {
      actions.resetGame();
    }
  };

  return (
    <>
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
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600/80 to-indigo-700/80 backdrop-blur-md border border-purple-300/40 flex items-center justify-center overflow-hidden transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-lg">
              <video
                src="/vd/logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-7 w-7 object-cover rounded-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-105">
                MemoCard
              </span>
              {gameState === 'playing' && (
                <span className="text-xs text-purple-200 font-medium">
                  {difficulty.label} - {difficulty.pairs} pairs
                </span>
              )}
            </div>
          </div>

          {/* Center - Game Stats */}
          {(gameState === 'playing' || gameState === 'paused' || gameState === 'completed') && (
            <div className="hidden md:flex items-center gap-6 text-sm">
              {state.settings.showTimer && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                  <span className="text-purple-200">Time:</span>
                  <span className="font-bold text-white min-w-[3rem]">
                    {GameUtils.formatTime(gameStats.time)}
                  </span>
                </div>
              )}
              
              {state.settings.showMoves && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                  <span className="text-purple-200">Moves:</span>
                  <span className="font-bold text-white min-w-[2rem]">
                    {gameStats.moves}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                <span className="text-purple-200">Matches:</span>
                <span className="font-bold text-white">
                  {gameStats.matches}/{difficulty.pairs}
                </span>
              </div>

              {gameState === 'completed' && gameStats.score > 0 && (
                <div className="flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-400/30">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold text-yellow-100">
                    {gameStats.score}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Home Button */}
            <button
              onClick={handleHome}
              className="
                p-2 text-sm font-medium text-purple-700
                rounded-full cursor-pointer transition-all duration-300
                bg-gradient-to-r from-white to-purple-50
                hover:from-purple-50 hover:to-white hover:scale-110
                border border-purple-200/50 shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
              "
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* High Scores Button */}
            <button
              onClick={handleHighScores}
              className="
                px-3 py-2 text-sm font-medium text-purple-700
                rounded-full cursor-pointer transition-all duration-300
                bg-gradient-to-r from-white to-purple-50
                hover:from-purple-50 hover:to-white hover:scale-105
                border border-purple-200/50 shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
                hidden sm:flex items-center gap-1
              "
              title="High Scores"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden md:inline">Scores</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={handleSettings}
              className="
                p-2 text-sm font-medium text-purple-700
                rounded-full cursor-pointer transition-all duration-300
                bg-gradient-to-r from-white to-purple-50
                hover:from-purple-50 hover:to-white hover:scale-110
                border border-purple-200/50 shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
              "
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Pause/Resume Button - Only show during game */}
            {gameState === 'playing' && (
              <button
                onClick={handlePauseResume}
                className="
                  p-2 text-sm font-medium text-purple-700
                  rounded-full cursor-pointer transition-all duration-300
                  bg-gradient-to-r from-white to-purple-50
                  hover:from-purple-50 hover:to-white hover:scale-110
                  border border-purple-200/50 shadow-md hover:shadow-lg
                  transform hover:-translate-y-0.5
                "
                title={gameStats.isPaused ? "Resume Game" : "Pause Game"}
              >
                {gameStats.isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>
            )}

            {gameState === 'paused' && (
              <button
                onClick={handlePauseResume}
                className="
                  px-3 py-2 text-sm font-medium text-purple-700
                  rounded-full cursor-pointer transition-all duration-300
                  bg-gradient-to-r from-green-100 to-green-50
                  hover:from-green-50 hover:to-green-100 hover:scale-105
                  border border-green-200/50 shadow-md hover:shadow-lg
                  transform hover:-translate-y-0.5 animate-pulse
                  flex items-center gap-1
                "
                title="Resume Game"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Resume</span>
              </button>
            )}

            {/* New Game Button */}
            <button
              onClick={handleNewGame}
              className="
                px-4 py-2 text-sm font-medium text-purple-700
                rounded-full cursor-pointer transition-all duration-300
                bg-gradient-to-r from-white to-purple-50
                hover:from-purple-50 hover:to-white hover:scale-110
                border border-purple-200/50 shadow-md hover:shadow-lg
                flex items-center gap-1
                transform hover:-translate-y-1 hover:rotate-1
              "
              title="New Game"
            >
              <RotateCcw className="w-4 h-4 transform transition-transform duration-300 hover:rotate-180" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          </div>
        </div>

        {/* Mobile Stats Bar - Show below header on small screens */}
        {(gameState === 'playing' || gameState === 'paused' || gameState === 'completed') && (
          <div className="md:hidden absolute top-20 left-4 right-4 flex justify-center">
            <div className="flex items-center gap-3 text-sm bg-purple-800/80 backdrop-blur-md border border-purple-400/40 rounded-full px-4 py-2 text-white">
              {state.settings.showTimer && (
                <div className="flex items-center gap-1">
                  <span className="text-purple-200 text-xs">Time:</span>
                  <span className="font-bold">{GameUtils.formatTime(gameStats.time)}</span>
                </div>
              )}
              
              {state.settings.showMoves && (
                <div className="flex items-center gap-1">
                  <span className="text-purple-200 text-xs">Moves:</span>
                  <span className="font-bold">{gameStats.moves}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span className="text-purple-200 text-xs">Matches:</span>
                <span className="font-bold">{gameStats.matches}/{difficulty.pairs}</span>
              </div>

              {gameState === 'completed' && gameStats.score > 0 && (
                <div className="flex items-center gap-1 text-yellow-200">
                  <Trophy className="w-3 h-3" />
                  <span className="font-bold">{gameStats.score}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <style>{`
        @keyframes gradientShift {
          0% { 
            background-position: 0% 50%;
          }
          25% { 
            background-position: 100% 0%;
          }
          50% { 
            background-position: 100% 100%;
          }
          75% { 
            background-position: 0% 100%;
          }
          100% { 
            background-position: 0% 50%;
          }
        }
        
        @keyframes fadeInDown {
          0% { 
            opacity: 0; 
            transform: translateY(-30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 1s ease-out;
        }
        
        .animate-pulse-subtle {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
          }
          50% { 
            opacity: 0.95; 
          }
        }
      `}</style>
    </>
  );
};

export default Header;