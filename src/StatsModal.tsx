import React from 'react';
import { type Achievement } from './types/gameTypes';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestScores: { [key: string]: number };
  moves: number;
  time: number;
  score: number;
  achievements: Achievement[];
}

const StatsModal: React.FC<StatsModalProps> = ({ 
  isOpen, 
  onClose, 
  bestScores, 
  moves, 
  time,
  score,
  achievements 
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatScore = (points: number) => {
    return points.toLocaleString();
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-purple-500/30 animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Game Statistics
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white text-3xl transition-colors hover:scale-110"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Game */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              Current Game
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Moves:</span>
                <span className="font-bold text-white text-lg">{moves}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Time:</span>
                <span className="font-bold text-white text-lg">{formatTime(time)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Score:</span>
                <span className="font-bold text-yellow-400 text-lg">{formatScore(score)}</span>
              </div>
            </div>
          </div>
          
          {/* Best Scores */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Best Scores
            </h3>
            {Object.keys(bestScores).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(bestScores).map(([level, score]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="text-purple-200 capitalize">{level}:</span>
                    <span className="font-bold text-green-400">{score} moves</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-200 text-center py-4">No best scores yet!</p>
            )}
          </div>
          
          {/* Achievements */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 md:col-span-2">
            <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎖️</span>
              Achievements
              <span className="text-sm font-normal text-purple-200">
                ({unlockedAchievements.length}/{totalAchievements})
              </span>
            </h3>
            {unlockedAchievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-400/30 animate-fadeIn"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-bold text-yellow-400">{achievement.title}</h4>
                        <p className="text-purple-200 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-200 text-center py-4">No achievements unlocked yet!</p>
            )}
          </div>
          
          {/* Game Tips */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 md:col-span-2">
            <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Pro Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-200">
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Start from the corners and work your way in</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Remember card positions even when they don't match</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Use power-ups strategically for tough situations</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Practice makes perfect - keep playing to improve!</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;