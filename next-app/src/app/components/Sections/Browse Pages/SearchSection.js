import React from "react";
import styles from "./SearchSection.module.css";

const SearchSection = ({ title, imageUrl, onButtonClick }) => {
  return (
    <div className={styles.section} onClick={onButtonClick}>
      <div className={styles.content}>
        <div className={styles.topSection}>
          <img src={imageUrl} alt="content visual" className={styles.image}/>
        </div>
        <div className={styles.bottomSection}>
          {/*<div className={styles.button}>*/}
            <div className={styles.title}>{title}</div>
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
