import React, { useEffect, useState } from 'react';
import { Trophy, Star, Clock, MousePointer, RotateCcw, Home, Share } from 'lucide-react';
import { useGame } from './GameContext';
import { GameUtils } from './utils';

const GameCompletion: React.FC = () => {
  const { state, actions } = useGame();
  const { gameStats, difficulty, highScores } = state;
  const [showConfetti, setShowConfetti] = useState(true);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [congratsMessage, setCongratMessage] = useState('');

  useEffect(() => {
    // Generate random congratulations message
    setCongratMessage(GameUtils.getRandomCongratulations());
    
    // Check if this is a new record
    const currentScore = gameStats.score;
    const isHighScore = GameUtils.isHighScore(currentScore, highScores);
    setIsNewRecord(isHighScore);
    
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [gameStats.score, highScores]);

  const handlePlayAgain = () => {
    actions.startGame(difficulty.level);
  };

  const handleNewDifficulty = () => {
    actions.resetGame();
  };

  const handleShare = async () => {
    const shareText = `I just completed MemoCard ${difficulty.label} mode with a score of ${gameStats.score}! Time: ${GameUtils.formatTime(gameStats.time)}, Moves: ${gameStats.moves}. Can you beat it?`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MemoCard Game Result',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Score copied to clipboard!');
      });
    }
  };

  const getStarRating = () => {
    const maxPossibleScore = difficulty.pairs * 150; // Approximate max score
    return GameUtils.getStarRating(gameStats.score, maxPossibleScore);
  };

  const renderStars = () => {
    const rating = getStarRating();
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-8 h-8 transition-all duration-500 ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400 animate-pulse' 
            : 'text-gray-400'
        }`}
        style={{
          animationDelay: `${i * 0.2}s`
        }}
      />
    ));
  };

  const getPerformanceMessage = () => {
    const rating = getStarRating();
    const efficiency = difficulty.pairs * 2 / gameStats.moves;
    
    if (rating === 3) {
      return "Outstanding! Perfect memory!";
    } else if (rating === 2) {
      return "Great job! Excellent performance!";
    } else if (rating === 1) {
      return "Good work! Keep practicing!";
    } else if (efficiency > 0.8) {
      return "Nice efficiency! Few mistakes made!";
    } else {
      return "Well done! Room for improvement!";
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty.level) {
      case 'easy': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'hard': return 'from-orange-500 to-orange-600';
      case 'expert': return 'from-red-500 to-red-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Background Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                  Math.random() > 0.5 
                    ? 'from-yellow-400 to-yellow-500'
                    : 'from-purple-400 to-purple-500'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-2xl relative">
        {/* New Record Badge */}
        {isNewRecord && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg border border-yellow-400/30 animate-pulse">
              🏆 NEW HIGH SCORE! 🏆
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
            {congratsMessage}
          </h1>
          <p className="text-purple-200 text-lg">You completed the {difficulty.label} level!</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {renderStars()}
          </div>
        </div>

        {/* Performance Message */}
        <div className="text-center mb-8">
          <p className="text-white font-semibold text-lg mb-2">{getPerformanceMessage()}</p>
        </div>

        {/* Score Display */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {/* Final Score */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mb-3 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-2xl mb-1">{gameStats.score}</h3>
              <p className="text-purple-200 text-sm">Final Score</p>
            </div>

            {/* Time */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-2xl mb-1">{GameUtils.formatTime(gameStats.time)}</h3>
              <p className="text-purple-200 text-sm">Time Taken</p>
            </div>

            {/* Moves */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-lg">
                <MousePointer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-2xl mb-1">{gameStats.moves}</h3>
              <p className="text-purple-200 text-sm">Total Moves</p>
            </div>

            {/* Accuracy */}
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getDifficultyColor()} flex items-center justify-center mb-3 shadow-lg`}>
                <div className="text-white font-bold text-lg">
                  {Math.round((difficulty.pairs * 2 / gameStats.moves) * 100)}%
                </div>
              </div>
              <h3 className="text-white font-bold text-2xl mb-1">
                {difficulty.pairs * 2}/{gameStats.moves}
              </h3>
              <p className="text-purple-200 text-sm">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Difficulty Info */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getDifficultyColor()} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-white/20`}>
            <span className="capitalize">{difficulty.label}</span>
            <span>•</span>
            <span>{difficulty.pairs} pairs</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handlePlayAgain}
            className="
              group relative px-6 py-3 bg-gradient-to-r from-green-500 to-green-600
              text-white font-bold rounded-2xl shadow-lg
              hover:from-green-600 hover:to-green-700 hover:scale-105
              transform transition-all duration-300
              border border-green-400/30 overflow-hidden
              min-w-[160px]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </div>
          </button>

          <button
            onClick={handleNewDifficulty}
            className="
              px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600
              text-white font-bold rounded-2xl shadow-lg
              hover:from-purple-600 hover:to-purple-700 hover:scale-105
              transform transition-all duration-300
              border border-purple-400/30
              min-w-[160px]
            "
          >
            <div className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              <span>Main Menu</span>
            </div>
          </button>

          <button
            onClick={handleShare}
            className="
              px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600
              text-white font-bold rounded-2xl shadow-lg
              hover:from-blue-600 hover:to-blue-700 hover:scale-105
              transform transition-all duration-300
              border border-blue-400/30
              min-w-[160px]
            "
          >
            <div className="flex items-center justify-center gap-2">
              <Share className="w-5 h-5" />
              <span>Share</span>
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GameCompletion;