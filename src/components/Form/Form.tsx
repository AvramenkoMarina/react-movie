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
}

const inputs = [
  { name: "title", placeholder: "Movie title" },
  { name: "year", placeholder: "Year" },
  { name: "actors", placeholder: "Actors" },
];

const formats = ["VHS", "DVD", "Blu-ray"];

const Form: React.FC<FormProps> = ({ formData, onChange }) => {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <div className={styles.form}>
      {inputs.map(({ name, placeholder }, index) => (
        <input
          key={name}
          ref={index === 0 ? firstInputRef : undefined} // Додаємо ref лише до першого інпуту
          type="text"
          name={name}
          placeholder={placeholder}
          value={formData[name as keyof typeof formData]}
          onChange={onChange}
        />
      ))}

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
    </div>
  );
};

export default Form;
