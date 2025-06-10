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
  return (
    <div className={styles.form}>
      {inputs.map(({ name, placeholder }) => (
        <input
          key={name}
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
