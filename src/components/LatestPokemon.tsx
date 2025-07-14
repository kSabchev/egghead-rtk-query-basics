
import React from "react";

import { api } from "../api";
import { useSelector } from "react-redux";
import { PokemonDetails } from "./PokemonDetails";
import { store } from "../store";
// This component displays the latest fetched Pokémon details.



// By exporting the RootState, we can use it with the `useSelector` hook for type safety.
export type RootState = ReturnType<typeof store.getState>;

export function LatestPokemon() {
  const queries = useSelector((state: RootState) => state[api.reducerPath].queries);

  // Using `sort` is a safer and more readable way to find the latest item.
  const latestPokemonQuery = Object.values(queries)
    .filter(
      (query) =>
        query?.endpointName === "pokemonDetail" &&
        query?.status === "fulfilled"
    )
    .sort((a, b) => {
      // Defensively handle cases where properties might be undefined to satisfy TypeScript
      const timeA = a?.startedTimeStamp ?? 0;
      const timeB = b?.startedTimeStamp ?? 0;
      return timeB - timeA;
    })[0];

  // After filtering, we know that `originalArgs` will be an object with a `name` property.
  // We can safely use a type assertion to inform the compiler of this shape.
  const latestPokemonName: string | undefined =
    (latestPokemonQuery?.originalArgs as { name: string } | undefined)?.name;

  return (
    <article>
      <h2>Latest Fetched</h2>
      {latestPokemonName ? (
        <PokemonDetails pokemonName={latestPokemonName} />
      ) : (
        <p>No Pokémon fetched yet.</p>
      )}
    </article>
  );
}