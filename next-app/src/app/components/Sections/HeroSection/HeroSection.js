import React from "react";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.textRow}>
        <h1 className={styles.title}>
          <span className="dynamic-content">Parliament Debates Portal</span>
        </h1>
        {/*<p className={styles.subtitle}>*/}
        {/*  <span className="dynamic-content">Search and explore debates, speakers, and topics from past and current sessions</span>*/}
        {/*</p>*/}
      </div>
    </div>
  );
};

export default HeroSection;
