export interface PokemonListing {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonDetailData {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  sprites: {
    front_default: string;
  };
}