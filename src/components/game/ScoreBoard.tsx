
import React, { useMemo } from 'react';
import { GameScore } from '@/pages/NumberGuessGame';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Trophy, Timer } from 'lucide-react';

interface ScoreBoardProps {
  scores: GameScore[];
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
  const formattedScores = useMemo(() => {
    return scores.map(score => ({
      ...score,
      date: new Date(score.date).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  }, [scores]);

  const bestScore = useMemo(() => {
    const successfulScores = scores.filter(score => score.success);
    if (successfulScores.length === 0) return null;
    
    return successfulScores.reduce((best, current) => {
      // If current used fewer attempts, it's better
      if (current.attemptsUsed < best.attemptsUsed) return current;
      // If same attempts but was faster, it's better
      if (current.attemptsUsed === best.attemptsUsed && 
          current.timeUsed && best.timeUsed && 
          current.timeUsed < best.timeUsed) return current;
      return best;
    }, successfulScores[0]);
  }, [scores]);

  if (scores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No games played yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="text-accent" /> Score History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bestScore && (
          <div className="mb-4 p-3 bg-accent/30 rounded-lg">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="text-accent" /> Best Score
            </h3>
            <p>
              Guessed the number {bestScore.number} in {bestScore.attemptsUsed} attempts
              {bestScore.timeUsed ? ` (${bestScore.timeUsed} seconds)` : ''} on {new Date(bestScore.date).toLocaleDateString()}.
            </p>
          </div>
        )}
        
        <div className="space-y-1">
          <div className="grid grid-cols-5 gap-2 font-medium text-sm border-b pb-2">
            <div>Date</div>
            <div>Difficulty</div>
            <div>Number</div>
            <div>Attempts</div>
            <div>Result</div>
          </div>
          
          {formattedScores.map((score, index) => (
            <div 
              key={index}
              className={`grid grid-cols-5 gap-2 text-sm py-2 border-b last:border-0`}
            >
              <div className="text-muted-foreground">{score.date}</div>
              <div className="capitalize">{score.difficulty}</div>
              <div>{score.number}</div>
              <div>
                {score.attemptsUsed}/{score.maxAttempts}
                {score.timeUsed && (
                  <span className="ml-2 text-xs flex items-center">
                    <Timer size={12} className="mr-1" />{score.timeUsed}s
                  </span>
                )}
              </div>
              <div>
                {score.success ? (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <Check size={16} className="mr-1" /> Won
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 dark:text-red-400">
                    <X size={16} className="mr-1" /> Lost
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreBoard;
