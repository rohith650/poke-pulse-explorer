
import React from 'react';
import { X } from 'lucide-react';

interface TypeFilterProps {
  types: string[];
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClearFilters: () => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ 
  types, 
  selectedTypes, 
  onTypeToggle,
  onClearFilters
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Filter by Type</h2>
        {selectedTypes.length > 0 && (
          <button 
            onClick={onClearFilters} 
            className="text-xs flex items-center text-gray-500 hover:text-gray-700"
          >
            Clear All <X size={14} className="ml-1" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeToggle(type)}
            className={`
              type-badge capitalize bg-type-${type}
              ${selectedTypes.includes(type) 
                ? 'ring-2 ring-offset-2 ring-type-' + type 
                : 'opacity-70 hover:opacity-100'}
              transition-all
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
