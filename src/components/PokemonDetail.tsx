
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Pokemon, PokemonSpecies, getEnglishDescription, getEnglishGenus, getPokemonSpecies } from '../services/pokemonService';
import LoadingSpinner from './LoadingSpinner';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onClose: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSpecies = async () => {
      try {
        setIsLoading(true);
        const speciesData = await getPokemonSpecies(pokemon.species.url);
        setSpecies(speciesData);
      } catch (error) {
        console.error("Error loading species data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpecies();

    // Add escape key listener
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [pokemon, onClose]);

  const formatPokemonId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const formatHeight = (height: number) => {
    return `${(height / 10).toFixed(1)}m`;
  };

  const formatWeight = (weight: number) => {
    return `${(weight / 10).toFixed(1)}kg`;
  };

  const formatStatName = (stat: string) => {
    switch (stat) {
      case 'hp': return 'HP';
      case 'attack': return 'Attack';
      case 'defense': return 'Defense';
      case 'special-attack': return 'Sp. Atk';
      case 'special-defense': return 'Sp. Def';
      case 'speed': return 'Speed';
      default: return stat;
    }
  };

  const getStatColor = (statName: string) => {
    switch (statName) {
      case 'hp': return 'bg-green-500';
      case 'attack': return 'bg-red-500';
      case 'defense': return 'bg-blue-500';
      case 'special-attack': return 'bg-purple-500';
      case 'special-defense': return 'bg-teal-500';
      case 'speed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatPercentage = (value: number) => {
    // Max stat value is typically around 255
    return Math.min((value / 255) * 100, 100);
  };

  const getTypeColor = (type: string) => {
    return `bg-type-${type}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-card rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <LoadingSpinner size="large" message="Loading details..." />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Pokemon image and basic info */}
            <div className="w-full md:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-xs">
                <img 
                  src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default} 
                  alt={pokemon.name}
                  className="w-full h-auto animate-float"
                />
                <h2 className="text-2xl font-bold capitalize mt-4 text-center">
                  {pokemon.name} <span className="text-gray-500">{formatPokemonId(pokemon.id)}</span>
                </h2>
                <div className="flex justify-center gap-2 mt-2">
                  {pokemon.types.map(({ type }) => (
                    <span 
                      key={type.name} 
                      className={`type-badge capitalize ${getTypeColor(type.name)}`}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
                {species && (
                  <div className="text-sm text-gray-600 mt-2 text-center">
                    {getEnglishGenus(species)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Pokemon details */}
            <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-[70vh] md:max-h-[90vh]">
              {/* Description */}
              {species && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Pokédex Entry</h3>
                  <p className="text-gray-700">{getEnglishDescription(species)}</p>
                </div>
              )}
              
              {/* Physical characteristics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Physical Characteristics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Height</div>
                    <div className="font-medium">{formatHeight(pokemon.height)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="font-medium">{formatWeight(pokemon.weight)}</div>
                  </div>
                </div>
              </div>
              
              {/* Abilities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map(({ ability }) => (
                    <span 
                      key={ability.name} 
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                    >
                      {ability.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Base Stats</h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {formatStatName(stat.stat.name)}
                        </span>
                        <span className="text-sm font-medium">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`${getStatColor(stat.stat.name)} h-2.5 rounded-full`} 
                          style={{ width: `${getStatPercentage(stat.base_stat)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;
