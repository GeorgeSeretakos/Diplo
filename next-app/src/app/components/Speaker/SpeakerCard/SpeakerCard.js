import React from "react";
import styles from "./SpeakerCard.module.css";
import Link from "next/link";

const SpeakerCard = ({ documentId, image, name, disableClick = false }) => {

  const handleClick = (e) => {
    if (disableClick) {
      e.preventDefault(); // 🛑 Stop Link navigation if disabled
      return;
    }
  };

  return (
    <Link
      href={`/speaker/${documentId}`}
      onClick={handleClick}
      className={styles.speakerCard}
    >
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image}/>
      </div>
      <div className={styles.contentContainer}>
        <p className={styles.speakerName}>{name}</p>
      </div>
    </Link>
  );
};

export default SpeakerCard;
