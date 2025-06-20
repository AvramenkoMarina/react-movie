import React, { ChangeEvent, useState } from "react";
import { UploadedFile } from "../../types/UploadedFile";
import { ErrorMessage } from "../ErrorMessage";
import styles from "./FileUpload.module.scss";

type Props = {
  onFilesUpload: (files: UploadedFile[]) => void;
};

const FileUploader: React.FC<Props> = ({ onFilesUpload }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isTxtFile = (fileName: string) => /\.txt$/i.test(fileName);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = event.target.files?.[0];

    if (!file) return;

    if (!isTxtFile(file.name)) {
      setErrorMessage("Only .txt files are supported.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const uploadedFile: UploadedFile = {
          name: file.name,
          content: text,
        };
        onFilesUpload([uploadedFile]);
      } else {
        setErrorMessage("Failed to read file.");
      }
    };

    reader.onerror = () => {
      setErrorMessage("Error occurred while reading file.");
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <form className={styles.fileUpload} onSubmit={(e) => e.preventDefault()}>
      <label
        htmlFor="file-loader-button"
        className={styles.fileUpload__customButton}
      >
        Upload Text File
      </label>

      <input
        id="file-loader-button"
        type="file"
        accept=".txt"
        onChange={handleOnChange}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </form>
  );
};

export default FileUploader;
