import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shuffle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from 'react-markdown';
import './App.css';

interface FlashCard {
  id: number;
  sideA: string;
  sideB: string;
}

const App: React.FC = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    setCards((prevCards) => {
      const shuffled = [...prevCards].sort(() => Math.random() - 0.5);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      return shuffled;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContent(event.target.value);
  };

  const handleStartGame = () => {
    try {
      const parsedCards = JSON.parse(inputContent);
      if (Array.isArray(parsedCards) && parsedCards.length > 0) {
        setCards(parsedCards.map((card, index) => ({ ...card, id: index + 1 })));
        setIsGameStarted(true);
      } else {
        alert('Please enter valid JSON array of cards');
      }
    } catch (error) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  if (!isGameStarted) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Textarea
          placeholder="Enter JSON array of cards. Example: [{'sideA': '**Question 1**', 'sideB': 'Answer 1'}, ...]"
          value={inputContent}
          onChange={handleInputChange}
          className="mb-4"
          rows={10}
        />
        <Button onClick={handleStartGame}>Start Game</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 w-screen flex flex-col justify-center">
      <div className="flex justify-center mb-4 flex-grow">
        <Card 
          className="w-full max-w-[800px] aspect-video cursor-pointer"
          onClick={handleFlip}
        >
          <div 
            className={`card-inner w-full h-full flex items-center justify-center p-10 ${
              isFlipped ? 'is-flipped' : ''
            }`}
          >
            <div className="card-face card-front bg-[#E2F3FF]">
              <ReactMarkdown className="text-[30px] leading-[44px] text-[#2D2D2D] font-['Source_Sans_3']" components={{strong: ({node, ...props}) => <span {...props} />}}>
                {cards[currentCardIndex]?.sideA || ''}
              </ReactMarkdown>
            </div>
            <div className="card-face card-back bg-[#FFFCE2]">
              <ReactMarkdown className="text-[30px] leading-[44px] text-[#2D2D2D] font-['Source_Sans_3']" components={{strong: ({node, ...props}) => <span {...props} />}}>
                {cards[currentCardIndex]?.sideB || ''}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <Button onClick={handlePrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
        <Button onClick={handleShuffle}><Shuffle className="mr-2 h-4 w-4" /> Shuffle</Button>
      </div>
      <p className="text-center">
        Card {currentCardIndex + 1} of {cards.length}
      </p>
    </div>
  );
};

export default App;