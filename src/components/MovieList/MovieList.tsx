import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { parseMoviesFromText } from "../../utils/parseMoviesFromText";
import { addManyMovies, loadMovies } from "../../features/getMoviesSlice";
import { selectFilteredMovies } from "../../features/selectors";
import { UploadedFile } from "../../types/UploadedFile";
import { Loader } from "../Loader";
import { MovieCard } from "../MovieCard";
import { ErrorMessage } from "../ErrorMessage";
import { FileUploader } from "../FileUpload";
import styles from "./MovieList.module.scss";

const MovieList = () => {
  const dispatch = useAppDispatch();

  const movies = useAppSelector(selectFilteredMovies);
  const status = useAppSelector((state) => state.allMovies.status);
  const loaded = useAppSelector((state) => state.allMovies.loaded);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadMovies());
  }, [dispatch]);

  useEffect(() => {
    if (loaded) {
      console.log("🎬 Завантажено фільми:", movies);
    }
  }, [loaded, movies]);

  const handleFileUpload = async (files: UploadedFile[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const allParsedMovies = files.flatMap((file) =>
        parseMoviesFromText(file.content),
      );
      dispatch(addManyMovies(allParsedMovies));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "failed") {
    return <ErrorMessage message="Failed to load movies from server" />;
  }

  return (
    <>
      <FileUploader onFilesUpload={handleFileUpload} />
      {isLoading && <Loader />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className={styles.movielist}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
};

export default MovieList;
