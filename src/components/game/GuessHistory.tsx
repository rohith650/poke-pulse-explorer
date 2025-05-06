
import React from 'react';
import { ArrowUp, ArrowDown, CheckCircle, Crosshair } from 'lucide-react';

interface GuessHistoryProps {
  guesses: number[];
  targetNumber: number;
  showTarget?: boolean;
}

const GuessHistory: React.FC<GuessHistoryProps> = ({
  guesses,
  targetNumber,
  showTarget = false
}) => {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Guess History</h3>
      <div className="flex flex-wrap gap-2">
        {guesses.map((guess, index) => (
          <div 
            key={index}
            className={`
              flex items-center gap-1 px-2.5 py-1 text-sm rounded-full animate-fade-in
              ${guess === targetNumber 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : guess > targetNumber 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {guess === targetNumber ? (
              <CheckCircle size={14} />
            ) : guess > targetNumber ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
            {guess}
          </div>
        ))}
        
        {showTarget && (
          <div className="flex items-center gap-1 px-2.5 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 animate-pulse-light">
            <Crosshair size={14} />
            {targetNumber}
            <span className="text-xs ml-1">(Target)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessHistory;
