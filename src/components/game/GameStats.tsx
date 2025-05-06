
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Timer, Target } from 'lucide-react';

interface GameStatsProps {
  remainingAttempts: number;
  maxAttempts: number;
  attemptsUsed?: number;
  timeRemaining?: number;
  isGameOver?: boolean;
}

const GameStats: React.FC<GameStatsProps> = ({
  remainingAttempts,
  maxAttempts,
  attemptsUsed,
  timeRemaining,
  isGameOver = false
}) => {
  // Calculate percentage of attempts used
  const attemptsPercentage = ((maxAttempts - remainingAttempts) / maxAttempts) * 100;
  const timePercentage = timeRemaining !== undefined ? (timeRemaining / 60) * 100 : 0;

  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-primary" />
          <span className="text-sm font-medium">Attempts:</span>
        </div>
        <span className="text-sm font-medium">
          {isGameOver ? `${attemptsUsed} used` : `${remainingAttempts} left`} / {maxAttempts}
        </span>
      </div>
      <Progress 
        value={attemptsPercentage} 
        className={`h-2 ${attemptsPercentage > 75 ? 'bg-red-100' : attemptsPercentage > 50 ? 'bg-yellow-100' : 'bg-green-100'}`}
      />

      {timeRemaining !== undefined && (
        <>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <Timer size={18} className="text-accent" />
              <span className="text-sm font-medium">Time:</span>
            </div>
            <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
          </div>
          <Progress 
            value={timePercentage} 
            className={`h-2 ${timeRemaining < 10 ? 'bg-red-100' : timeRemaining < 30 ? 'bg-yellow-100' : 'bg-blue-100'}`}
          />
        </>
      )}
    </div>
  );
};

export default GameStats;
