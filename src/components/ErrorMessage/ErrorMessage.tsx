import React, { useState } from "react";
import styles from "./ErrorMessage.module.scss";

type Props = {
  message: string;
};

const ErrorMessage: React.FC<Props> = ({ message }) => {
  const [openError, setOpenError] = useState(true);

  if (!openError) return null;

  return (
    <div className={styles.error}>
      <div className={styles.error__container}>
        <div className={styles.error__content}>
          <button
            className={styles.error__closeButton}
            onClick={() => setOpenError(false)}
          >
            <img src="images/icons/close-icon.svg" alt="close" />
          </button>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
