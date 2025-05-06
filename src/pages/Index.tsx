
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import PokemonDetail from '../components/PokemonDetail';
import { 
  Pokemon, 
  PokemonListItem, 
  getAllPokemonTypes, 
  getPokemonList, 
  loadPokemonBatch 
} from '../services/pokemonService';

const POKEMON_PER_PAGE = 20;

const Index = () => {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Load initial Pokemon and types
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load Pokemon types
        const types = await getAllPokemonTypes();
        setPokemonTypes(types);
        
        // Load first batch of Pokemon
        const response = await getPokemonList(POKEMON_PER_PAGE);
        setNextUrl(response.next);
        
        const pokemon = await loadPokemonBatch(response.results);
        setAllPokemon(pokemon);
        setDisplayedPokemon(pokemon);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Failed to load Pokémon data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Load more Pokemon
  const loadMore = async () => {
    if (!nextUrl || loadingMore) return;
    
    try {
      setLoadingMore(true);
      
      // Extract offset from nextUrl
      const url = new URL(nextUrl);
      const response = await getPokemonList(
        POKEMON_PER_PAGE, 
        parseInt(url.searchParams.get('offset') || '0')
      );
      
      setNextUrl(response.next);
      
      const newPokemon = await loadPokemonBatch(response.results);
      
      setAllPokemon(prev => [...prev, ...newPokemon]);
      
      // Apply current filters to new Pokemon
      applyFilters([...allPokemon, ...newPokemon], searchQuery, selectedTypes);
    } catch (err) {
      console.error('Failed to load more Pokemon:', err);
      setError('Failed to load more Pokémon. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  // Apply filters (search and type)
  const applyFilters = useCallback((pokemon: Pokemon[], query: string, types: string[]) => {
    let filtered = pokemon;
    
    // Apply search filter
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerCaseQuery) || 
        p.id.toString() === query
      );
    }
    
    // Apply type filter
    if (types.length > 0) {
      filtered = filtered.filter(p => 
        p.types.some(t => types.includes(t.type.name))
      );
    }
    
    setDisplayedPokemon(filtered);
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    applyFilters(allPokemon, query, selectedTypes);
  }, [allPokemon, selectedTypes, applyFilters]);

  // Handle type filter toggle
  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes(prev => {
      const newTypes = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
        
      applyFilters(allPokemon, searchQuery, newTypes);
      return newTypes;
    });
  }, [allPokemon, searchQuery, applyFilters]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedTypes([]);
    applyFilters(allPokemon, searchQuery, []);
  }, [allPokemon, searchQuery, applyFilters]);

  // Show Pokemon detail
  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  // Close Pokemon detail
  const handleCloseDetail = () => {
    setSelectedPokemon(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-pokemon-red text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-1">PokéPulse Explorer</h1>
          <p className="text-center opacity-90">Explore the world of Pokémon</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter area */}
        <div className="mb-8 p-4 bg-card rounded-lg shadow">
          <SearchBar onSearch={handleSearch} />
          
          {pokemonTypes.length > 0 && (
            <TypeFilter 
              types={pokemonTypes}
              selectedTypes={selectedTypes}
              onTypeToggle={handleTypeToggle}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Pokemon grid */}
        {isLoading ? (
          <LoadingSpinner size="large" message="Loading Pokémon..." />
        ) : displayedPokemon.length > 0 ? (
          <>
            <div className="pokemon-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedPokemon.map(pokemon => (
                <PokemonCard 
                  key={pokemon.id} 
                  pokemon={pokemon}
                  onClick={() => handlePokemonClick(pokemon)}
                />
              ))}
            </div>
            
            {/* Load more button */}
            {nextUrl && displayedPokemon.length >= 10 && (
              <div className="mt-10 text-center">
                <button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-pokemon-blue hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md inline-flex items-center transition-colors disabled:opacity-70"
                >
                  {loadingMore ? (
                    <LoadingSpinner size="small" message="Loading..." />
                  ) : (
                    <>
                      Load More <ArrowDown className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No Pokémon found. Try adjusting your filters.</p>
          </div>
        )}
      </main>
      
      {/* Pokemon detail modal */}
      {selectedPokemon && (
        <PokemonDetail 
          pokemon={selectedPokemon} 
          onClose={handleCloseDetail} 
        />
      )}
      
      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>
            PokéPulse Explorer | Data from <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-pokemon-blue underline">PokéAPI</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
