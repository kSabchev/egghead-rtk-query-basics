import React from "react";
import { PokemonCacheStatusItem } from "./PokemonCacheStatusItem";

export function PokemonCacheStatus({ pokemonNames }: { pokemonNames: string[] }) {
  return (
    <article>
      <h2>Cache Status</h2>
      <ul>
        {pokemonNames.map((name) => (
          <li key={name}>
            <PokemonCacheStatusItem pokemonName={name} />
          </li>
        ))}
      </ul>
    </article>
  );
}