// utils.ts - Game utility functions

import { Card, HighScore, GameStats, DifficultyConfig, GameSettings } from './types';

export class GameUtils {
  // Generate shuffled cards for the game
  static generateCards(difficulty: DifficultyConfig): Card[] {
    const totalImages = 50; // Assuming you have 50 different images
    const availableImages = Array.from({ length: totalImages }, (_, i) => i + 1);
    const shuffledImages = availableImages.sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, difficulty.pairs);
    
    // Create pairs and shuffle them
    const cardPairs = [...selectedImages, ...selectedImages];
    const shuffledPairs = cardPairs.sort(() => Math.random() - 0.5);
    
    return shuffledPairs.map((imageId, index) => ({
      id: index,
      imageId,
      isFlipped: false,
      isMatched: false,
      isShaking: false
    }));
  }

  // Calculate score based on time, moves, and difficulty
  static calculateScore(stats: GameStats, difficulty: DifficultyConfig): number {
    if (!stats.isCompleted) return 0;
    
    const baseScore = difficulty.pairs * 100;
    const timeBonus = Math.max(0, difficulty.timeBonus - stats.time);
    const movesPenalty = Math.max(0, stats.moves - difficulty.pairs) * 10;
    const difficultyMultiplier = this.getDifficultyMultiplier(difficulty.level);
    
    const score = Math.round((baseScore + timeBonus - movesPenalty) * difficultyMultiplier);
    return Math.max(100, score);
  }

  private static getDifficultyMultiplier(level: string): number {
    switch (level) {
      case 'easy': return 1.0;
      case 'medium': return 1.5;
      case 'hard': return 2.0;
      case 'expert': return 2.5;
      default: return 1.0;
    }
  }

  // Format time display
  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Generate unique ID for high scores
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save high scores to localStorage (with error handling for Claude environment)
  static saveHighScores(scores: HighScore[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('memorycard_highscores', JSON.stringify(scores));
      }
    } catch (error) {
      console.warn('Unable to save high scores:', error);
    }
  }

  // Load high scores from localStorage
  static loadHighScores(): HighScore[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('memorycard_highscores');
        return stored ? JSON.parse(stored) : [];
      }
    } catch (error) {
      console.warn('Unable to load high scores:', error);
    }
    return [];
  }

  // Save game settings
  static saveSettings(settings: GameSettings): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('memorycard_settings', JSON.stringify(settings));
      }
    } catch (error) {
      console.warn('Unable to save settings:', error);
    }
  }

  // Load game settings
  static loadSettings(): GameSettings | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('memorycard_settings');
        return stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      console.warn('Unable to load settings:', error);
    }
    return null;
  }

  // Check if score qualifies for high scores list
  static isHighScore(score: number, highScores: HighScore[], maxScores: number = 10): boolean {
    if (highScores.length < maxScores) return true;
    return score > Math.min(...highScores.map(s => s.score));
  }

  // Add new high score and maintain top 10
  static addHighScore(newScore: HighScore, highScores: HighScore[]): HighScore[] {
    const updatedScores = [...highScores, newScore];
    return updatedScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  // Get grid dimensions based on difficulty
  static getGridDimensions(difficulty: DifficultyConfig): { columns: number; rows: number } {
    const totalCards = difficulty.pairs * 2;
    const columns = difficulty.gridSize;
    const rows = Math.ceil(totalCards / columns);
    return { columns, rows };
  }

  // Check if two cards match
  static cardsMatch(card1: Card, card2: Card): boolean {
    return card1.imageId === card2.imageId && card1.id !== card2.id;
  }

  // Get star rating based on performance
  static getStarRating(score: number, maxPossibleScore: number): number {
    const percentage = (score / maxPossibleScore) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  }

  // Validate game state
  static validateGameState(cards: Card[]): boolean {
    const flippedCards = cards.filter(card => card.isFlipped && !card.isMatched);
    return flippedCards.length <= 2;
  }

  // Get random congratulations message
  static getRandomCongratulations(): string {
    const messages = [
      "Excellent memory!",
      "Outstanding performance!",
      "Fantastic job!",
      "Memory master!",
      "Incredible focus!",
      "Well done!",
      "Amazing recall!",
      "Perfect match!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Debounce function for performance
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }

  // Deep clone object
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

// Sound management class
export class SoundManager {
  private static sounds: Map<string, HTMLAudioElement> = new Map();
  private static masterVolume: number = 0.7;
  private static enabled: boolean = true;

  static initialize(): void {
    // In a real implementation, you would load actual audio files
    // For now, we'll create silent audio elements as placeholders
    const soundFiles = ['flip', 'match', 'win', 'button', 'error'];
    
    soundFiles.forEach(soundName => {
      const audio = new Audio();
      // audio.src = `/sounds/${soundName}.mp3`; // Uncomment when you have actual sound files
      audio.volume = this.masterVolume;
      this.sounds.set(soundName, audio);
    });
  }

  static play(soundName: string): void {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.warn);
    }
  }

  static setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.masterVolume;
    });
  }

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  static getVolume(): number {
    return this.masterVolume;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }
}