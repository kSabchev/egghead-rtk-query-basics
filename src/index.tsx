import React from "react";
import ReactDOM from "react-dom/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

const generations = [
  { name: "All", limit: 10000, offset: 0 },
  { name: "Generation 1", limit: 151, offset: 0 },
  { name: "Generation 2", limit: 100, offset: 151 },
  { name: "Generation 3", limit: 135, offset: 251 },
  { name: "Generation 4", limit: 107, offset: 386 },
  { name: "Generation 5", limit: 156, offset: 493 },
  { name: "Generation 6", limit: 72, offset: 649 },
  { name: "Generation 7", limit: 88, offset: 721 },
  { name: "Generation 8", limit: 96, offset: 809 },
  { name: "Generation 9", limit: 120, offset: 905 },
];

interface PokemonListing {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}

interface PokemonDetailData {
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

const api = createApi({
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
    }),
  }),
});

const { usePokemonListQuery, usePokemonDetailQuery } = api;

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

function App() {
  const [selectedPokemon, selectPokemon] = React.useState<string | undefined>(
    undefined
  );
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
              limit={limit}
              offset={offset}
            />
            <PokemonCacheStatusContainer limit={limit} offset={offset} />
            <CacheActions />
          </div>
        )}
      </main>
    </>
  );
}

function GenerationSelector({
  selectedGeneration,
  onGenerationSelected,
}: {
  selectedGeneration: number;
  onGenerationSelected: (generationIndex: number) => void;
}) {
  return (
    <select
      value={selectedGeneration}
      onChange={(e) => onGenerationSelected(parseInt(e.target.value, 10))}
    >
      {generations.map((gen, index) => (
        <option key={gen.name} value={index}>
          {gen.name}
        </option>
      ))}
    </select>
  );
}

function PokemonList({
  onPokemonSelected,
  limit,
  offset,
}: {
  onPokemonSelected: (pokemonName: string) => void;
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

  if (isError) {
    return <p>something went wrong</p>;
  }

  return (
    <article>
      <h2>Overview</h2>
      <ol start={offset + 1}>
        {data.results.map((pokemon) => (
          <li key={pokemon.name}>
            <button
              onClick={() => onPokemonSelected(pokemon.name)}
              onMouseEnter={() => prefetchPokemon({ name: pokemon.name })}
            >
              {pokemon.name}
            </button>
          </li>
        ))}
      </ol>
    </article>
  );
}

function PokemonCacheStatusItem({ pokemonName }: { pokemonName: string }) {
  const { isSuccess } = api.endpoints.pokemonDetail.useQueryState({
    name: pokemonName,
  });
  return (
    <>
      {pokemonName}: {isSuccess ? "✅" : "❌"}
    </>
  );
}

function PokemonCacheStatus({ pokemonNames }: { pokemonNames: string[] }) {
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

function PokemonCacheStatusContainer({
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

function CacheActions() {
  const dispatch = useDispatch();
  const queries = useSelector((state: any) => state[api.reducerPath].queries);
  const cachedItems = Object.values(queries).filter(
    (query: any) =>
      query?.endpointName === "pokemonDetail" && query?.status === "fulfilled"
  ).length;

  const handleClearCache = () => {
    dispatch(api.util.resetApiState());
  };

  return (
    <article>
      <h2>Actions</h2>
      <p>Cached items: {cachedItems}</p>
      <button onClick={handleClearCache}>Clear Cache</button>
    </article>
  );
}

const listFormatter = new Intl.ListFormat("en-GB", {
  style: "short",
  type: "conjunction",
});
function PokemonDetails({ pokemonName }: { pokemonName: string }) {
  const { isUninitialized, isLoading, isError,  data } =
    usePokemonDetailQuery({
      name: pokemonName,
    });

  if (isLoading || isUninitialized) {
    return <p>loading, please wait</p>;
  }

  if (isError) {
    return <p>something went wrong</p>;
  }

  return (
    <article>
      <h2>{data.name}</h2>
      <img src={data.sprites.front_default} alt={data.name} />
      <ul>
        <li>id: {data.id}</li>
        <li>height: {data.height}</li>
        <li>weight: {data.weight}</li>
        <li>
          types:
          {listFormatter.format(data.types.map((item) => item.type.name))}
        </li>
      </ul>
    </article>
  );
}
