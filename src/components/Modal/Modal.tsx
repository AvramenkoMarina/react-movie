import styles from "./Modal.module.scss";

type ModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const Modal = ({ onConfirm, onCancel }: ModalProps) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal__content}>
        <p>Are you sure you want to delete this film?</p>
        <div className={styles.modal__buttons}>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
