import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (level: 'easy' | 'medium' | 'hard') => void;
  onSoundToggle: () => void;
  soundEnabled: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  difficulty, 
  onDifficultyChange,
  onSoundToggle,
  soundEnabled
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Difficulty</h3>
            <div className="flex space-x-2">
              {(['easy', 'medium', 'hard'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => onDifficultyChange(level)}
                  className={`flex-1 py-2 rounded-lg ${
                    difficulty === level 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Sound Effects</span>
            <button
              onClick={onSoundToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                soundEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">How to Play</h3>
            <p className="text-gray-600 text-sm">
              Flip cards to find matching pairs. Match all pairs to win!
              Flip two cards at a time - if they match, they stay face up.
              If not, they will flip back over. Try to complete the game in as few moves as possible!
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;