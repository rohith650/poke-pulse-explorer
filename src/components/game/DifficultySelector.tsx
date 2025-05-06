
import React from 'react';
import { Difficulty } from '@/pages/NumberGuessGame';
import { Button } from '@/components/ui/button';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-center font-medium">Select Difficulty</h3>
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant={difficulty === 'easy' ? 'default' : 'outline'}
          onClick={() => onDifficultyChange('easy')}
          className="transition-all"
        >
          Easy
          <span className="text-xs ml-1 opacity-70">(1-50)</span>
        </Button>
        <Button 
          variant={difficulty === 'medium' ? 'default' : 'outline'}
          onClick={() => onDifficultyChange('medium')}
          className="transition-all"
        >
          Medium
          <span className="text-xs ml-1 opacity-70">(1-100)</span>
        </Button>
        <Button 
          variant={difficulty === 'hard' ? 'default' : 'outline'}
          onClick={() => onDifficultyChange('hard')}
          className="transition-all"
        >
          Hard
          <span className="text-xs ml-1 opacity-70">(1-200)</span>
        </Button>
      </div>
    </div>
  );
};

export default DifficultySelector;
