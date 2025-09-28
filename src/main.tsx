import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { useGameStore } from "./store/gameStore";

// Initialize game store values
const GameInitializer: React.FC = () => {
  const { initializeAchievements, initializePowerUps } = useGameStore();

  useEffect(() => {
    // Initialize achievements and power-ups on app start
    initializeAchievements();
    initializePowerUps();
  }, [initializeAchievements, initializePowerUps]);

  return null;
};

// Main App Wrapper
const MainApp: React.FC = () => {
  return (
    <React.StrictMode>
      <GameInitializer />
      <App />
    </React.StrictMode>
  );
};

// Mount the app
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<MainApp />);

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}