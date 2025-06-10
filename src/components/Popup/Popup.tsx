import { v4 as uuidv4 } from "uuid";
import { Form } from "../Form";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addMovie } from "../../features/getMoviesSlice";
import styles from "./Popup.module.scss";

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    format: "",
    actors: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { title, year, format, actors } = formData;

    if (!title.trim() || !year.trim() || !format.trim() || !actors.trim()) {
      return;
    }

    const newMovie = {
      id: uuidv4(),
      title: title.trim(),
      releaseYear: year.trim(),
      format: format.trim(),
      stars: actors.split(",").map((s) => s.trim()),
    };

    dispatch(addMovie(newMovie));
    onClose();
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popup__container}>
        <div className={styles.popup__content}>
          <button className={styles.popup__closeButton} onClick={onClose}>
            <img src="images/icons/close-icon.svg" alt="close" />
          </button>
          <div className={styles.popup__form}>
            <form onSubmit={handleSubmit} className={styles.popup__form}>
              <Form formData={formData} onChange={handleChange} />
              <button type="submit" className={styles.popup__button}>
                Add movie
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
