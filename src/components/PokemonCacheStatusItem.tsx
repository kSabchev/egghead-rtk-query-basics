import React from "react";
import { api } from "../api";

export function PokemonCacheStatusItem({ pokemonName }: { pokemonName: string }) {
  const { isSuccess } = api.endpoints.pokemonDetail.useQueryState({
    name: pokemonName,
  });
  return (
    <>
      {pokemonName}: {isSuccess ? "✅" : "❌"}
    </>
  );
}