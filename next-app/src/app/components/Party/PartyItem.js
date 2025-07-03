import React from "react";
import styles from "./PartyItem.module.css";
import Image from "next/image";

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
        <Image
          src={image}
          alt={name}
          fill
          className={styles.partyImage}
          sizes="60px"
        />
      </div>
      <p className={styles.partyLabel}>{name}</p>
    </div>
  );
};

export default PartyItem;
