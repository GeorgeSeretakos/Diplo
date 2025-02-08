import React from "react";
import styles from "./FilterModal.module.css";

const FilterModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render if the modal is closed

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>{title}</h2>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default FilterModal;
