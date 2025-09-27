import React from 'react';

interface HeaderProps {
  onNewGame: () => void;
  // You can add more props like onStatsClick when you implement that feature
}

const Header: React.FC<HeaderProps> = ({ onNewGame }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center">
      <div
        className="
          flex items-center justify-between text-white w-full max-w-lg
          bg-purple-800 bg-opacity-80 backdrop-blur-md border border-purple-400 border-opacity-40
          rounded-full shadow-2xl px-6 py-3
        "
      >
        {/* Game Title */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-purple-700 bg-opacity-80 backdrop-blur-md border border-purple-400 border-opacity-40 flex items-center justify-center overflow-hidden">
            <video
              src="/vd/logo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-6 w-6 object-cover rounded-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <span className="font-semibold text-xl">
            MemoCard
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Stats feature coming soon!')} // Placeholder action
            className="
              px-4 py-2 text-sm font-medium text-black
              rounded-full cursor-pointer transition-colors duration-300
              hover:bg-gray-100 border-none
            "
            style={{ backgroundColor: 'white' }}
          >
            Stats
          </button>
          <button
            onClick={onNewGame}
            className="
              px-4 py-2 text-sm font-medium text-black
              rounded-full cursor-pointer transition-all duration-300
              hover:bg-gray-100 hover:scale-105 flex items-center gap-1 border-none
            "
            style={{ backgroundColor: 'white' }}
          >
            <span className="text-lg">+</span> New Game
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;