
import React from 'react';
import { ArrowUp, ArrowDown, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FeedbackDisplayProps {
  feedback: 'initial' | 'too-high' | 'too-low' | 'correct' | 'invalid';
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  if (feedback === 'initial') {
    return (
      <Alert>
        <AlertDescription className="text-center">
          Make your first guess!
        </AlertDescription>
      </Alert>
    );
  }

  const feedbackConfig = {
    'too-high': {
      icon: <ArrowUp className="text-red-500" />,
      message: 'Your guess is too high!',
      className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
    },
    'too-low': {
      icon: <ArrowDown className="text-blue-500" />,
      message: 'Your guess is too low!',
      className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'
    },
    'correct': {
      icon: <Check className="text-green-500" />,
      message: 'Your guess is correct!',
      className: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300'
    },
    'invalid': {
      icon: <AlertCircle className="text-yellow-500" />,
      message: 'Please enter a valid number within the range.',
      className: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300'
    }
  };

  const { icon, message, className } = feedbackConfig[feedback];

  return (
    <Alert className={`transition-colors duration-300 fade-in ${className}`}>
      <div className="flex items-center justify-center gap-2">
        {icon}
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  );
};

export default FeedbackDisplay;
