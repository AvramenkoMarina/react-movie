import { useState } from "react";
import { Form } from "../Form";
import { useAppDispatch } from "../../app/hooks";
import { addMovie } from "../../features/getMoviesSlice";
import styles from "./Popup.module.scss";
import { Movie } from "../../types/Movie";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    format: "DVD",
    actors: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    year: "",
    actors: "",
  });

  const validateForm = () => {
    const errors = {
      title: "",
      year: "",
      actors: "",
    };
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData.year) {
      errors.year = "Year is required";
      isValid = false;
    } else {
      const yearNum = parseInt(formData.year);
      if (isNaN(yearNum) || yearNum < 1850 || yearNum > 2025) {
        errors.year = "Year must be between 1850 and 2025";
        isValid = false;
      }
    }

    const actorRegex = /^[a-zA-Z .-]+(?:,\s*[a-zA-Z .-]+)*$/;

    if (!formData.actors.trim()) {
      errors.actors = "Actors are required";
      isValid = false;
    } else if (!actorRegex.test(formData.actors)) {
      errors.actors =
        "Use only letters, spaces, dots, dashes. Separate names with commas.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { title, year, format, actors } = formData;

      const movieData: Movie = {
        id: uuidv4(),
        title: title.trim(),
        releaseYear: year,
        format: format.trim(),
        stars: actors.split(",").map((s) => s.trim()),
      };

      dispatch(addMovie(movieData));
      toast.success("Movie successfully added!");
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to add movie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popup__container}>
        <div className={styles.popup__content}>
          <button
            className={styles.popup__closeButton}
            onClick={onClose}
            disabled={isLoading}
          >
            <img src="images/icons/close-icon.svg" alt="close" />
          </button>
          <div className={styles.popup__form}>
            <Form
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              fieldErrors={fieldErrors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
