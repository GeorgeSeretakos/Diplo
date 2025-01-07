'use client';

import styles from "./SpeakerProfile.module.css";
import React, { useEffect, useState } from "react";
import {fetchPositionHeld} from "../../../utils/wikidata/dataFetchers.js";
import {formatPositionHeld} from "../../../utils/wikidata/formatters.js";
import {constants} from "../../../../constants/constants.js";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import metadataStyles from "../../debate/[id]/metadata/DebateMetadata.module.css";
import SpeakerCard from "../../components/Speaker/SpeakerCard/SpeakerCard.js";
import DebateCard from "../../components/Debate/DebateCard/DebateCard.js";

const SpeakerPage = () => {
  const router = useRouter();

  const [speakerData, setSpeakerData] = useState(null);
  const [positionsHeld, setPositionsHeld] = useState([]);
  const [wikidataEntityId, setWikidataEntityId] = useState(null);
  const [loading, setLoading] = useState(true);


  const STRAPI_URL = constants.STRAPI_URL;

  const { id: documentId } = useParams();

  console.log("DocumentId:", documentId);

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

        // Extract the link attribute and wikidata entity ID
        const link = speakerData?.link;
        if (link) {
          const entityId = link.split("/").pop();
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

  useEffect(() => {
    if (!wikidataEntityId) return;

    const fetchWikidataPositions = async () => {
      try {
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

  // Destructuring
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

        <div className={styles.edgeSection} style={{top: 0, left: 0, borderRadius: "0 1.5rem 1.5rem 0"}}>
          <div className={styles.backgroundImageContainer2}></div>
        </div>


        {/* Left Section: Speaker Information */}
        <div className={styles.middleSection}>
          {/* Header Section */}
          <div className={styles.headerContent}>
            <div className={styles.textContent}>
              {speaker_name && <h1 className={styles.speakerName}>{speaker_name}</h1>}
              {description && <p className={styles.description}>{description}</p>}
            </div>
            <div className={styles.profilePictureContainer}>
              <img src={imageUrl} alt="Speaker" className={styles.profilePicture}/>
            </div>
          </div>

          {/* About Section */}
          <div className={styles.aboutSection}>
            <div className={styles.personalDetails}>
              {date_of_birth && place_of_birth && (
                <p>
                  <strong className="dynamic-content">Born:</strong> {date_of_birth}, {place_of_birth}
                </p>
              )}
              {date_of_death && <p><strong className="dynamic-content">Died:</strong> {date_of_death}</p>}
            </div>
            <div className={styles.professionalDetails}>
              {/* Education Section */}
              {educated_at && (
                <div className={styles.professionalDetails}>
                  <strong className="dynamic-content">Education:</strong>
                  <ul className={styles.list}>
                    {educated_at.split(",").map((education, index) => (
                      <li key={index} className={styles.educationItem}>
                        {education.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {occupation && occupation.length > 0 && (
                <p>
                  <strong className="dynamic-content">Occupation:</strong> {occupation}
                </p>
              )}

              {languages && languages.length > 0 && (
                <p><strong className="dynamic-content">Languages:</strong> {languages}</p>
              )}
            </div>
          </div>

          {/*Extra Details*/}
          <div className={styles.partyDetails}>
            {political_parties && political_parties.length > 0 && (
              <div>
                <p>
                  <strong className="dynamic-content">Political Party: </strong>
                  {political_parties.map((party) => party.name).join(", ")}
                </p>
              </div>
            )}
            <div className={styles.partyImages}>
              {political_parties && political_parties.length > 0 && (
                political_parties.map((party, index) => {

                  const partyImage = party.image?.formats?.large?.url
                    ? `${STRAPI_URL}${party.image.formats.large.url}`
                    : party.image?.url
                      ? `${STRAPI_URL}${party.image.url}`
                      : null;

                  // If no image exists, return null
                  if (!partyImage) return null;

                  return (
                    <div className={styles.imageContainer} key={index}>
                      <img
                        src={partyImage} // TODO: Add fallback image
                        alt={`${party.name || "Political party"} photo`}
                        className={styles.partyImage}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>


          <section className={styles.section}>
            <strong className="dynamic-content">Positions held:</strong>
            {positionsHeld && positionsHeld.length > 0 ? (
              <ul className={styles.list}>
                {positionsHeld.map((position, index) => (
                  <li key={index} className={styles.positionItem}>
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
              <a href={website} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </div>
          )}



          <div className={metadataStyles.speakersSection} style={{marginTop: "2rem"}}>
            {debates && (
              <p><strong className="dynamic-content">Debates</strong></p>
            )}
            <div className={metadataStyles.grid}>
              {debates.map((debate, index) => {
                return (
                  <DebateCard
                    key={index}
                    documentId={debate.documentId}
                    period={debate.period}
                    session={debate.session}
                    meeting={debate.meeting}
                    topics={debate.topics || []}
                    date={debate.date}
                    // containerStyle={{width: "7.5rem", height: "12.5rem", borderRadius: "1rem"}}
                    // textStyle={{fontSize: ".5rem"}}
                  />
                );
              })}
            </div>
          </div>

          <div className="buttonContainer" style={{marginBottom: "1rem", marginTop: "2rem"}}>
            <button className="button" onClick={() => router.push(`/speakers-results/?searchPerformed=true`)}>Previous
              Search
            </button>
            <button className="button" onClick={() => router.push("/browse-speakers/")}>Change Filter</button>
            <button className="button" onClick={() => router.push("/")}>Exit</button>
          </div>


        </div>

        {/* Right Section: Image */}
        <div className={styles.edgeSection} style={{borderRadius: "1.5rem 0 0 1.5rem"}}>
          <div className={styles.backgroundImageContainer}></div>
        </div>
      </div>

    </div>

  );
};
export default SpeakerPage;
