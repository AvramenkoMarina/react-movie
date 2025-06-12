import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Movie } from "../types/Movie";

export const selectAllMovies = (state: RootState) => state.allMovies.items;

export const selectMoviesStatus = (state: RootState) => state.allMovies.status;

export const selectMoviesError = (state: RootState) => state.allMovies.error;

export const selectMoviesLoaded = (state: RootState) => state.allMovies.loaded;

export const selectSearchQuery = (state: RootState) =>
  state.allMovies.searchQuery;

export const selectFilteredMovies = createSelector(
  [selectAllMovies, selectSearchQuery],
  (items, searchQuery) => {
    if (!items) return [];

    const query = searchQuery.toLowerCase();
    const moviesArray: Movie[] = Array.isArray(items)
      ? items
      : (Object.values(items) as Movie[]);

    return moviesArray.filter((movie) => {
      const titleMatch = movie.title?.toLowerCase().includes(query);
      const actorsMatch = movie.stars?.some((actor) =>
        actor.toLowerCase().includes(query),
      );
      return titleMatch || actorsMatch;
    });
  },
);
