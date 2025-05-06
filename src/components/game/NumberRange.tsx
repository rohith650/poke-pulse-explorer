
import React, { useMemo } from 'react';

interface NumberRangeProps {
  min: number;
  max: number;
  minGuessable: number;
  maxGuessable: number;
}

const NumberRange: React.FC<NumberRangeProps> = ({
  min,
  max,
  minGuessable,
  maxGuessable
}) => {
  const totalRange = max - min;
  
  // Calculate percentage positions for the visual range
  const leftPercentage = useMemo(() => {
    return ((minGuessable - min) / totalRange) * 100;
  }, [minGuessable, min, totalRange]);
  
  const rightPercentage = useMemo(() => {
    return ((max - maxGuessable) / totalRange) * 100;
  }, [maxGuessable, max, totalRange]);
  
  return (
    <div className="space-y-1">
      <div className="text-xs flex justify-between">
        <span>{min}</span>
        <span>Possible Range</span>
        <span>{max}</span>
      </div>
      <div className="h-6 relative bg-muted rounded-md overflow-hidden">
        {/* Eliminated range on left */}
        <div
          className="absolute left-0 top-0 h-full bg-muted-foreground/20 transition-all duration-300 ease-out"
          style={{ width: `${leftPercentage}%` }}
        />
        
        {/* Current possible range */}
        <div
          className="absolute top-0 h-full bg-accent transition-all duration-300 ease-out"
          style={{
            left: `${leftPercentage}%`,
            width: `${100 - leftPercentage - rightPercentage}%`
          }}
        />
        
        {/* Eliminated range on right */}
        <div
          className="absolute right-0 top-0 h-full bg-muted-foreground/20 transition-all duration-300 ease-out"
          style={{ width: `${rightPercentage}%` }}
        />
        
        {/* Current range values */}
        <div className="absolute inset-0 flex justify-between items-center px-2 text-xs font-medium">
          <span className="ml-1">{minGuessable}</span>
          <span className="mr-1">{maxGuessable}</span>
        </div>
      </div>
    </div>
  );
};

export default NumberRange;
