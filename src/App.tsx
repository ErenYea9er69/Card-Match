import React from 'react';
import { GameProvider, useGame } from './GameContext';
import Header from './Header';
import GameMenu from './GameMenu';
import GameBoard from './GameBoard';
import GameCompletion from './GameCompletion';
import GameSettings from './GameSettings';
import PauseOverlay from './PauseOverlay';

// Main Game Component
const GameContent: React.FC = () => {
  const { state } = useGame();
  const { gameState } = state;

  const renderGameContent = () => {
    switch (gameState) {
      case 'menu':
        return <GameMenu />;
      case 'playing':
        return (
          <div className="relative">
            <GameBoard />
          </div>
        );
      case 'paused':
        return (
          <div className="relative">
            <GameBoard />
            <PauseOverlay />
          </div>
        );
      case 'completed':
        return <GameCompletion />;
      case 'settings':
        return <GameSettings />;
      default:
        return <GameMenu />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated background particles */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-indigo-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-3 h-3 bg-purple-300/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-5 h-5 bg-indigo-300/20 rounded-full animate-pulse delay-3000"></div>
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-purple-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-indigo-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header - Show on all screens except menu */}
      {gameState !== 'menu' && <Header />}

      {/* Main Content */}
      <div 
        className={`
          transition-all duration-500 ease-in-out
          ${gameState !== 'menu' ? 'pt-16 md:pt-20' : ''}
        `}
      >
        {renderGameContent()}
      </div>

      {/* Global Styles */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: #1e1b4b;
          overflow-x: hidden;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
        
        /* Custom gradient backgrounds */
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        /* Smooth transitions for all interactive elements */
        button, a, input, select {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Focus styles for accessibility */
        button:focus, a:focus, input:focus, select:focus {
          outline: 2px solid rgba(139, 92, 246, 0.6);
          outline-offset: 2px;
        }
        
        /* Disable text selection for game elements */
        .select-none {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Custom animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        /* Loading states */
        .loading {
          position: relative;
          overflow: hidden;
        }
        
        .loading::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        
        /* Card flip 3D effects */
        .card-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        /* Responsive design helpers */
        @media (max-width: 640px) {
          .responsive-text {
            font-size: clamp(0.875rem, 2.5vw, 1rem);
          }
          
          .responsive-padding {
            padding: clamp(1rem, 4vw, 2rem);
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-white\/10 {
            background-color: rgba(255, 255, 255, 0.2);
          }
          
          .border-white\/20 {
            border-color: rgba(255, 255, 255, 0.4);
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
        }
        
        /* Dark mode enhancements */
        @media (prefers-color-scheme: dark) {
          body {
            background: #0f0e1a;
          }
        }
      `}</style>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default App;