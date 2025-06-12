import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "../types/Movie";
import { Status } from "../types/Status";
import {
  fetchMovies,
  addMovie as apiAddMovie,
  uploadMovies,
} from "../api/moviesApi";

export interface MoviesState {
  items: Movie[];
  error: boolean;
  loaded: boolean;
  searchQuery: string;
  sortAscending: boolean;
  status: Status;
  token: string;
}

const initialState: MoviesState = {
  items: [],
  error: false,
  loaded: false,
  searchQuery: "",
  sortAscending: true,
  status: "idle",
  token: "",
};

export const loadMovies = createAsyncThunk(
  "movies/loadFromApi",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as { movies: MoviesState }).movies;
      if (!token) throw new Error("No token available");

      const movies = await fetchMovies(token);
      return movies;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "API error");
    }
  },
);

export const createMovie = createAsyncThunk(
  "movies/create",
  async (movieData: Omit<Movie, "id">, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as { movies: MoviesState }).movies;
      if (!token) throw new Error("No token available");

      return await apiAddMovie(movieData, token);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create movie";
      return rejectWithValue(message);
    }
  },
);

export const uploadMovieFile = createAsyncThunk(
  "movies/upload",
  async (fileContent: string, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as { movies: MoviesState }).movies;
      if (!token) throw new Error("No token available");

      return await uploadMovies(fileContent, token);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Upload error",
      );
    }
  },
);

export const getMoviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.items.push(action.payload);
    },

    addManyMovies: (state, action: PayloadAction<Movie[]>) => {
      state.items = [...state.items, ...action.payload];
    },

    removeMovie: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((movie) => movie.id !== action.payload);
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    sortByTitle: (state) => {
      state.items.sort((a, b) =>
        state.sortAscending
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title),
      );
      state.sortAscending = !state.sortAscending;
    },

    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    },

    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(loadMovies.rejected, (state) => {
        state.status = "failed";
        state.error = true;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(uploadMovieFile.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload];
      });
  },
});

export default getMoviesSlice.reducer;

export const {
  addMovie,
  addManyMovies,
  removeMovie,
  setSearchQuery,
  sortByTitle,
  setError,
  setLoaded,
  setToken,
} = getMoviesSlice.actions;
