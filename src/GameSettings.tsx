import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Clock, MousePointer, RotateCcw, Palette } from 'lucide-react';
import { useGame } from './GameContext';
import { GameSettings as GameSettingsType } from './types';

const GameSettings: React.FC = () => {
  const { state, actions } = useGame();
  const [localSettings, setLocalSettings] = useState<GameSettingsType>(state.settings);

  const handleBack = () => {
    actions.setGameState('menu');
  };

  const handleSettingChange = (key: keyof GameSettingsType, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    actions.updateSettings({ [key]: value });
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings: GameSettingsType = {
        soundEnabled: true,
        musicEnabled: true,
        volume: 0.7,
        theme: 'default',
        showTimer: true,
        showMoves: true,
        autoFlipBack: true,
        flipDelay: 800
      };
      setLocalSettings(defaultSettings);
      actions.updateSettings(defaultSettings);
    }
  };

  const renderToggle = (enabled: boolean, onChange: (value: boolean) => void) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300
        ${enabled ? 'bg-green-500' : 'bg-gray-600'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
          ${enabled ? 'translate-x-7' : 'translate-x-1'}
        `}
      />
    </button>
  );

  const renderSlider = (value: number, onChange: (value: number) => void, min: number = 0, max: number = 1, step: number = 0.1) => (
    <div className="flex items-center gap-3 w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
      />
      <span className="text-white font-medium min-w-[3rem] text-right">
        {typeof value === 'number' && value < 1 
          ? `${Math.round(value * 100)}%`
          : `${value}${step >= 1 ? '' : 's'}`
        }
      </span>
    </div>
  );

  const renderSelect = (value: string, options: { value: string; label: string }[], onChange: (value: string) => void) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        bg-white/10 backdrop-blur-sm text-white rounded-lg px-3 py-2 
        border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50
        outline-none transition-all duration-300
      "
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-purple-900 text-white">
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="
              p-2 text-white hover:bg-white/10 rounded-full
              transition-all duration-300 hover:scale-110
            "
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-white">Game Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Sound Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-purple-300" />
              Audio Settings
            </h2>
            
            <div className="space-y-6">
              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Sound Effects</h3>
                  <p className="text-purple-200 text-sm">Play sound effects for card flips and matches</p>
                </div>
                {renderToggle(localSettings.soundEnabled, (value) => handleSettingChange('soundEnabled', value))}
              </div>

              {/* Background Music */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Background Music</h3>
                  <p className="text-purple-200 text-sm">Play ambient background music</p>
                </div>
                {renderToggle(localSettings.musicEnabled, (value) => handleSettingChange('musicEnabled', value))}
              </div>

              {/* Volume Control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    {localSettings.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    Master Volume
                  </h3>
                </div>
                {renderSlider(localSettings.volume, (value) => handleSettingChange('volume', value))}
              </div>
            </div>
          </div>

          {/* Game Display Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-purple-300" />
              Display Settings
            </h2>
            
            <div className="space-y-6">
              {/* Show Timer */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Show Timer</h3>
                  <p className="text-purple-200 text-sm">Display elapsed time during gameplay</p>
                </div>
                {renderToggle(localSettings.showTimer, (value) => handleSettingChange('showTimer', value))}
              </div>

              {/* Show Move Counter */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                    <MousePointer className="w-4 h-4" />
                    Show Move Counter
                  </h3>
                  <p className="text-purple-200 text-sm">Display number of moves made</p>
                </div>
                {renderToggle(localSettings.showMoves, (value) => handleSettingChange('showMoves', value))}
              </div>
            </div>
          </div>

          {/* Gameplay Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-purple-300" />
              Gameplay Settings
            </h2>
            
            <div className="space-y-6">
              {/* Auto Flip Back */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Auto Flip Back</h3>
                  <p className="text-purple-200 text-sm">Automatically flip cards back when they don't match</p>
                </div>
                {renderToggle(localSettings.autoFlipBack, (value) => handleSettingChange('autoFlipBack', value))}
              </div>

              {/* Flip Delay */}
              {localSettings.autoFlipBack && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">Flip Back Delay</h3>
                  </div>
                  <p className="text-purple-200 text-sm mb-3">
                    How long to wait before flipping non-matching cards back
                  </p>
                  {renderSlider(
                    localSettings.flipDelay / 1000, 
                    (value) => handleSettingChange('flipDelay', value * 1000),
                    0.3,
                    2.0,
                    0.1
                  )}
                </div>
              )}
            </div>
          </div>

                        {/* Theme Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Palette className="w-6 h-6 text-purple-300" />
              Appearance
            </h2>
            
            <div className="space-y-6">
              {/* Game Theme */}
              <div>
                <h3 className="text-white font-medium mb-3">Game Theme</h3>
                <p className="text-purple-200 text-sm mb-3">Choose the visual theme for your cards</p>
                {renderSelect(
                  localSettings.theme,
                  [
                    { value: 'default', label: 'Default' },
                    { value: 'animals', label: 'Animals' },
                    { value: 'nature', label: 'Nature' },
                    { value: 'space', label: 'Space' }
                  ],
                  (value) => handleSettingChange('theme', value)
                )}
              </div>
            </div>
          </div>

          {/* Reset Settings */}
          <div className="flex justify-center">
            <button
              onClick={handleResetSettings}
              className="
                px-6 py-3 bg-gradient-to-r from-red-500 to-red-600
                text-white font-semibold rounded-xl shadow-lg
                hover:from-red-600 hover:to-red-700 hover:scale-105
                transform transition-all duration-300
                border border-red-400/30
                flex items-center gap-2
              "
            >
              <RotateCcw className="w-5 h-5" />
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-medium mb-3">About Game Settings</h3>
          <div className="text-purple-200 text-sm space-y-2">
            <p>• Settings are automatically saved and will persist between game sessions</p>
            <p>• Sound effects enhance the gaming experience but can be disabled</p>
            <p>• Timer and move counter help track your performance and improvement</p>
            <p>• Flip delay can be adjusted based on your preference and skill level</p>
          </div>
        </div>
      </div>

      <style>{`
        .slider {
          background: linear-gradient(to right, #8b5cf6 0%, #06b6d4 100%);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #8b5cf6;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #8b5cf6;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #8b5cf6 0%, #06b6d4 100%);
        }
        
        select option {
          background-color: #581c87;
          color: white;
          padding: 8px;
        }
        
        select option:hover {
          background-color: #6b21a8;
        }
      `}</style>
    </div>
  );
};

export default GameSettings;