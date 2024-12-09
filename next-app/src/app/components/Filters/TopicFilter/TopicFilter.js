import React from "react";
import FilterSection from "../FilterSection.js";
import styles from "../PoliticalPartyFilter/PoliticalPartyFilter.module.css";

const topics = [
  { value: "ALL", label: "All", image: "/images/parties/greek_parties.jpg" },
  { value: "Democracy", label: "Democracy", image: "/images/topics/democracy.jpg" },
  { value: "Economy", label: "Economy", image: "/images/topics/economy.jpg" },
  { value: "Health", label: "Health", image: "/images/topics/health.jpg" },
  { value: "Europe", label: "Europe", image: "images/topics/global_europe.jpg"}
];

const TopicFilter = ({ selectedTopics = [], onFilterChange }) => {
  const toggleTopicSelection = (topic) => {
    if (topic === "ALL") {
      onFilterChange(["ALL"]); // Select only "All" and clear other selections
    } else {
      const isAlreadySelected = selectedTopics.includes(topic);
      let updatedSelection = isAlreadySelected
        ? selectedTopics.filter((t) => t !== topic) // Remove if already selected
        : [...selectedTopics.filter((t) => t !== "ALL"), topic]; // Add new party, remove "All"

      // If the user deselects all, default back to "All"
      if (updatedSelection.length === 0) {
        updatedSelection = ["ALL"];
      }

      onFilterChange(updatedSelection);
    }
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
              <img src={topic.image} alt={topic.label} className={styles.partyImage}/>
            </div>
            <p className={styles.partyLabel}>{topic.label}</p>
          </div>
        ))}
      </div>
    </FilterSection>
  );
};

export default TopicFilter;
