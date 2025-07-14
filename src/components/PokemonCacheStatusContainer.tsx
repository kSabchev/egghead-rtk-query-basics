import React from "react";
import { usePokemonListQuery } from "../api";
import { PokemonCacheStatus } from "./PokemonCacheStatus";

export function PokemonCacheStatusContainer({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  const { data } = usePokemonListQuery({ limit, offset });
  const pokemonNames = data?.results.map((p) => p.name) ?? [];
  return <PokemonCacheStatus pokemonNames={pokemonNames} />;
}