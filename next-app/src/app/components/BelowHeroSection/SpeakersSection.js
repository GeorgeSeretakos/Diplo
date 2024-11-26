import React from "react";
import styles from "./SpeakersSection.module.css";
import SpeakerCircle from "@/app/components/Speaker/SpeakerCircle/SpeakerCircle.js";
import {TEXTS} from "@/app/constants/texts.js";

const SpeakersSection = () => {
  return (
    <div className={styles.belowHeroSection}>
      <div className={styles.title}>
        <h1>Uncover Discussions and Speaker Insights</h1>
      </div>
      <div className={styles.sections}>
        {/* Left Sub-section */}
        <div className={styles.leftSection}>
          <div className={styles.politicianContainer}>
            <SpeakerCircle
              photo="/images/kiriakos_mitsotakis.jpg"
              name="Κυριάκος Μητσοτάκης"
              party="ΝΕΑ ΔΗΜΟΚΡΑΤΙΑ"
            />
            <SpeakerCircle
              photo="/images/nikos_androulakis.jpg"
              name="Νίκος Ανδρουλάκης"
              party="ΠΑΣΟΚ"
            />
            <SpeakerCircle
              photo="/images/stefanos_kaselakis.jpg"
              name="Στέφανος Κασελάκης"
              party="ΚΙΝΗΜΑ ΔΗΜΟΚΡΑΤΙΑΣ"
            />
            <SpeakerCircle
              photo="/images/alexis_tsipras.jpg"
              name="Αλέξης Τσίπρας"
              party="ΣΥΡΙΖΑ"
            />
            <SpeakerCircle
              photo="/images/koutsoumpas.jpg"
              name="Δημήτρης Κουτσούμπας"
              party="ΚΚΕ"
            />
            <SpeakerCircle
              photo="/images/konstantinos_tasoulas.jpg"
              name="Κωνσταντίνος Τασούλας"
              party="ΠΡΟΕΔΡΟΣ ΤΗΣ ΒΟΥΛΗΣ"
            />
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.subtitle}>
            <p className="dynamic-content">{TEXTS.SpeakersText}</p>
          </div>
          <div className="buttonContainer">
            <button>Search debates based on Speakers</button>
          </div>
        </div>


        {/*/!* Search Bars *!/*/}
        {/*<div className={styles.searchBars}>*/}
        {/*  <button className={styles.searchButton}>Recent Debates</button>*/}
          {/*  <button className={styles.searchButton}>Search Debates</button>*/}
          {/*  <button className={styles.searchButton}>Speech Name</button>*/}
          {/*</div>*/}

        {/*/!* Right Sub-section *!/*/}
        {/*<div className={styles.rightSection}>*/}
        {/*  <img*/}
        {/*    src="images/parliament.jpg"*/}
        {/*    alt="Parliament"*/}
        {/*    className={styles.rightImage}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default SpeakersSection;
