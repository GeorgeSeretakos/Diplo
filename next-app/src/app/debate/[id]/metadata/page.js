'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./DebateMetadata.module.css";
import SpeakerCard from "../../../components/Speaker/SpeakerCard/SpeakerCard.js";
import { constants } from "../../../../../constants/constants.js";
import axios from "axios";
import Link from "next/link";


const DebateMetadata = () => {
  const initialSpeakersShown = 3;
  const router = useRouter();
  const [debateData, setDebateData] = useState(null);
  const [visibleSpeakers, setVisibleSpeakers] = useState(initialSpeakersShown); // Number of speakers to show initially
  const [showMoreVisible, setShowMoreVisible] = useState(true); // Control visibility of "Show More" link

  const STRAPI_URL = constants.STRAPI_URL;

  const { id: documentId } = useParams();

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

  if (!debateData) return <p>No data available</p>;

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
  } = debateData;

  const getImageUrl = (image) => {
    return image?.formats?.large?.url
      ? `${STRAPI_URL}${image.formats.large.url}`
      : image?.url
        ? `${STRAPI_URL}${image.url}`
        : "/images/politicians/default.avif";
  };


  return (
    <div className={styles.pageLayout}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>{title}</h1>

        {opening_section && <div className={styles.description}>{opening_section}</div>}

        {topics && (
          <p className="mb-[4rem]">
            <strong className="dynamic-content">Topics Discussed:</strong>{" "}
            {topics.map((t) => t.topic).join(", ")} {/* Extract topic values and join */}
          </p>
        )}

        {(session || period || meeting) && (
          <div>
            <ul className={styles.list}>
              <li><strong className="dynamic-content">Session Date:</strong> {session_date}</li>
              <li><strong className="dynamic-content">Period:</strong> {period}</li>
              <li><strong className="dynamic-content">Session:</strong> {session}</li>
              <li><strong className="dynamic-content">Meeting:</strong> {meeting}</li>
            </ul>
          </div>
        )}

        {summary && (
          <div className="mb-[4rem]">
            <strong className="dynamic-content">Summary</strong>
            <div>{summary}</div>
          </div>
        )}

        {speakers && (
          <p>
            <strong className="dynamic-content">Participating Speakers {`(${speakers.length})`}</strong>
          </p>
        )}

        <div className={styles.grid}>
          {speakers.slice(0, visibleSpeakers).map((speaker, index) => {
            const imageUrl = getImageUrl(speaker.image);

            return (
              // eslint-disable-next-line react/jsx-no-undef
              <Link key={index} href={`/speaker/${speaker.documentId}`} className={styles.speakerInfo}>
                <div className="flex justify-center align-middle">
                  <img
                    src={imageUrl}
                    alt={speaker.speaker_name}
                    className={styles.speakerImage}
                    onError={(e) => (e.currentTarget.src = "/images/default-speaker.jpg")} // Fallback image
                  />
                </div>
                <div className={styles.speakerName}>
                  {speaker.speaker_name.split(" ").map((word, idx) => (
                    <span key={idx}>{word}</span>
                  ))}
                </div>
              </Link>
            );
          })}
          {showMoreVisible && speakers.length > visibleSpeakers && (
            <div
              onClick={() => setVisibleSpeakers(speakers.length)}
              style={{
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Show More ...
            </div>
          )}
          {showMoreVisible && speakers.length === visibleSpeakers && (
            <div
              onClick={() => setVisibleSpeakers(initialSpeakersShown)}
              style={{
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Show Less
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.backgroundImageContainer}></div>
        <button className={`button ${styles.button2}`} onClick={() => router.push(`/debate/${documentId}/content`)}>
          View Content
        </button>
      </div>
    </div>
  );
};

export default DebateMetadata;