
// Types
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      }
    }
  };
  types: {
    type: {
      name: string;
    }
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    }
  }[];
  species: {
    url: string;
  };
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    }
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    }
  }[];
}

const BASE_URL = "https://pokeapi.co/api/v2";

export const getPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
};

export const getPokemonDetails = async (nameOrId: string | number): Promise<Pokemon> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for Pokemon ${nameOrId}:`, error);
    throw error;
  }
};

export const getPokemonSpecies = async (url: string): Promise<PokemonSpecies> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon species:", error);
    throw error;
  }
};

export const getAllPokemonTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/type`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.results.map((type: { name: string }) => type.name);
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
    throw error;
  }
};

// Helper function to get English description from species data
export const getEnglishDescription = (species: PokemonSpecies): string => {
  const entry = species.flavor_text_entries.find(
    entry => entry.language.name === "en"
  );
  
  return entry ? entry.flavor_text.replace(/\f/g, ' ') : "No description available.";
};

// Helper function to get English genus from species data
export const getEnglishGenus = (species: PokemonSpecies): string => {
  const genus = species.genera.find(
    entry => entry.language.name === "en"
  );
  
  return genus ? genus.genus : "Pokémon";
};

// Load multiple Pokemon details in parallel
export const loadPokemonBatch = async (items: PokemonListItem[]): Promise<Pokemon[]> => {
  try {
    const promises = items.map(item => {
      const id = item.url.split('/').filter(Boolean).pop();
      return getPokemonDetails(id || item.name);
    });
    
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error loading Pokemon batch:", error);
    throw error;
  }
};
