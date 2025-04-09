import React from "react";
import styles from "./SpeakerCircle.module.css";

const SpeakerCircle = ({ photo, name, style }) => {
  return (
    <>
      <div className={styles.speakerContainer} style={style}>
        {/* Top half: politician's photo */}
        <div className={styles.photoContainer}>
          <img src={photo} alt={name} className={styles.photo}/>
        </div>

        {/*/!* Bottom half: politician's info *!/*/}
        {/*<div className={styles.infoContainer}>*/}
        {/*  <p className={styles.name}>{name}</p>*/}
        {/*  <p className={styles.party}>{party}</p>*/}
        {/*</div>*/}

      </div>
      {/*<div style={{fontSize: "1.5rem"}}>{name}</div>*/}
    </>
  );
};

export default SpeakerCircle;