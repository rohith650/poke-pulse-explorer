
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import GameContainer from '@/components/game/GameContainer';
import ScoreBoard from '@/components/game/ScoreBoard';
import { toast } from '@/hooks/use-toast';
import { ThemeProvider } from '@/components/game/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';
export type GameState = 'initial' | 'active' | 'won' | 'lost';

export interface GameSettings {
  minNumber: number;
  maxNumber: number;
  maxAttempts: number;
  timerEnabled: boolean;
  timerSeconds: number;
  soundEnabled: boolean;
}

export interface GameScore {
  date: string;
  difficulty: Difficulty;
  attemptsUsed: number;
  maxAttempts: number;
  success: boolean;
  number: number;
  timeUsed?: number;
}

const difficultySettings: Record<Difficulty, Omit<GameSettings, 'soundEnabled' | 'timerEnabled' | 'timerSeconds'>> = {
  easy: { minNumber: 1, maxNumber: 50, maxAttempts: 10 },
  medium: { minNumber: 1, maxNumber: 100, maxAttempts: 7 },
  hard: { minNumber: 1, maxNumber: 200, maxAttempts: 7 },
  custom: { minNumber: 1, maxNumber: 100, maxAttempts: 10 },
};

const NumberGuessGame = () => {
  const [gameState, setGameState] = useState<GameState>('initial');
  const [settings, setSettings] = useState<GameSettings>({
    ...difficultySettings.medium,
    timerEnabled: false,
    timerSeconds: 60,
    soundEnabled: false,
  });
  const [scores, setScores] = useLocalStorage<GameScore[]>('number-game-scores', []);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showScoreboard, setShowScoreboard] = useState(false);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setSettings(prev => ({
      ...prev,
      ...difficultySettings[newDifficulty],
    }));
  }, []);

  const handleGameEnd = useCallback((score: GameScore) => {
    setScores(prev => [score, ...prev].slice(0, 10)); // Keep only top 10 scores
    
    if (score.success) {
      toast({
        title: "Congratulations! 🎉",
        description: `You guessed the number in ${score.attemptsUsed} attempts!`,
        duration: 5000,
      });
    }

    setGameState(score.success ? 'won' : 'lost');
  }, [setScores]);

  const startNewGame = useCallback(() => {
    setGameState('active');
  }, []);

  return (
    <ThemeProvider>
      <div className="container mx-auto p-4 mt-4 max-w-4xl fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-accent" size={32} /> 
            Number Guessing Game
          </h1>
          <p className="text-muted-foreground">Guess the secret number within the given range and attempts</p>
        </div>

        {showScoreboard ? (
          <div className="fade-in">
            <ScoreBoard scores={scores} />
            <div className="mt-4 flex justify-center">
              <Button onClick={() => setShowScoreboard(false)}>
                Back to Game
              </Button>
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <GameContainer 
              gameState={gameState} 
              settings={settings}
              difficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              onGameEnd={handleGameEnd}
              onStartNewGame={startNewGame}
              setSettings={setSettings}
            />

            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline"
                onClick={() => setShowScoreboard(true)}
              >
                View Score History
              </Button>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default NumberGuessGame;
