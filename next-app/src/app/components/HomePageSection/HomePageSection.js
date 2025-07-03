import React from "react";
import styles from "./HomePageSection.module.css";
import Image from "next/image";

const HomePageSection = ({ title, imageUrl, onButtonClick }) => {
  return (
    <div className={styles.section} onClick={onButtonClick}>
      <div className={styles.content}>
        <div className={`${styles.topSection} relative`}>
          <Image
            src={imageUrl}
            alt="content visual"
            fill
            className={styles.image}
            sizes="(max-width: 600px) 100vw, 360px"
          />
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSection;
