import React from "react";
import styles from "./PartyItem.module.css";

const PartyItem = ({ name, image, isSelected, handleClick, style, highlight = true }) => {
  const classNames = [
    styles.partyItem,
    isSelected && highlight ? styles.selected : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} style={style} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.partyImage} />
      </div>
      <p className={styles.partyLabel}>{name}</p>
    </div>
  );
};

export default PartyItem;
