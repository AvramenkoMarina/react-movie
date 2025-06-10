import { configureStore } from "@reduxjs/toolkit";
import { getMoviesSlice } from "../features/getMoviesSlice";

export const store = configureStore({
  reducer: {
    allMovies: getMoviesSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
