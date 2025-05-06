
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader className={`${sizeClasses[size]} text-pokemon-blue animate-rotate`} />
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
