import React, { useState } from 'react';
import { Play, Trophy, Settings, Star, Clock, MousePointer } from 'lucide-react';
import { useGame } from './GameContext';
import { type DifficultyLevel, DIFFICULTY_CONFIGS } from './types';
import { GameUtils } from './utils';

const GameMenu: React.FC = () => {
  const { state, actions } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');
  const [showHighScores, setShowHighScores] = useState(false);

  const handleStartGame = () => {
    actions.startGame(selectedDifficulty);
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleShowHighScores = () => {
    setShowHighScores(!showHighScores);
  };

  const handleSettings = () => {
    actions.setGameState('settings');
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'hard': return 'from-orange-500 to-orange-600';
      case 'expert': return 'from-red-500 to-red-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getStarRating = (score: number, difficulty: DifficultyLevel) => {
    const maxScore = DIFFICULTY_CONFIGS[difficulty].pairs * 150; // Approximate max score
    return GameUtils.getStarRating(score, maxScore);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
      />
    ));
  };

  if (showHighScores) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">High Scores</h1>
            <p className="text-purple-200">Your best performances</p>
          </div>

          <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
            {state.highScores.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-purple-200 text-lg">No high scores yet!</p>
                <p className="text-purple-300 text-sm">Play a game to set your first record.</p>
              </div>
            ) : (
              state.highScores.map((score, index) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-lg">{score.score}</span>
                        <div className="flex">
                          {renderStars(getStarRating(score.score, score.difficulty))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-purple-200">
                        <span className="capitalize bg-gradient-to-r {getDifficultyColor(score.difficulty)} px-2 py-1 rounded text-white text-xs font-medium">
                          {score.difficulty}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{GameUtils.formatTime(score.time)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          <span>{score.moves} moves</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-300 text-xs">
                      {new Date(score.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleShowHighScores}
              className="
                px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600
                text-white font-semibold rounded-xl shadow-lg
                hover:from-purple-700 hover:to-indigo-700 hover:scale-105
                transform transition-all duration-300
                border border-purple-500/30
              "
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600/80 to-indigo-700/80 backdrop-blur-md border border-purple-300/40 flex items-center justify-center overflow-hidden transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-2xl">
              <video
                src="/vd/logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-14 w-14 object-cover rounded-xl"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
              MemoCard
            </h1>
          </div>
          <p className="text-purple-200 text-xl">Test your memory with this exciting card matching game!</p>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">Choose Your Challenge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleDifficultyChange(config.level)}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                  ${selectedDifficulty === config.level
                    ? 'border-white bg-white/20 shadow-2xl scale-105'
                    : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getDifficultyColor(config.level)} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-bold text-lg">
                    {config.pairs}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{config.label}</h3>
                <p className="text-purple-200 text-sm mb-3">{config.description}</p>
                <div className="text-xs text-purple-300">
                  Time bonus: {config.timeBonus}s
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={handleStartGame}
            className="
              group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600
              text-white font-bold text-lg rounded-2xl shadow-2xl
              hover:from-green-600 hover:to-green-700 hover:scale-110
              transform transition-all duration-300
              border border-green-400/30 overflow-hidden
              min-w-[200px]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              <span>Start Game</span>
            </div>
          </button>

          <button
            onClick={handleShowHighScores}
            className="
              px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600
              text-white font-bold text-lg rounded-2xl shadow-lg
              hover:from-yellow-600 hover:to-yellow-700 hover:scale-105
              transform transition-all duration-300
              border border-yellow-400/30
              min-w-[200px]
            "
          >
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-6 h-6" />
              <span>High Scores</span>
            </div>
          </button>

          <button
            onClick={handleSettings}
            className="
              px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600
              text-white font-bold text-lg rounded-2xl shadow-lg
              hover:from-purple-600 hover:to-purple-700 hover:scale-105
              transform transition-all duration-300
              border border-purple-400/30
              min-w-[200px]
            "
          >
            <div className="flex items-center justify-center gap-3">
              <Settings className="w-6 h-6" />
              <span>Settings</span>
            </div>
          </button>
        </div>

        {/* Game Features */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold text-xl mb-4 text-center">Game Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-2">Timer & Scoring</h4>
              <p className="text-purple-200 text-sm">Track your time and compete for high scores</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-3">
                <MousePointer className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-2">Move Counter</h4>
              <p className="text-purple-200 text-sm">Challenge yourself to complete with fewer moves</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-2">Multiple Levels</h4>
              <p className="text-purple-200 text-sm">From easy 4x4 to expert 10x10 grids</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;