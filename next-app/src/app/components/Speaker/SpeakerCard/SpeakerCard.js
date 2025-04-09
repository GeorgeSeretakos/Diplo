import React from "react";
import styles from "./SpeakerCard.module.css";
import Link from "next/link";

const SpeakerCard = ({ documentId, image, name }) => {
  return (
      <div className={styles.speakerCard}>
        <Link href={`/speaker/${documentId}`}>
          <div className={styles.imageContainer}>
            <img src={image} alt={name} className={styles.image}/>
          </div>
          <div className={styles.contentContainer}>
            <p className={styles.speakerName}>{name}</p>
          </div>
        </Link>
      </div>
  );
};

export default SpeakerCard;
