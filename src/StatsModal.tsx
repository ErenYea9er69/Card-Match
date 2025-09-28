import React from 'react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestScores: { [key: number]: number };
  moves: number;
  time: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ 
  isOpen, 
  onClose, 
  bestScores, 
  moves, 
  time 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Game Statistics</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Current Game</h3>
            <p className="text-gray-600">Moves: <span className="font-bold">{moves}</span></p>
            <p className="text-gray-600">Time: <span className="font-bold">{Math.floor(time / 60)}m {time % 60}s</span></p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Best Scores</h3>
            {Object.keys(bestScores).length > 0 ? (
              Object.entries(bestScores).map(([level, score]) => (
                <p key={level} className="text-gray-600">
                  Level {level}: <span className="font-bold">{score} moves</span>
                </p>
              ))
            ) : (
              <p className="text-gray-600">No best scores yet!</p>
            )}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatsModal;