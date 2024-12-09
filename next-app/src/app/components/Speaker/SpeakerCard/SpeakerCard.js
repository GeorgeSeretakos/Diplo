import React from "react";
import styles from "./SpeakerCard.module.css";
import Link from "next/link";

const SpeakerCard = ({ id, photo, speaker_name, party, description }) => {
  return (

    <Link href={`/speaker/${id}`} className={styles.link}>
        <div className={styles.speakerCard}>
          <div className={styles.cardContent}>
            <div className={styles.container}>
              <div className={styles.imageContainer}>
                <img src={photo} alt={name} className={styles.image}/>
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.speakerName}>{speaker_name}</div>
                {/*<div className={styles.party}>{party}</div>*/}
              </div>
            </div>
          </div>

          <div className={styles.overlay}>
            {/*<p>{description}</p>*/}
          </div>
        </div>
    </Link>
  );
};

export default SpeakerCard;
