import React from 'react';
import { Play, Home, Settings, RotateCcw } from 'lucide-react';
import { useGame } from './GameContext';
import { GameUtils } from './utils';

const PauseOverlay: React.FC = () => {
  const { state, actions } = useGame();
  const { gameStats, difficulty } = state;

  const handleResume = () => {
    actions.resumeGame();
  };

  const handleNewGame = () => {
    if (window.confirm('Are you sure you want to start a new game? Current progress will be lost.')) {
      actions.startGame(difficulty.level);
    }
  };

  const handleMainMenu = () => {
    if (window.confirm('Are you sure you want to return to the main menu? Current progress will be lost.')) {
      actions.resetGame();
    }
  };

  const handleSettings = () => {
    actions.setGameState('settings');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">⏸️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Paused</h1>
          <p className="text-purple-200">Take a break and come back when ready!</p>
        </div>

        {/* Game Progress */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-white/10">
          <h3 className="text-white font-semibold text-lg mb-4 text-center">Current Progress</h3>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            {/* Time */}
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {GameUtils.formatTime(gameStats.time)}
              </div>
              <div className="text-purple-200 text-sm">Time Elapsed</div>
            </div>
            
            {/* Moves */}
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {gameStats.moves}
              </div>
              <div className="text-purple-200 text-sm">Moves Made</div>
            </div>
            
            {/* Matches */}
            <div className="col-span-2">
              <div className="text-2xl font-bold text-white mb-1">
                {gameStats.matches}/{difficulty.pairs}
              </div>
              <div className="text-purple-200 text-sm">Matches Found</div>
              
              {/* Progress Bar */}
              <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(gameStats.matches / difficulty.pairs) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Info */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            <span>{difficulty.label} Mode</span>
            <span>•</span>
            <span>{difficulty.pairs} pairs</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Resume Game - Primary Action */}
          <button
            onClick={handleResume}
            className="
              w-full group relative px-6 py-4 bg-gradient-to-r from-green-500 to-green-600
              text-white font-bold text-lg rounded-2xl shadow-lg
              hover:from-green-600 hover:to-green-700 hover:scale-105
              transform transition-all duration-300
              border border-green-400/30 overflow-hidden
            "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              <span>Resume Game</span>
            </div>
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleSettings}
              className="
                px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600
                text-white font-medium rounded-xl shadow-lg
                hover:from-purple-600 hover:to-purple-700 hover:scale-105
                transform transition-all duration-300
                border border-purple-400/30
                flex flex-col items-center gap-1
              "
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </button>

            <button
              onClick={handleNewGame}
              className="
                px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600
                text-white font-medium rounded-xl shadow-lg
                hover:from-yellow-600 hover:to-yellow-700 hover:scale-105
                transform transition-all duration-300
                border border-yellow-400/30
                flex flex-col items-center gap-1
              "
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-xs">New Game</span>
            </button>

            <button
              onClick={handleMainMenu}
              className="
                px-4 py-3 bg-gradient-to-r from-red-500 to-red-600
                text-white font-medium rounded-xl shadow-lg
                hover:from-red-600 hover:to-red-700 hover:scale-105
                transform transition-all duration-300
                border border-red-400/30
                flex flex-col items-center gap-1
              "
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Main Menu</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-medium text-sm mb-2">💡 Tip</h4>
          <p className="text-purple-200 text-xs">
            Taking breaks can help improve your focus and memory performance. 
            Your progress is safely saved!
          </p>
        </div>
      </div>

      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PauseOverlay;