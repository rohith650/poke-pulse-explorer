
import { Pokemon } from "../services/pokemonService";

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const formatPokemonId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const getTypeColor = (type: string) => {
    return `bg-type-${type}`;
  };

  return (
    <div 
      className="pokemon-card bg-card rounded-xl shadow-md overflow-hidden cursor-pointer relative"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="relative">
          {/* Pokemon image */}
          <div className="flex justify-center items-center h-40 mb-3 bg-gray-50 rounded-lg overflow-hidden">
            {pokemon.sprites && (
              <img 
                src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default} 
                alt={pokemon.name} 
                className="h-full object-contain animate-float"
              />
            )}
          </div>
          
          {/* Pokemon ID badge */}
          <span className="absolute top-2 right-2 text-xs font-semibold text-gray-500">
            {formatPokemonId(pokemon.id)}
          </span>
        </div>
        
        {/* Pokemon name */}
        <h2 className="text-lg font-bold capitalize mb-2 truncate">
          {pokemon.name}
        </h2>
        
        {/* Pokemon types */}
        <div className="flex flex-wrap gap-1 mt-2">
          {pokemon.types.map(({ type }) => (
            <span 
              key={type.name} 
              className={`type-badge capitalize ${getTypeColor(type.name)}`}
            >
              {type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
