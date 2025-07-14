import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api";
import { store } from "../store";


// By exporting the RootState, we can use it with the `useSelector` hook for type safety.
type RootState = ReturnType<typeof store.getState>;

export function CacheActions() {
  const dispatch = useDispatch();
  const queries = useSelector((state: RootState) => state[api.reducerPath].queries);
  const cachedItems = Object.values(queries).filter(
    (query) =>
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