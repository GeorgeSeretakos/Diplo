'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from "next/navigation.js";
import SpeakerCircle from "../../../components/Speaker/SpeakerCircle/SpeakerCircle.js";
import { constants } from "../../../../../constants/constants.js";
import styles from "./DebateContent.module.css";

export default function Speeches() {
  const { id: documentId } = useParams();
  const [speeches, setSpeeches] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const observerRef = useRef(null);
  const STRAPI_URL = constants.STRAPI_URL;

  useEffect(() => {
    async function fetchSpeeches() {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/strapi/debates/content/${documentId}?page=${page}&limit=${limit}`);
        const data = await res.json();
        const newSpeeches = data.data.debate.speeches;

        if (newSpeeches.length > 0) {
          setSpeeches((prevSpeeches) => [...prevSpeeches, ...data.data.debate.speeches]);
        } else {
          console.log("HasMore: ", hasMore);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching speeches: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpeeches();
  }, [page, documentId]);

  console.log("Speeches: ", speeches);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1); // Now `page` updates only when the user scrolls
        }
      },
      { threshold: 0.8 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className={styles.container}>
      <div className={styles.layoutContainer}>
        <div className={styles.contentContainer}>
          {speeches.map((speech) => {
            const image = speech.speakers[0]?.image;
            const imageUrl = image?.formats?.large?.url
              ? `${STRAPI_URL}${image.formats.large.url}`
              : image?.url
                ? `${STRAPI_URL}${image.url}`
                : "/images/politicians/default.avif";

            return (
              <div key={speech.speech_id} className={styles.speechContainer}>
                <div className={styles.speakerInfo}>
                  {image &&
                    <div className="flex justify-center align-middle">
                      <img src={imageUrl} alt={speech.speaker_name} className={styles.speakerImage} />
                    </div>
                  }
                  <div className={styles.speakerName}>
                    {speech.speaker_name.split(" ").map((word, index) => (
                      <span key={index}>{word}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.speechTextContainer}>
                  <div className={styles.speechText}>
                    {speech.content.paragraphs.map((paragraph, index) => (
                      <p key={index} className={styles.speechParagraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/*<div className={styles.imageContainer}>*/}
        {/*  <img src="/images/speaker/speakerPage.webp" alt="Parliament Debate" />*/}
        {/*</div>*/}
      </div>

      {hasMore && <div ref={observerRef} className={styles.loadingTrigger} />}
      {loading && <p className={styles.loadingText}>Loading more speeches ...</p>}
    </div>
  );
}
