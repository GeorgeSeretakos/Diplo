'use client';

import React from "react";
import "../../../../styles/globals.css"
import SpeakerCircle from "src/app/components/Speaker/SpeakerCircle/SpeakerCircle.js";
import {TEXTS, TITLES} from "src/app/constants/texts.js";
import {useRouter} from "next/navigation.js";

const SpeakersSection = () => {
  const router = useRouter();

  return (
    <div className="belowHeroSection">
      <div className="sections">
        {/* Left Sub-section */}
        <div className="leftSection">
          <div className="politicianContainer">
            <SpeakerCircle
              photo="/images/politicians/kiriakos_mitsotakis.jpg"
              name="Κυριάκος Μητσοτάκης"
              party="ΝΕΑ ΔΗΜΟΚΡΑΤΙΑ"
            />
            <SpeakerCircle
              photo="/images/politicians/nikos_androulakis.jpg"
              name="Νίκος Ανδρουλάκης"
              party="ΠΑΣΟΚ"
            />
            <SpeakerCircle
              photo="/images/politicians/stefanos_kaselakis.jpg"
              name="Στέφανος Κασελάκης"
              party="ΚΙΝΗΜΑ ΔΗΜΟΚΡΑΤΙΑΣ"
            />
            <SpeakerCircle
              photo="/images/politicians/alexis_tsipras.jpg"
              name="Αλέξης Τσίπρας"
              party="ΣΥΡΙΖΑ"
            />
            <SpeakerCircle
              photo="/images/politicians/koutsoumpas.jpg"
              name="Δημήτρης Κουτσούμπας"
              party="ΚΚΕ"
            />
            <SpeakerCircle
              photo="/images/politicians/konstantinos_tasoulas.jpg"
              name="Κωνσταντίνος Τασούλας"
              party="ΠΡΟΕΔΡΟΣ ΤΗΣ ΒΟΥΛΗΣ"
            />
          </div>
        </div>

        <div className="rightSection">
          <div className="title">
            <h1>{TITLES.SpeakerSectionTitle}</h1>
          </div>
          <div className="subtitle">
            <p className="dynamic-content">{TEXTS.SpeakersText}</p>
          </div>
          <div className="buttonContainer">
            <button onClick={() => router.push("/browse-speakers")}>Browse Speakers</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakersSection;
