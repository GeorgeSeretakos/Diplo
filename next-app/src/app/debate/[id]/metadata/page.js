'use client';

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import styles from "../../../speaker/[id]/SpeakerProfile.module.css";
import metadataStyles from "./DebateMetadata.module.css";
import SpeakerCard from "../../../components/Speaker/SpeakerCard/SpeakerCard.js";
import { constants } from "../../../../../constants/constants.js";
import axios from "axios";

const DebateMetadata = () => {
  const router = useRouter();
  const [debateData, setDebateData] = useState(null);

  const STRAPI_URL = constants.STRAPI_URL;

  const { id: documentId } = useParams(); // Fix like in speakers page

  useEffect(() => {
    if (!documentId) {
      alert("documentId is missing");
      return;
    }
    const fetchDebateData = async () => {
      try {
        const response = await axios.get(`/api/strapi/debates/metadata/${documentId}`);
        console.log(response);
        setDebateData(response.data.debate); // Set the fetched data
      } catch (error) {
        console.error("Error fetching debate data:", error.response?.data?.error || "Failed to fetch debate data");
      }
    };

    fetchDebateData(); // Call the function immediately on page load
  }, [documentId]); // Dependency array ensures the API call is made when `documentId` changes
  console.log("Debate data: ", debateData);


  // if (loading) return <p>Loading...</p>;
  if (!debateData) return <p>No data available</p>

  // Destructuring
  const {
    title,
    session,
    session_date,
    period,
    meeting,
    topics,
    opening_section,
    speakers,
    summary,
    political_parties,
  } = debateData;

  const getImageUrl = (image) => {
    return image?.formats?.large?.url
      ? `${STRAPI_URL}${image.formats.large.url}`
      : image?.url
        ? `${STRAPI_URL}${image.url}`
        : null;
  };


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
            <div className={styles.textContent} style={{width: "100%", textAlign: "center"}}>
              {title && <h1 className={styles.speakerName}>{title}</h1>}
              {opening_section && <p className={styles.description}>{opening_section}</p>}
            </div>
          </div>


          <div className="buttonContainer">
            <button className="button" onClick={() => router.push(`/debate/${documentId}/content`)}>View Debate
              Content
            </button>
          </div>

          <div>
            {/* Education Section */}
            {(session || period || meeting) && (
              <div>
                <strong className="dynamic-content">Parliament Session:</strong>
                <ul className={styles.list}>
                  <li><strong className="dynamic-content">Session Date:</strong> {session_date}</li>
                  <li><strong className="dynamic-content">Period:</strong> {period}</li>
                  <li><strong className="dynamic-content">Session:</strong> {session}</li>
                  <li><strong className="dynamic-content">Meeting:</strong> {meeting}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Topics */}
          <div>
            {topics && (
              <p>
                <strong className="dynamic-content">Topics:</strong>{" "}
                {topics.map((t) => t.topic).join(", ")} {/* Extract topic values and join */}
              </p>
            )}
          </div>


          {/*Extra Details*/}
          {/*<div className={styles.partyDetails}>*/}
          {/*  {political_parties && political_parties.length > 0 && (*/}
          {/*    <div>*/}
          {/*      <p>*/}
          {/*        <strong className="dynamic-content">Political Party: </strong>*/}
          {/*        {political_parties.map((party) => party.name).join(", ")}*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*  <div className={styles.partyImages}>*/}
          {/*    {political_parties && political_parties.length > 0 && (*/}
          {/*      political_parties.map((party, index) => {*/}

          {/*        const partyImage = party.image?.formats?.large?.url*/}
          {/*          ? `${STRAPI_URL}${party.image.formats.large.url}`*/}
          {/*          : party.image?.url*/}
          {/*            ? `${STRAPI_URL}${party.image.url}`*/}
          {/*            : null;*/}

          {/*        // If no image exists, return null*/}
          {/*        if (!partyImage) return null;*/}

          {/*        return (*/}
          {/*          <div className={styles.imageContainer} key={index}>*/}
          {/*            <img*/}
          {/*              src={partyImage} // TODO: Add fallback image*/}
          {/*              alt={`${party.name || "Political party"} photo`}*/}
          {/*              className={styles.partyImage}*/}
          {/*            />*/}
          {/*          </div>*/}
          {/*        );*/}
          {/*      })*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* Summary */}
          <div>
            {summary && (
              <div>
                <strong className="dynamic-content">Summary</strong>
                <div>{summary}</div>
              </div>
            )}
          </div>


          {/* Speakers */}
          <div className={styles.aboutSection}>
            {speakers && (
              <p><strong className="dynamic-content">Speakers</strong></p>
            )}

            <div className={metadataStyles.speakersSection}>
              <div className={metadataStyles.grid}>
                {speakers.map((speaker, index) => {
                  const imageUrl = getImageUrl(speaker.image);

                  return (
                    <SpeakerCard
                      key={index}
                      documentId={speaker.documentId}
                      image={imageUrl}
                      speaker_name={speaker.speaker_name}
                      containerStyle={{width: "7.5rem", height: "12.5rem", borderRadius: "1rem"}}
                      textStyle={{fontSize: ".5rem"}}
                    />
                  );
                })}
              </div>
            </div>

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

export default DebateMetadata;
