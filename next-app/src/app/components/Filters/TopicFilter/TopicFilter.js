import React, { useEffect, useState } from "react";
import FilterSection from "../FilterSection.js";
import styles from "../PoliticalPartyFilter/PoliticalPartyFilter.module.css";

const TopicFilter = ({ selectedTopics = [], onFilterChange }) => {
  const [topics, setTopics] = useState([]);

  // Fetch topics from Strapi API
  useEffect(() => {
    const fetchAllTopics = async () => {
      try {
        const response = await fetch("/api/strapi/topics/all");
        const data = await response.json();

        // Format the topics received from the API
        const formattedTopics = data.map((topic) => ({
          value: topic.topic,
          label: topic.topic,
          image: topic.image || "/images/topics/topics.jpg", // Use default image if none is provided
        }));

        setTopics(formattedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error.message);
      }
    };

    fetchAllTopics();
  }, []);

  const toggleTopicSelection = (topic) => {
    const isAlreadySelected = selectedTopics.includes(topic);
    const updatedSelection = isAlreadySelected
      ? selectedTopics.filter((t) => t !== topic) // Remove if already selected
      : [...selectedTopics, topic]; // Add the new topic

    onFilterChange(updatedSelection);
  };

  return (
    <FilterSection title="Topic">
      <div className={styles.partyGrid}>
        {topics.map((topic) => (
          <div
            key={topic.value}
            className={`${styles.partyItem} ${
              selectedTopics.includes(topic.value) ? styles.selected : ""
            }`}
            onClick={() => toggleTopicSelection(topic.value)}
          >
            <div className={styles.imageContainer}>
              <img src={topic.image} alt={topic.label} className={styles.partyImage} />
            </div>
            <p className={styles.partyLabel}>{topic.label}</p>
          </div>
        ))}
      </div>
    </FilterSection>
  );
};

export default TopicFilter;
