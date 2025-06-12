import { Movie } from "../types/Movie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const fetchMovies = async (token: string): Promise<Movie[]> => {
  const response = await fetch(`${API_URL}/movies`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  return await response.json();
};

export const addMovie = async (
  movieData: Omit<Movie, "id">,
  token: string,
): Promise<Movie> => {
  const response = await fetch(`${API_URL}/movies`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const uploadMovies = async (
  fileContent: string,
  token: string,
): Promise<Movie[]> => {
  const response = await fetch(`${API_URL}/movies/import`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "text/plain",
    },
    body: fileContent,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload movies: ${response.status}`);
  }

  return await response.json();
};

export const deleteMovie = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete movie: ${response.status}`);
  }
};
