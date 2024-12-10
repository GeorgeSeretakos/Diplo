'use client';

import styles from "./SpeakerProfile.module.css";
import { formatDateToGreek } from "../../../utils/Date/formatDate.js";
import { fetchPositionHeld } from "@/utils/wikidata/dataFetchers";
import React, { useEffect, useState } from "react";

const SpeakerPositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const speakerEntityId = "Q4684534"; // Kyriakos Mitsotakis
        const positionsData = await fetchPositionHeld(`https://www.wikidata.org/wiki/${speakerEntityId}`);
        setPositions(positionsData);
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.pageLayout}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Positions Held</h1>
        </header>

        <section className={styles.section}>
          {positions.length > 0 ? (
            <ul className={styles.positionsList}>
              {positions.map((position, index) => (
                <li key={index} className={styles.positionItem}>
                  {position.position}
                  {position.of && ` (${position.of}),`}
                  {position.startTime || position.endTime ? (
                    ` από ${formatDateToGreek(position.startTime)} έως ${formatDateToGreek(position.endTime) || "Present"}`
                  ) : null }
                </li>
              ))}
            </ul>
          ) : (
            <p>No positions held available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default SpeakerPositionsPage;
