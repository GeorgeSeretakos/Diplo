import React from "react";
import styles from "./SpeakerCard.module.css";

const SpeakerCard = ({ photo, name, party, description }) => {
  return (
    <div className={styles.speakerCard}>

      <div className={styles.cardContent}>
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            <img src={photo} alt={name} className={styles.image}/>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.speakerName}>{name}</div>
            <div className={styles.party}>{party}</div>
          </div>
        </div>
      </div>

      <div className={styles.overlay}>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default SpeakerCard;
