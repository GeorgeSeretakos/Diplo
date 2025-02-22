import React, { useEffect, useState } from "react";
import FilterSection from "../FilterSection.js";
import styles from "./TopicFilter.module.css";
import { constants } from "../../../../../constants/constants.js";
import axios from "axios";

const PartyFilter = ({ selectedTopics = [], onFilterChange }) => {
  const [topics, setTopics] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const STRAPI_URL = constants.STRAPI_URL;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const endpoint = "http://localhost:3000/api/strapi/topics";
        const response = await axios.get(endpoint);

        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const visibleTopics = topics.slice(0, visibleCount);

  const toggleTopic = (topic) => {
    const isAlreadySelected = selectedTopics.includes(topic);
    const updatedSelection = isAlreadySelected
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];

    onFilterChange(updatedSelection);
  };

  return (
    <FilterSection title="Topics Discussed">
      {loading ? (
        <p className="loadingText">Loading topics ...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 rounded-lg">
            {visibleTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => toggleTopic(topic.topic)}
                className={`button transition ${
                  selectedTopics.includes(topic.topic)
                    ? "!bg-[#1a1a1a] !text-[white]"
                    : "hover:bg-white hover:text-[#1a1a1a]"
                }`}
              >
                {topic.topic}
              </button>
            ))}
          </div>

          {visibleCount < topics.length && (
            <button className="showMoreButton" onClick={() => setVisibleCount(visibleCount + 10)}>
              Show more ...
            </button>
          )}

          {visibleCount >= topics.length && (
            <button className="showMoreButton" onClick={() => setVisibleCount(10)}>
              Show less ...
            </button>
          )}
        </>
      )}
    </FilterSection>
  );
};

export default PartyFilter;
