import { Movie } from "../types/Movie";
import { v4 as uuidv4 } from "uuid";

export const parseMoviesFromText = (text: string): Movie[] => {
  const movieBlocks = text.trim().split(/\n\s*\n/);

  return movieBlocks.map((block) => {
    const lines = block.split("\n");

    const movie: Movie = {
      id: uuidv4(),
      title: "",
      releaseYear: "",
      format: "",
      stars: [],
    };

    for (const line of lines) {
      const [rawKey, ...rawValueParts] = line.split(":");
      const key = rawKey.trim();
      const value = rawValueParts.join(":").trim();

      switch (key) {
        case "Title":
          movie.title = value;
          break;
        case "Release Year":
          movie.releaseYear = value;
          break;
        case "Format":
          movie.format = value;
          break;
        case "Stars":
          movie.stars = value.split(",").map((star) => star.trim());
          break;
        default:
          break;
      }
    }

    return movie;
  });
};
