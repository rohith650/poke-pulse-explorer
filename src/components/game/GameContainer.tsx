
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Difficulty, GameState, GameSettings, GameScore } from '@/pages/NumberGuessGame';
import NumberInput from './NumberInput';
import FeedbackDisplay from './FeedbackDisplay';
import GameStats from './GameStats';
import DifficultySelector from './DifficultySelector';
import SettingsPanel from './SettingsPanel';
import GuessHistory from './GuessHistory';
import NumberRange from './NumberRange';
import { Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface GameContainerProps {
  gameState: GameState;
  settings: GameSettings;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onGameEnd: (score: GameScore) => void;
  onStartNewGame: () => void;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const GameContainer: React.FC<GameContainerProps> = ({
  gameState,
  settings,
  difficulty,
  onDifficultyChange,
  onGameEnd,
  onStartNewGame,
  setSettings
}) => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'initial' | 'too-high' | 'too-low' | 'correct' | 'invalid'>('initial');
  const [remainingAttempts, setRemainingAttempts] = useState<number>(settings.maxAttempts);
  const [timeRemaining, setTimeRemaining] = useState<number>(settings.timerSeconds);
  const [startTime, setStartTime] = useState<number>(0);
  const [minGuessable, setMinGuessable] = useState<number>(settings.minNumber);
  const [maxGuessable, setMaxGuessable] = useState<number>(settings.maxNumber);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a new random number when the game starts
  useEffect(() => {
    if (gameState === 'active') {
      const newNumber = Math.floor(
        Math.random() * (settings.maxNumber - settings.minNumber + 1) + settings.minNumber
      );
      setTargetNumber(newNumber);
      setGuesses([]);
      setFeedback('initial');
      setRemainingAttempts(settings.maxAttempts);
      setMinGuessable(settings.minNumber);
      setMaxGuessable(settings.maxNumber);
      setStartTime(Date.now());
      
      if (settings.timerEnabled) {
        setTimeRemaining(settings.timerSeconds);
        startTimer();
      }
      
      console.log('Debug - Target number:', newNumber); // For debugging - remove in production
    }
    
    // Clear timer when game ends or component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, settings]);
  
  // Timer logic
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up
          clearInterval(timerRef.current!);
          handleGameLost("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Handle guess submission
  const handleGuess = (guessValue: number) => {
    const guess = Number(guessValue);
    
    if (isNaN(guess) || guess < settings.minNumber || guess > settings.maxNumber) {
      setFeedback('invalid');
      return;
    }
    
    // Add to guess history
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    
    // Reduce remaining attempts
    const newRemainingAttempts = remainingAttempts - 1;
    setRemainingAttempts(newRemainingAttempts);
    
    // Compare guess with the target number
    if (guess === targetNumber) {
      handleGameWon();
    } else {
      // Update feedback and range
      if (guess > targetNumber) {
        setFeedback('too-high');
        setMaxGuessable(Math.min(maxGuessable, guess - 1));
      } else {
        setFeedback('too-low');
        setMinGuessable(Math.max(minGuessable, guess + 1));
      }
      
      // Check if out of attempts
      if (newRemainingAttempts <= 0) {
        handleGameLost("No more attempts!");
      }
    }
    
    // Clear the input
    setUserGuess('');
  };
  
  const handleGameWon = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setFeedback('correct');
    
    const timeUsed = Math.floor((Date.now() - startTime) / 1000);
    
    onGameEnd({
      date: new Date().toISOString(),
      difficulty,
      attemptsUsed: settings.maxAttempts - remainingAttempts + 1,
      maxAttempts: settings.maxAttempts,
      success: true,
      number: targetNumber,
      timeUsed: settings.timerEnabled ? settings.timerSeconds - timeRemaining : timeUsed,
    });
  };
  
  const handleGameLost = (reason: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    onGameEnd({
      date: new Date().toISOString(),
      difficulty,
      attemptsUsed: settings.maxAttempts - remainingAttempts,
      maxAttempts: settings.maxAttempts,
      success: false,
      number: targetNumber,
      timeUsed: settings.timerEnabled ? settings.timerSeconds - timeRemaining : undefined,
    });
  };
  
  return (
    <div className="space-y-6 fade-in">
      {gameState === 'initial' && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="text-center">Welcome to the Number Guessing Game!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              I'll think of a random number, and you'll try to guess it within the given attempts.
              I'll give you hints whether your guess is too high or too low.
            </p>
            
            <DifficultySelector
              difficulty={difficulty}
              onDifficultyChange={onDifficultyChange}
            />
            
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
              <div className="flex justify-center mb-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings size={16} />
                    Game Settings
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-4">
                <SettingsPanel
                  settings={settings}
                  setSettings={setSettings}
                  difficulty={difficulty}
                />
              </CollapsibleContent>
            </Collapsible>
            
            <div className="flex justify-center">
              <Button onClick={onStartNewGame} className="px-8">Start Game</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {gameState === 'active' && (
        <div className="space-y-6 fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Guess the Number!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GameStats 
                remainingAttempts={remainingAttempts}
                maxAttempts={settings.maxAttempts}
                timeRemaining={settings.timerEnabled ? timeRemaining : undefined}
              />
              
              <NumberRange
                min={settings.minNumber}
                max={settings.maxNumber}
                minGuessable={minGuessable}
                maxGuessable={maxGuessable}
              />
              
              <FeedbackDisplay 
                feedback={feedback} 
              />
              
              <NumberInput
                value={userGuess}
                onChange={setUserGuess}
                onSubmit={handleGuess}
                min={settings.minNumber}
                max={settings.maxNumber}
                disabled={gameState !== 'active'}
                actualMin={minGuessable}
                actualMax={maxGuessable}
              />
              
              <GuessHistory guesses={guesses} targetNumber={targetNumber} />
            </CardContent>
          </Card>
        </div>
      )}
      
      {(gameState === 'won' || gameState === 'lost') && (
        <Card className={`animate-fade-in ${gameState === 'won' ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader>
            <CardTitle className="text-center">
              {gameState === 'won' ? 'Congratulations! You won!' : 'Game Over!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-xl">
              {gameState === 'won' 
                ? `You guessed the number ${targetNumber} correctly!` 
                : `The number was ${targetNumber}.`}
            </p>
            
            <GameStats 
              remainingAttempts={remainingAttempts}
              maxAttempts={settings.maxAttempts}
              attemptsUsed={settings.maxAttempts - remainingAttempts}
              timeRemaining={settings.timerEnabled ? timeRemaining : undefined}
              isGameOver={true}
            />
            
            <GuessHistory 
              guesses={guesses} 
              targetNumber={targetNumber} 
              showTarget={true} 
            />
            
            <div className="flex justify-center pt-4">
              <Button onClick={() => {
                setFeedback('initial');
                onStartNewGame();
              }}>
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameContainer;
