import React from 'react';
import type { Achievement, Difficulty } from './types/gameTypes';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  moves: number;
  time: number;
  score: number;
  difficulty: Difficulty;
  achievements: Achievement[];
}

const WinModal: React.FC<WinModalProps> = ({ 
  isOpen, 
  onClose, 
  onNewGame,
  moves,
  time,
  score,
  difficulty,
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

  const getDifficultyEmoji = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '🎮';
    }
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  const getRating = () => {
    const baseScore = 1000;
    const timeBonus = Math.max(0, 300 - time) * 2;
    const moveBonus = Math.max(0, 20 - moves) * 50;
    const totalScore = baseScore + timeBonus + moveBonus;

    if (totalScore >= 2000) return { stars: 3, label: 'Perfect!', color: 'text-yellow-400' };
    if (totalScore >= 1500) return { stars: 2, label: 'Great!', color: 'text-green-400' };
    if (totalScore >= 1000) return { stars: 1, label: 'Good!', color: 'text-blue-400' };
    return { stars: 0, label: 'Keep Trying!', color: 'text-gray-400' };
  };

  const rating = getRating();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-yellow-400/50 animate-scaleIn">
        {/* Celebration Animation */}
        <div className="absolute -top-4 -left-4 text-6xl animate-bounce">🎉</div>
        <div className="absolute -top-4 -right-4 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎊</div>
        <div className="absolute -bottom-4 -left-4 text-6xl animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute -bottom-4 -right-4 text-6xl animate-bounce" style={{ animationDelay: '1.5s' }}>🌟</div>

        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Congratulations!
          </h2>
          <p className="text-purple-200 text-lg">You completed the memory challenge!</p>
        </div>

        {/* Rating Stars */}
        <div className="text-center mb-6">
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3].map((star) => (
              <span 
                key={star}
                className={`text-4xl ${
                  star <= rating.stars ? 'text-yellow-400 animate-pulse' : 'text-gray-600'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
          <div className={`text-xl font-bold ${rating.color}`}>{rating.label}</div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/20">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-purple-200 text-sm">Time</div>
            <div className="text-white font-bold text-lg">{formatTime(time)}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/20">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-purple-200 text-sm">Moves</div>
            <div className="text-white font-bold text-lg">{moves}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/20">
            <div className="text-2xl mb-2">{getDifficultyEmoji(difficulty)}</div>
            <div className="text-purple-200 text-sm">Difficulty</div>
            <div className="text-white font-bold text-lg">{getDifficultyLabel(difficulty)}</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm p-4 rounded-xl text-center border border-yellow-400/30">
            <div className="text-2xl mb-2">🏅</div>
            <div className="text-yellow-200 text-sm">Score</div>
            <div className="text-yellow-100 font-bold text-lg">{formatScore(score)}</div>
          </div>
        </div>

        {/* New Achievements */}
        {achievements.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-white text-center mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">🎖️</span>
              New Achievements Unlocked!
            </h3>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-lg border border-yellow-400/30 animate-fadeIn"
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-bold border border-white/20"
          >
            Continue
          </button>
          <button
            onClick={() => {
              onNewGame();
              onClose();
            }}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;