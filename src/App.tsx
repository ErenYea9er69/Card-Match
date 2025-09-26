import React, { useState, useEffect } from 'react';

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

  // Initialize and shuffle cards
  const shuffleCards = (): void => {
    setMatchedCards(0);
    setCardOne(null);
    setCardTwo(null);
    setDisableDeck(false);
    
    // Generate random image IDs from 1-32
    const availableImages = Array.from({ length: 32 }, (_, i) => i + 1);
    const shuffledImages = availableImages.sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, 8);
    
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
  };

  // Handle card flip
  const flipCard = (clickedCard: Card): void => {
    if (disableDeck) return;
    if (clickedCard === cardOne) return;
    if (clickedCard.isMatched) return;

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
    
    // Check for match after state updates
    setTimeout(() => {
      matchCards(cardOne, clickedCard);
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
      if (matchedCards + 1 === 8) {
        setTimeout(() => setShowResetPage(true), 500);
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
    setShowResetPage(false);
    shuffleCards();
  };

  // Initialize game on component mount
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[rgb(36,2,21)]">
      {!showResetPage ? (
        <div className="h-[700px] w-[700px] rounded-[10px] bg-[rgb(217,242,242)] p-[21px]">
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
                    src="/assets/img15_3.jpg" 
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
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-5">You Won!</h1>
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