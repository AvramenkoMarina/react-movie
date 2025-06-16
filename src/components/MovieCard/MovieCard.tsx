import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { removeMovie } from "../../features/getMoviesSlice";
import { Movie } from "../../types/Movie";
import styles from "./MovieCard.module.scss";
import { Modal } from "../Modal";

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  const dispatch = useAppDispatch();
  const { title, releaseYear, format, stars } = movie;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    dispatch(removeMovie(movie.id));
    setIsConfirmOpen(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.card__movie}>
        <div className={styles.card__title}>
          <h3>{title}</h3>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className={styles.card__deleteButton}
          >
            <img src="images/icons/delete-icon.svg" alt="delete" />
          </button>
        </div>
        <p>{releaseYear}</p>
        <p>{format}</p>
        <p>Cast: {stars.join(", ")}</p>
      </div>

      {/* Confirm Modal */}
      {isConfirmOpen && (
        <Modal
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default MovieCard;
