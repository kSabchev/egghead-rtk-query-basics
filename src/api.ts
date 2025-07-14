import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PokemonDetailData, PokemonListing } from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://pokeapi.co/api/v2/",
  }),
  endpoints: (build) => ({
    pokemonList: build.query<PokemonListing, { limit: number; offset: number }>(
      {
        query({ limit, offset }) {
          return {
            url: "pokemon",
            params: { limit, offset },
            method: "GET",
          };
        },
      }
    ),
    pokemonDetail: build.query<PokemonDetailData, { name: string }>({
      query: ({ name }) => `pokemon/${name}/`,
      keepUnusedDataFor: 300, // Keep unused data in the cache for 5 minutes
    }),
  }),
});

export const { usePokemonListQuery, usePokemonDetailQuery } = api;