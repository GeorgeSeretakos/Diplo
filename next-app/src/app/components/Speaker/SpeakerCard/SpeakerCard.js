import React from "react";
import styles from "./SpeakerCard.module.css";
import Link from "next/link";

const SpeakerCard = ({ documentId, image, speaker_name, containerStyle, textStyle }) => {
  return (

    <Link href={`/speaker/${documentId}`} className="link">
        <div className={styles.speakerCard} style={containerStyle}>
          <div className={styles.cardContent}>
            <div className={styles.container}>
              <div className={styles.imageContainer}>
                <img src={image} alt={name} className={styles.image}/>
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.speakerName} style={textStyle}>{speaker_name}</div>
              </div>
            </div>
          </div>
        </div>
    </Link>
  );
};

export default SpeakerCard;
