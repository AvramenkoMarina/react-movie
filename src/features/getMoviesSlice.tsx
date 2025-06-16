import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "../types/Movie";
import { Status } from "../types/Status";
import { uploadMovies } from "../api/moviesApi";
import { RootState } from "../app/store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

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

const saveToLocalStorage = (movies: Movie[]) => {
  localStorage.setItem("movies", JSON.stringify(movies));
};

export const loadMovies = createAsyncThunk(
  "movies/loadFromApi",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).movies;
      if (!token) throw new Error("No token available");

      const response = await fetch(`${API_URL}/movies`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const data = await response.json();
      saveToLocalStorage(data);
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "API error");
    }
  },
);

export const createMovie = createAsyncThunk(
  "movies/create",
  async (movieData: Omit<Movie, "id">, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).movies;
      if (!token) throw new Error("No token available");

      const response = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: movieData.title,
          release_year: movieData.releaseYear,
          format: movieData.format,
          stars: movieData.stars,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed with status ${response.status}`,
        );
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Create error",
      );
    }
  },
);

export const uploadMovieFile = createAsyncThunk(
  "movies/upload",
  async (fileContent: string, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).movies;
      if (!token) throw new Error("No token available");

      const result = await uploadMovies(fileContent, token);
      return result;
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
      saveToLocalStorage(state.items);
    },
    addManyMovies: (state, action: PayloadAction<Movie[]>) => {
      state.items = [...state.items, ...action.payload];
      saveToLocalStorage(state.items);
    },
    removeMovie: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((movie) => movie.id !== action.payload);
      saveToLocalStorage(state.items);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    sortByTitle: (state) => {
      state.items.sort((a, b) => {
        const getFirstLetter = (str: string) => {
          const lettersOnly = str.replace(/^[0-9\W_]+/, "");
          return lettersOnly.charAt(0).toLowerCase();
        };

        const firstLetterA = getFirstLetter(a.title);
        const firstLetterB = getFirstLetter(b.title);

        const compareResult = firstLetterA.localeCompare(
          firstLetterB,
          "uk-UA",
          {
            sensitivity: "base",
          },
        );

        if (compareResult === 0) {
          return a.title.localeCompare(b.title, "uk-UA", {
            sensitivity: "base",
          });
        }

        return state.sortAscending ? compareResult : -compareResult;
      });

      state.sortAscending = !state.sortAscending;
      saveToLocalStorage(state.items);
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
    loadMoviesFromLocalStorage: (state) => {
      const savedMovies = localStorage.getItem("movies");
      if (savedMovies) {
        state.items = JSON.parse(savedMovies);
        state.loaded = true;
      }
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
        saveToLocalStorage(state.items);
      })
      .addCase(uploadMovieFile.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload];
        saveToLocalStorage(state.items);
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
  loadMoviesFromLocalStorage,
} = getMoviesSlice.actions;
