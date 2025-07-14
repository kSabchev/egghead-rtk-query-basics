import React from "react";  
import { generations } from "../data/generations";
import { CacheActions } from "./CacheActions";
import { GenerationSelector } from "./GenerationSelector";
import { HighlightedPokemonDetails } from "./HighlightedPokemonDetails";
import { LatestPokemon } from "./LatestPokemon";
import { PokemonCacheStatusContainer } from "./PokemonCacheStatusContainer";
import { PokemonDetails } from "./PokemonDetails";
import { PokemonList } from "./PokemonList";

export function App() {
  const [selectedPokemon, selectPokemon] = React.useState<string | undefined>(
    undefined
  );
  const [highlightedPokemon, setHighlightedPokemon] = React.useState<
    string | undefined
  >(undefined);
  const [generationIndex, setGenerationIndex] = React.useState(0);
  const { limit, offset } = generations[generationIndex];

  React.useEffect(() => {
    selectPokemon(undefined);
  }, [generationIndex]);

  return (
    <>
      <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1>My Pokedex</h1>
        <GenerationSelector
          selectedGeneration={generationIndex}
          onGenerationSelected={setGenerationIndex}
        />
      </header>
      <main>
        {selectedPokemon ? (
          <>
            <PokemonDetails pokemonName={selectedPokemon} />
            <button onClick={() => selectPokemon(undefined)}>back</button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "2rem" }}>
            <PokemonList
              onPokemonSelected={selectPokemon}
              onPokemonHighlighted={setHighlightedPokemon}
              limit={limit}
              offset={offset}
            />
            <PokemonCacheStatusContainer limit={limit} offset={offset} />
            <HighlightedPokemonDetails pokemonName={highlightedPokemon} />
            <LatestPokemon />
            <CacheActions />
          </div>
        )}
      </main>
    </>
  );
}