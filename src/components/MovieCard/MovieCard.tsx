import { useAppDispatch } from "../../app/hooks";
import { removeMovie } from "../../features/getMoviesSlice";
import { Movie } from "../../types/Movie";
import styles from "./MovieCard.module.scss";

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  const dispatch = useAppDispatch();
  const { title, releaseYear, format, stars } = movie;

  const handleDelete = () => {
    dispatch(removeMovie(movie.id));
  };
  return (
    <div className={styles.card}>
      <div className={styles.card__movie}>
        <div className={styles.card__title}>
          <h3>{title}</h3>
          <button onClick={handleDelete} className={styles.card__deleteButton}>
            <img src="images/icons/delete-icon.svg" alt="delete" />
          </button>
        </div>
        <p>{releaseYear}</p>
        <p>{format}</p>
        <p>Cast: {stars.join(", ")}</p>
      </div>
    </div>
  );
};

export default MovieCard;
