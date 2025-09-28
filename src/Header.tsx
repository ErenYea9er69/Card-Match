import React from 'react';

interface HeaderProps {
  onNewGame: () => void;
  onStatsClick?: () => void;
  onSettingsClick?: () => void;
  moves: number;
  time: number;
  bestScore?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onNewGame, 
  onStatsClick, 
  onSettingsClick,
  moves,
  time,
  bestScore
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center animate-fadeInDown">
      <div
        className="
          flex items-center justify-between text-white w-full max-w-2xl
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
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-600/80 to-indigo-700/80 backdrop-blur-md border border-purple-300/40 flex items-center justify-center overflow-hidden transform transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-lg">
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
          <span className="font-semibold text-xl bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-105">
            MemoCard
          </span>
        </div>

        {/* Game Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              <span className="text-purple-200">Time: </span>
              <span className="font-bold">{formatTime(time)}</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              <span className="text-purple-200">Moves: </span>
              <span className="font-bold">{moves}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStatsClick || (() => alert('Stats feature coming soon!'))}
            className="
              px-4 py-2 text-sm font-medium text-purple-700
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-r from-white to-purple-50
              hover:from-purple-50 hover:to-white hover:scale-105
              border border-purple-200/50 shadow-md hover:shadow-lg
              transform hover:-translate-y-0.5
            "
          >
            Stats
          </button>
          <button
            onClick={onSettingsClick || (() => alert('Settings feature coming soon!'))}
            className="
              px-4 py-2 text-sm font-medium text-purple-700
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-r from-white to-purple-50
              hover:from-purple-50 hover:to-white hover:scale-105
              border border-purple-200/50 shadow-md hover:shadow-lg
              transform hover:-translate-y-0.5
            "
          >
            Settings
          </button>
          <button
            onClick={onNewGame}
            className="
              px-4 py-2 text-sm font-medium text-purple-700
              rounded-full cursor-pointer transition-all duration-300
              bg-gradient-to-r from-white to-purple-50
              hover:from-purple-50 hover:to-white hover:scale-110
              border border-purple-200/50 shadow-md hover:shadow-lg
              flex items-center gap-1
              transform hover:-translate-y-1 hover:rotate-1
            "
          >
            <span className="text-lg transform transition-transform duration-300 hover:rotate-180">+</span> 
            New Game
          </button>
        </div>
      </div>

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
    </header>
  );
};

export default Header;