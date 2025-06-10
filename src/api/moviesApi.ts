import { Movie } from "../types/Movie";
import { apiClient } from "../utils/api";

export const fetchMovies = (): Promise<Movie[]> => apiClient("/movies");

export const addMovie = (movieData: Omit<Movie, "id">): Promise<Movie> =>
  apiClient("/movies", {
    method: "POST",
    body: movieData,
  });

export const uploadMovies = (fileContent: string): Promise<Movie[]> =>
  apiClient("/movies/import", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: fileContent,
  });
