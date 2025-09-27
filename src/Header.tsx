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
          bg-transparent backdrop-blur-md border border-gray-700 border-opacity-50 
          rounded-full shadow-2xl px-6 py-3
        "
      >
        {/* Game Title */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.png" // Assuming you have a logo, or you can remove this
            alt="MemoGame Logo"
            className="h-7 w-7 object-contain brightness-0 invert"
          />
          <span className="font-semibold text-xl">
            MemoGame
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Stats feature coming soon!')} // Placeholder action
            className="
              px-4 py-2 text-sm font-medium bg-white/10 text-white
              rounded-full cursor-pointer transition-colors duration-300
              hover:bg-white/20
            "
          >
            Stats
          </button>
          <button
            onClick={onNewGame}
            className="
              px-4 py-2 text-sm font-medium bg-white text-[#64042f]
              rounded-full cursor-pointer transition-all duration-300
              hover:bg-gray-200 hover:scale-105 flex items-center gap-1
            "
          >
            <span className="text-lg">+</span> New Game
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;