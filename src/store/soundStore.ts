// src/store/soundStore.ts
import { create } from 'zustand';

interface SoundStore {
  musicVolume: number;
  sfxVolume: number;
  isMusicPlaying: boolean;
  
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setIsMusicPlaying: (playing: boolean) => void;
  
  playSound: (soundType: string) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  musicVolume: 50,
  sfxVolume: 70,
  isMusicPlaying: false,

  setMusicVolume: (musicVolume: number) => set({ musicVolume }),
  setSfxVolume: (sfxVolume: number) => set({ sfxVolume }),
  setIsMusicPlaying: (isMusicPlaying: boolean) => set({ isMusicPlaying }),

  playSound: (soundType: string) => {
    const { sfxVolume } = get();
    // In a real implementation, you would play the actual sound file
    console.log(`Playing sound: ${soundType} at volume: ${sfxVolume}%`);
    
    // Mock sound playing - in production, use actual audio files
    try {
      // Create a simple beep sound for demonstration
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sound types
      const frequencies: { [key: string]: number } = {
        flip: 400,
        match: 600,
        mismatch: 200,
        win: 800,
        powerup: 500,
        achievement: 700,
        shuffle: 300
      };
      
      oscillator.frequency.setValueAtTime(frequencies[soundType] || 400, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime((sfxVolume / 100) * 0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not available in this environment');
    }
  },

  playBackgroundMusic: () => {
    const { musicVolume } = get();
    set({ isMusicPlaying: true });
    console.log(`Playing background music at volume: ${musicVolume}%`);
    // In a real implementation, you would start playing the background music
  },

  stopBackgroundMusic: () => {
    set({ isMusicPlaying: false });
    console.log('Stopping background music');
    // In a real implementation, you would stop the background music
  }
}));