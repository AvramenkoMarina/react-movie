import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { parseMoviesFromText } from "../../utils/parseMoviesFromText";
import { addManyMovies } from "../../features/getMoviesSlice";
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (files: UploadedFile[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const allParsedMovies = files.flatMap((file) =>
        parseMoviesFromText(file.content),
      );
      dispatch(addManyMovies(allParsedMovies));
    } catch {
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
