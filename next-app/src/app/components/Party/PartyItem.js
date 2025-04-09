import React from "react";
import styles from "./PartyItem.module.css";

const PartyItem = ({ name, image, isSelected, handleClick, style }) => {
  return (
    <div className={`${styles.partyItem} ${isSelected ? styles.selected : ""}`} style={style} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.partyImage} />
      </div>
      <p className={styles.partyLabel}>{name}</p>
    </div>
  );
};

export default PartyItem;
