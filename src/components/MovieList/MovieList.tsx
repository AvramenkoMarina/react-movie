import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { parseMoviesFromText } from "../../utils/parseMoviesFromText";
import {
  addManyMovies,
  loadMoviesFromLocalStorage,
} from "../../features/getMoviesSlice";
import { selectFilteredMovies } from "../../features/selectors";
import { UploadedFile } from "../../types/UploadedFile";
import { Loader } from "../Loader";
import { MovieCard } from "../MovieCard";
import { ErrorMessage } from "../ErrorMessage";
import { FileUploader } from "../FileUpload";
import styles from "./MovieList.module.scss";
import { v4 as uuidv4 } from "uuid";
import { Popup } from "../Popup";

const MovieList = () => {
  const dispatch = useAppDispatch();
  const movies = useAppSelector(selectFilteredMovies);
  const status = useAppSelector((state) => state.movies.status);
  const searchQuery = useAppSelector((state) => state.movies.searchQuery);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    dispatch(loadMoviesFromLocalStorage());
  }, [dispatch]);

  const handleFileUpload = async (files: UploadedFile[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const allParsedMovies = files.flatMap((file) => {
        const parsed = parseMoviesFromText(file.content);
        return parsed.map((movie) => ({
          ...movie,
          id: movie.id || uuidv4(),
        }));
      });
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
    return <ErrorMessage message="Failed to load movies" />;
  }

  const validMovies = movies.filter((movie) => movie?.id);

  return (
    <>
      <FileUploader onFilesUpload={handleFileUpload} />
      {openPopup && <Popup onClose={() => setOpenPopup(false)} />}

      {isLoading && <Loader />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className={styles.movielist}>
        {!isLoading && validMovies.length === 0 && searchQuery && (
          <p className={styles.movielist__noResults}>
            Oops, no movies found with that title.
          </p>
        )}

        {validMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
};

export default MovieList;
