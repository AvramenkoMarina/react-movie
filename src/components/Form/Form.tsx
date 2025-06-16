import React, { useEffect, useRef } from "react";
import styles from "./Form.module.scss";

interface FormProps {
  formData: {
    title: string;
    year: string;
    format: string;
    actors: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  error?: string | null;
  fieldErrors?: {
    title?: string;
    year?: string;
    actors?: string;
  };
}

const formats = ["VHS", "DVD", "Blu-ray"];

const Form: React.FC<FormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading = false,
  error = null,
  fieldErrors = {},
}) => {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div
        className={`${styles.form__field} ${fieldErrors.title ? styles["form__field--error"] : ""}`}
      >
        <input
          ref={titleRef}
          type="text"
          name="title"
          placeholder="Movie title"
          value={formData.title}
          onChange={onChange}
        />
        {fieldErrors.title && (
          <div className={styles.form__error}>{fieldErrors.title}</div>
        )}
      </div>

      <div
        className={`${styles.form__field} ${fieldErrors.year ? styles["form__field--error"] : ""}`}
      >
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year || ""}
          min={1850}
          max={2025}
          onChange={onChange}
        />
        {fieldErrors.year && (
          <div className={styles.form__error}>{fieldErrors.year}</div>
        )}
      </div>

      <div
        className={`${styles.form__field} ${fieldErrors.actors ? styles["form__field--error"] : ""}`}
      >
        <input
          type="text"
          name="actors"
          placeholder="Actors"
          value={formData.actors}
          onChange={onChange}
        />
        {fieldErrors.actors && (
          <div className={styles.form__error}>{fieldErrors.actors}</div>
        )}
      </div>

      <fieldset className={styles.form__formatGroup}>
        {formats.map((format) => (
          <label key={format}>
            <input
              type="radio"
              name="format"
              value={format}
              checked={formData.format === format}
              onChange={onChange}
            />
            {format}
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        className={styles.form__submit}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Movie"}
      </button>

      {error && <div className={styles.form__error}>{error}</div>}
    </form>
  );
};

export default Form;
