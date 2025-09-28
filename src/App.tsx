import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import StatsModal from './StatsModal';
import SettingsModal from './SettingsModal';

interface Card {
  id: number;
  imageId: number;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking: boolean;
}

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardOne, setCardOne] = useState<Card | null>(null);
  const [cardTwo, setCardTwo] = useState<Card | null>(null);
  const [disableDeck, setDisableDeck] = useState<boolean>(false);
  const [matchedCards, setMatchedCards] = useState<number>(0);
  const [showResetPage, setShowResetPage] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [bestScores, setBestScores] = useState<{ [key: number]: number }>({});
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Calculate number of card pairs based on difficulty
  const getCardCount = useCallback((): number => {
    switch (difficulty) {
      case 'easy': return 6; // 6 pairs (12 cards)
      case 'medium': return 8; // 8 pairs (16 cards)
      case 'hard': return 10; // 10 pairs (20 cards)
      default: return 8;
    }
  }, [difficulty]);

  // Initialize and shuffle cards
  const shuffleCards = useCallback((): void => {
    setMatchedCards(0);
    setCardOne(null);
    setCardTwo(null);
    setDisableDeck(false);
    setMoves(0);
    setTime(0);
    setIsTimerRunning(false);
    setShowResetPage(false);
    
    const cardCount = getCardCount();
    
    // Generate random image IDs
    const availableImages = Array.from({ length: 23 }, (_, i) => i + 1);
    const shuffledImages = availableImages.sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, cardCount);
    
    // Create pairs and shuffle them
    const cardPairs = [...selectedImages, ...selectedImages];
    const shuffledPairs = cardPairs.sort(() => Math.random() - 0.5);
    
    const newCards: Card[] = shuffledPairs.map((imageId, index) => ({
      id: index,
      imageId,
      isFlipped: false,
      isMatched: false,
      isShaking: false
    }));
    
    setCards(newCards);
  }, [getCardCount]);

  // Handle card flip
  const flipCard = (clickedCard: Card): void => {
    if (disableDeck || clickedCard.isMatched || clickedCard.isFlipped) return;
    
    // Start timer on first move
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === clickedCard.id 
          ? { ...card, isFlipped: true }
          : card
      )
    );

    if (!cardOne) {
      setCardOne(clickedCard);
      return;
    }

    setCardTwo(clickedCard);
    setDisableDeck(true);
    setMoves(prev => prev + 1);
    
    // Check for match after state updates
    setTimeout(() => {
      if(cardOne) {
        matchCards(cardOne, clickedCard);
      }
    }, 0);
  };

  // Match cards logic
  const matchCards = (firstCard: Card, secondCard: Card): void => {
    if (firstCard.imageId === secondCard.imageId) {
      setMatchedCards(prev => prev + 1);
      
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      setCardOne(null);
      setCardTwo(null);
      setDisableDeck(false);
      
      // Check if all cards are matched
      if (matchedCards + 1 === getCardCount()) {
        setTimeout(() => {
          setIsTimerRunning(false);
          setShowResetPage(true);
          // Update best score if needed
          const currentLevel = getCardCount();
          if (!bestScores[currentLevel] || moves + 1 < bestScores[currentLevel]) {
            setBestScores(prev => ({
              ...prev,
              [currentLevel]: moves + 1
            }));
          }
        }, 500);
      }
    } else {
      // Show shake animation
      setTimeout(() => {
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isShaking: true }
              : card
          )
        );
      }, 300);

      // Remove flip and shake after animation
      setTimeout(() => {
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false, isShaking: false }
              : card
          )
        );
        
        setCardOne(null);
        setCardTwo(null);
        setDisableDeck(false);
      }, 800);
    }
  };

  // Reset game
  const resetGame = (): void => {
    shuffleCards();
  };

  // Initialize game on component mount
  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[rgb(36,2,21)]">
      <Header 
        onNewGame={resetGame} 
        onStatsClick={() => setShowStats(true)}
        onSettingsClick={() => setShowSettings(true)}
        moves={moves} 
        time={time}
        bestScore={bestScores[getCardCount()]}
      />
      
      {!showResetPage ? (
        <div className="h-[700px] w-[700px] rounded-[10px] bg-[rgb(217,242,242)] p-[21px] mt-20">
          <div className="h-full w-full flex flex-wrap justify-center gap-[10px]">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`
                  relative w-[150px] h-[150px] cursor-pointer
                  transition-transform duration-[250ms] ease-linear
                  [perspective:800px] [transform-style:preserve-3d]
                  ${card.isShaking ? 'animate-[shake_0.35s_ease-in]' : ''}
                `}
                onClick={() => flipCard(card)}
              >
                {/* Front view */}
                <div 
                  className={`
                    absolute w-full h-full [backface-visibility:hidden]
                    transition-transform duration-[220ms] ease-linear
                    select-none pointer-events-none
                    ${card.isFlipped ? 'rotate-y-180' : ''}
                  `}
                >
                  <img 
                    src="/assets/img0.jpg" 
                    alt="card-back"
                    className="w-full h-full rounded-[10px]"
                  />
                </div>
                
                {/* Back view */}
                <div 
                  className={`
                    absolute w-full h-full [backface-visibility:hidden]
                    transition-transform duration-[220ms] ease-linear
                    select-none pointer-events-none rotate-y-[-180deg]
                    ${card.isFlipped ? 'rotate-y-0' : ''}
                  `}
                >
                  <img 
                    src={`/assets/img${card.imageId}.jpg`}
                    alt="card-img"
                    className="w-full h-full rounded-[10px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-white mt-20">
          <h1 className="text-5xl font-bold mb-5">You Won!</h1>
          <p className="text-xl mb-2">Time: {formatTime(time)}</p>
          <p className="text-xl mb-5">Moves: {moves}</p>
          <button
            onClick={resetGame}
            className="
              px-4 py-2 mt-5 w-[180px] h-[60px] text-[25px]
              bg-[#64042f] text-[rgb(223,223,223)] border-none
              rounded-[6px] cursor-pointer
              transition-colors duration-300 ease-in-out
              hover:bg-[#06054973]
            "
          >
            Play Again
          </button>
        </div>
      )}

      <StatsModal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        bestScores={bestScores}
        moves={moves}
        time={time}
      />

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        soundEnabled={soundEnabled}
      />
      
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .rotate-y-\[-180deg\] {
          transform: rotateY(-180deg);
        }
      `}</style>
    </div>
  );
};

export default App;