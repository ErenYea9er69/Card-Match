import React, { useState, useEffect } from 'react';
import type { Achievement } from './types/gameTypes';

interface AchievementSystemProps {
  achievements: Achievement[];
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ achievements }) => {
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  useEffect(() => {
    // Check for newly unlocked achievements
    const newlyUnlocked = achievements.filter(a => a.unlocked && !a.notified);
    if (newlyUnlocked.length > 0) {
      // Show notification for the first new achievement
      const achievement = newlyUnlocked[0];
      setShowNotification(achievement);
      
      // Mark as notified
      achievement.notified = true;
      
      // Hide notification after 4 seconds
      setTimeout(() => {
        setShowNotification(null);
      }, 4000);
    }
  }, [achievements]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;
  const completionPercentage = totalAchievements > 0 ? (unlockedAchievements.length / totalAchievements) * 100 : 0;

  return (
    <>
      {/* Achievement Notification */}
      {showNotification && (
        <div className="fixed top-24 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl shadow-2xl animate-slideInRight z-50 max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{showNotification.icon}</span>
            <div>
              <h4 className="font-bold text-lg">Achievement Unlocked!</h4>
              <p className="text-sm opacity-90">{showNotification.title}</p>
              <p className="text-xs opacity-75">{showNotification.description}</p>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-yellow-500 text-xs">✓</span>
          </div>
        </div>
      )}

      {/* Achievement Progress */}
      <div className="mt-8 animate-fadeInUp">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Achievements
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {unlockedAchievements.length}/{totalAchievements}
              </div>
              <div className="text-purple-200 text-sm">
                {completionPercentage.toFixed(0)}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  p-4 rounded-xl transition-all duration-300
                  ${achievement.unlocked
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 hover:scale-105'
                    : 'bg-white/5 border border-white/10 opacity-60'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    text-3xl transition-transform duration-300
                    ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}
                  `}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`
                      font-bold mb-1
                      ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}
                    `}>
                      {achievement.title}
                    </h4>
                    <p className={`
                      text-sm
                      ${achievement.unlocked ? 'text-purple-200' : 'text-gray-500'}
                    `}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-green-400 text-xl animate-pulse">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Motivational Message */}
          {completionPercentage < 100 && (
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                {completionPercentage === 0 
                  ? "Start playing to unlock your first achievement!"
                  : `Keep playing to unlock more achievements and rewards!`}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AchievementSystem;