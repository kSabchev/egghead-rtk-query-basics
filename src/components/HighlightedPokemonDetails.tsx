
import React from "react";
import { PokemonDetails } from "./PokemonDetails";

export function HighlightedPokemonDetails({ pokemonName }: { pokemonName?: string }) {
  return (
    <article>
      <h2>Highlighted</h2>
      {pokemonName ? (
        <PokemonDetails pokemonName={pokemonName} />
      ) : (
        <p>
          Hover over a Pokémon
          <br />
          to see details.
        </p>
      )}
    </article>
  );
}