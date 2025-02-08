import React from "react";
import "../../../../styles/globals.css";
import styles from "./TopicsSection.module.css";
import {TEXTS, TITLES} from "/src/app/constants/texts.js";

const TopicsSection = () => {
  return (
    <div className="belowHeroSection">
      <div className={`sections ${styles.debatesSections}`}>
        <div className={`leftSection ${styles.imageContainer}`}>
          <video
            src="videos/politicians/mitsotakis.mp4"
            autoPlay
            loop
            muted
            className="rightImage"
          />
        </div>
        <div className="rightSection">
          <div className={`title ${styles.title}`}>
            <h1>{TITLES.TopicsSectionTitle}</h1>
          </div>
          <div className="subtitle">
            <p className="dynamic-content">{TEXTS.TopicsText}</p>
          </div>
          <div className="buttonContainer">
            <button>Browse Topics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsSection;
