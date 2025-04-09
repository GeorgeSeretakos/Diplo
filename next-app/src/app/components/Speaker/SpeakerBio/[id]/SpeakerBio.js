'use client';

import styles from "./SpeakerBio.module.css";
import React, { useEffect, useState } from "react";
import {fetchPositionHeld} from "../../../../../utils/wikidata/dataFetchers.js";
import {formatPositionHeld} from "../../../../../utils/wikidata/formatters.js";
import {constants} from "../../../../../../constants/constants.js";
import axios from "axios";
import metadataStyles from "../../../../debate/[id]/metadata/DebateMetadata.module.css";
import DebateCard from "../../../Debate/DebateCard/DebateCard.js";
import PartyItem from "../../../Party/PartyItem.js";
import SpeakerCircle from "../../SpeakerCircle/SpeakerCircle.js";

const SpeakerPage = ({documentId}) => {
  const initialDebatesShown = 4;

  const [visibleDebates, setVisibleDebates] = useState(initialDebatesShown);
  const [showMoreVisible, setShowMoreVisible] = useState(true);

  const [speakerData, setSpeakerData] = useState(null);
  const [positionsHeld, setPositionsHeld] = useState([]);
  const [wikidataEntityId, setWikidataEntityId] = useState(null);
  const [loading, setLoading] = useState(true);

  const STRAPI_URL = constants.STRAPI_URL;

  console.log("Speaker Bio received DocumentId:", documentId);

  useEffect(() => {
    if (!documentId) {
      alert("documentId is missing");
      return;
    }
    const fetchSpeakerData = async () => {
      try {
        const response = await axios.get(`/api/strapi/speakers/metadata/${documentId}`);
        console.log(response);
        setSpeakerData(response.data.speaker);
        console.log("Just set speakers data", speakerData);

        const link = response.data.speaker?.link;
        console.log("Link", link);
        if (link) {
          const entityId = link.split("/").pop();
          console.log("EntityId: ", entityId);
          setWikidataEntityId(entityId);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching speakerId data: ", error);
        setLoading(false);
      }
    }
    fetchSpeakerData();

  }, [documentId]);

  console.log("Wikidata id: ", wikidataEntityId);

  useEffect(() => {
    if (!wikidataEntityId) return;

    const fetchWikidataPositions = async () => {
      try {
        console.log("Called");
        const positions = await fetchPositionHeld(wikidataEntityId);
        const formattedPositions = formatPositionHeld(positions);
        setPositionsHeld(formattedPositions);

      } catch (error) {
        console.error("Error fetching positions held: ", error);
      }
    }
    fetchWikidataPositions();
  }, [wikidataEntityId]);

  console.log("Speaker data: ", speakerData);

  if (loading) return <p>Loading...</p>;
  if (!speakerData) return <p>No data available</p>

  const {
    speaker_name,
    description,
    image,
    date_of_birth,
    place_of_birth,
    date_of_death,
    educated_at,
    occupation,
    website,
    languages,
    political_parties,
    debates,
  } = speakerData;


  // Construct the full image URL
  const imageUrl = image?.formats?.large?.url
    ? `${STRAPI_URL}${image.formats.large.url}`
    : image?.url
      ? `${STRAPI_URL}${image.url}`
      : null;

  return (
    <div className={styles.pageLayout}>
      <div className={styles.sections}>

        <div className={styles.leftSection}>
          <div className={styles.header}>
            {imageUrl && <SpeakerCircle name={speaker_name} photo={imageUrl} />}
            {speaker_name && <h1 className={styles.title}>{speaker_name}</h1>}
          </div>
          {description &&
            <div className={styles.section}>
              <strong className="dynamic-content">Description:</strong> {description}
            </div>
          }

          {date_of_birth && place_of_birth && (
            <div className={styles.section}>
              <strong className="dynamic-content">Born:</strong> {date_of_birth}, {place_of_birth}
            </div>
          )}
          {date_of_death && <p><strong className="dynamic-content">Died:</strong> {date_of_death}</p>}

          {educated_at && (
            <div className={styles.section}>
              <strong className="dynamic-content">Education:</strong>
              <ul className={styles.list}>
                {educated_at.split(",").map((education, index) => (
                  <li key={index}>
                    {education.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {occupation && occupation.length > 0 && (
            <div className={styles.section}>
              <strong className="dynamic-content">Occupation:</strong> {occupation}
            </div>
          )}

          {languages && languages.length > 0 && (
            <div className={styles.section}>
              <strong className="dynamic-content">Languages:</strong> {languages}
            </div>
          )}

          {political_parties && political_parties.length > 0 && (
            <div className={`${styles.section} ${styles.partyDetails}`}>
              <strong className="dynamic-content">Political Party: </strong>
              {political_parties.map((party) => party.name).join(", ")}
            </div>
          )}
          <div className={`${styles.section} ${styles.partyImages}`}>
            {political_parties.map((party) => {
              const partyImage = party.image?.formats?.large?.url
                ? `${STRAPI_URL}${party.image.formats.large.url}`
                : party.image?.url
                  ? `${STRAPI_URL}${party.image.url}`
                  : "/images/parties/parties.jpg";

              return (
                <PartyItem
                  key={party.name}
                  name={party.name}
                  image={partyImage}
                  style={{pointerEvents: "none"}}
                />
              );
            })}
          </div>


          <section className={styles.section}>
            <strong className="dynamic-content">Positions held:</strong>
            {positionsHeld && positionsHeld.length > 0 ? (
              <ul className={styles.list}>
                {positionsHeld.map((position, index) => (
                  <li key={index}>
                    {position}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No positions held available.</p>
            )}
          </section>


          {/* Website Section */}
          {website && (
            <div className={styles.websiteSection}>
              <button>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </button>
            </div>
          )}


        </div>

        {/*<div className={styles.rightSection}>*/}
        {/*  {imageUrl ?*/}
        {/*    <img src={imageUrl} alt="Speaker" className={styles.profilePicture}/> :*/}
        {/*    <div className={styles.backgroundImageContainer}></div>*/}
        {/*  }*/}
        {/*</div>*/}
      </div>

    </div>

  );
};
export default SpeakerPage;
