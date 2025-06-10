import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const selectFilteredMovies = createSelector(
  [
    (state: RootState) => state.allMovies.items,
    (state: RootState) => state.allMovies.searchQuery,
  ],
  (items, searchQuery) => {
    const query = searchQuery.toLowerCase();
    return items.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.stars.join(", ").toLowerCase().includes(query),
    );
  },
);
