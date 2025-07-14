import React from "react";
import { api, usePokemonListQuery } from "../api";

export function PokemonList({
  onPokemonSelected,
  onPokemonHighlighted,
  limit,
  offset,
}: {
  onPokemonSelected: (pokemonName: string) => void;
  onPokemonHighlighted: (pokemonName: string | undefined) => void;
  limit: number;
  offset: number;
}) {
  const { isUninitialized, isLoading, isError, data } = usePokemonListQuery({
    limit,
    offset,
  });
  const prefetchPokemon = api.usePrefetch("pokemonDetail");

  if (isLoading || isUninitialized) {
    return <p>loading, please wait</p>;
  }

  if (isError || !data) {
    return <p>something went wrong</p>;
  }

  return (
    <article>
      <h2>Overview</h2>
      <ol start={offset + 1} onMouseLeave={() => onPokemonHighlighted(undefined)}>
        {data.results.map((pokemon) => (
          <li key={pokemon.name}>
            <button
              onClick={() => onPokemonSelected(pokemon.name)}
              onMouseEnter={() => {
                prefetchPokemon({ name: pokemon.name });
                onPokemonHighlighted(pokemon.name);
              }}
            >
              {pokemon.name}
            </button>
          </li>
        ))}
      </ol>
    </article>
  );
}
