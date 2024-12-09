'use client';

import styles from "./SpeakerProfile.module.css";
import formatDate from "../../../utils/Date/formatDate.js";
import { fetchPersonalInfo, fetchPoliticalInfo } from "@/utils/wikidata/dataFetchers";
import React, {useEffect, useState} from "react";

const SpeakerPage = () => {

  const [personalInfo, setPersonalInfo] = useState({});
  const [politicalInfo, setPoliticalInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const speakerEntityId = "Q552751"; // Kyriakos Mitsotakis
        const personal = await fetchPersonalInfo(speakerEntityId);
        const political = await fetchPoliticalInfo(speakerEntityId);

        setPersonalInfo(personal);
        setPoliticalInfo(political);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading ...</p>
  }

  return (
    <div className={styles.pageLayout}>
      <div className={styles.container}>
        {/* Personal Information */}
        <header className={styles.header}>
          <div className={styles.imageContainer}>
            <img
              src={personalInfo.image}
              alt={personalInfo.fullName}
              className={styles.profilePicture}
            />
          </div>
          {/* TODO: Add the description attribute */}
          <div className={styles.personalInfo}>
            <h1>{personalInfo.fullName || "Name not available"}</h1>
            {personalInfo.dateOfBirth && <p>Born: {formatDate(personalInfo.dateOfBirth)}</p>}
            {personalInfo.placeOfBirth && <p>Place of Birth: {personalInfo.placeOfBirth}</p>}
            <p>Gender: {personalInfo.gender || "Not specified"}</p>
            <p>Nationality: {personalInfo.nationality || "Unknown"}</p>
            {/*<p>Languages Spoken: {personalInfo.languages || "Not specified"}</p>*/}
          </div>
        </header>

        {/* Political Information */}
        <section className={styles.section}>
          <h2>Political Information</h2>
          {politicalInfo.currentPosition ? (
            <p>Current Position: {politicalInfo.currentPosition.title} (Since {formatDate(politicalInfo.currentPosition.startDate)})</p>
          ) : (
            <p>Current Position: Not specified</p>
          )}
          {politicalInfo.party ? (
            <>
              <p>Party: {politicalInfo.party.name}</p>
              <img src={politicalInfo.party.logo || "/images/default_party_logo.png"} alt={politicalInfo.party.name}
                   className={styles.partyLogo}/>
            </>
          ) : (
            <p>Party: Not specified</p>
          )}
          {politicalInfo.previousPositions?.length > 0 ? (
            <>
              <h3>Previous Positions</h3>
              <ul className={styles.educationList}>
                {politicalInfo.previousPositions.map((position, index) => (
                  <li key={index} className={styles.educationItem}>
                    {position.title} ({formatDate(position.startDate)} - {formatDate(position.endDate) || "Present"})
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No previous positions available.</p>
          )}
        </section>

      </div>
    </div>
  );
}

export default SpeakerPage;


