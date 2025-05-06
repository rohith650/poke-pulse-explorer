
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowUp } from 'lucide-react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  actualMin?: number;
  actualMax?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onSubmit,
  min,
  max,
  disabled = false,
  actualMin,
  actualMax
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const actualMinValue = actualMin || min;
  const actualMaxValue = actualMax || max;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numberValue = Number(value);
    
    if (isNaN(numberValue) || numberValue < min || numberValue > max) {
      // Shake animation for invalid input
      setIsShaking(true);
      return;
    }
    
    onSubmit(numberValue);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only numbers and empty string for backspace
    if (/^\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };
  
  // Reset shake animation
  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="guess">Enter your guess:</Label>
      <div className="flex items-center space-x-2">
        <Input
          id="guess"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          placeholder={`Enter a number between ${actualMinValue} and ${actualMaxValue}`}
          className={`flex-1 ${isShaking ? 'animate-shake' : ''}`}
          disabled={disabled}
          aria-invalid={isShaking}
          min={min}
          max={max}
        />
        <Button type="submit" disabled={disabled || !value}>
          <ArrowUp className="mr-1" size={16} />
          Guess
        </Button>
      </div>
      {actualMin !== undefined && actualMax !== undefined && (
        <p className="text-xs text-muted-foreground">
          Based on your previous guesses, the number is between {actualMin} and {actualMax}
        </p>
      )}
    </form>
  );
};

export default NumberInput;
