import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useSoundStore } from './store/soundStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { 
    difficulty, 
    setDifficulty, 
    soundEnabled, 
    setSoundEnabled,
    theme,
    setTheme,
    resetGame
  } = useGameStore();

  const { 
    musicVolume, 
    setMusicVolume, 
    sfxVolume, 
    setSfxVolume 
  } = useSoundStore();

  const [activeTab, setActiveTab] = useState<'game' | 'audio' | 'visual'>('game');

  if (!isOpen) return null;

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    // Reset game with new difficulty
    resetGame();
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'neon') => {
    setTheme(newTheme);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-purple-500/30 animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Settings
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white text-3xl transition-colors hover:scale-110"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white/10 rounded-xl p-1">
          {(['game', 'audio', 'visual'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300
                ${activeTab === tab 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Game Settings */}
        {activeTab === 'game' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                Game Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 mb-3 font-medium">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['easy', 'medium', 'hard'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => handleDifficultyChange(level)}
                        className={`
                          py-3 px-4 rounded-xl font-bold transition-all duration-300
                          ${difficulty === level 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                            : 'bg-white/10 text-purple-200 hover:bg-white/20 hover:text-white'
                          }
                        `}
                      >
                        <div className="text-lg mb-1">
                          {level === 'easy' ? '🟢' : level === 'medium' ? '🟡' : '🔴'}
                        </div>
                        <div>{level.charAt(0).toUpperCase() + level.slice(1)}</div>
                        <div className="text-xs opacity-75">
                          {level === 'easy' ? '6 pairs' : level === 'medium' ? '8 pairs' : '12 pairs'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl">
                  <h4 className="font-bold text-white mb-2">How to Play</h4>
                  <div className="text-purple-200 text-sm space-y-2">
                    <p>• Click cards to flip them and find matching pairs</p>
                    <p>• Match all pairs to win the game</p>
                    <p>• Use power-ups to help when you're stuck</p>
                    <p>• Complete achievements to unlock rewards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Settings */}
        {activeTab === 'audio' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🔊</span>
                Audio Settings
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 font-medium">Sound Effects</span>
                  <button
                    onClick={handleSoundToggle}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      soundEnabled ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        soundEnabled ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-purple-200 mb-3 font-medium">
                    Background Music Volume
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-purple-300">🔇</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(Number(e.target.value))}
                      disabled={!soundEnabled}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-purple-300">🔊</span>
                  </div>
                  <div className="text-center mt-2 text-purple-300">
                    {musicVolume}%
                  </div>
                </div>

                <div>
                  <label className="block text-purple-200 mb-3 font-medium">
                    Sound Effects Volume
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-purple-300">🔇</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sfxVolume}
                      onChange={(e) => setSfxVolume(Number(e.target.value))}
                      disabled={!soundEnabled}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-purple-300">🔊</span>
                  </div>
                  <div className="text-center mt-2 text-purple-300">
                    {sfxVolume}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Settings */}
        {activeTab === 'visual' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                Visual Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 mb-3 font-medium">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['dark', 'light', 'neon'] as const).map(themeOption => (
                      <button
                        key={themeOption}
                        onClick={() => handleThemeChange(themeOption)}
                        className={`
                          py-3 px-4 rounded-xl font-bold transition-all duration-300
                          ${theme === themeOption 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                            : 'bg-white/10 text-purple-200 hover:bg-white/20 hover:text-white'
                          }
                        `}
                      >
                        <div className="text-lg mb-1">
                          {themeOption === 'dark' ? '🌙' : themeOption === 'light' ? '☀️' : '💫'}
                        </div>
                        <div>{themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl">
                  <h4 className="font-bold text-white mb-2">Performance Tips</h4>
                  <div className="text-purple-200 text-sm space-y-2">
                    <p>• Use 'Dark' theme for better battery life on OLED screens</p>
                    <p>• 'Light' theme is easier to read in bright environments</p>
                    <p>• 'Neon' theme provides the most visual effects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;