'use client';

import React from "react";
import "../../../../styles/globals.css";
import styles from "./DebatesSection.module.css";
import {TEXTS, TITLES} from "src/app/constants/texts.js";
import {useRouter} from "next/navigation";

const DebatesSection = () => {
  const router = useRouter();

  return (
    <div className="belowHeroSection">
      <div className={`sections ${styles.debatesSections}`}>
        <div className="rightSection">
          <div className={`title ${styles.title}`}>
            <h1>{TITLES.DebatesSectionTitle}</h1>
          </div>
          <div className="subtitle">
            <p className="dynamic-content">{TEXTS.DebatesText}</p>
          </div>
          <div className="buttonContainer">
            <button onClick={() => router.push("/browse-debates")}>Browse Debates</button>
          </div>
        </div>

        <div className={`leftSection ${styles.imageContainer}`}>
          <img
            src="images/parliament/parliament.jpg"
            alt="Parliament"
            className="rightImage"
          />
        </div>
      </div>
    </div>
  );
};

export default DebatesSection;
