import React, { useEffect, useState } from "react";
import FilterSection from "./FilterSection.js";
import { constants } from "../../../../constants/constants.js";
import axios from "axios";

const TopicFilter = ({ selectedTopics = [], onFilterChange }) => {
  const [topics, setTopics] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const STRAPI_URL = constants.STRAPI_URL;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const query = `
          query {
            topics(pagination: { limit: -1 }) {
              topic
            }
          }
        `;

        const response = await axios.post(
          `${STRAPI_URL}/graphql`,
          { query },
          { headers: { "Content-Type": "application/json" } }
        );

        setTopics(response.data.data.topics);
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
          <div className="flex flex-wrap gap-2 justify-center">
            {visibleTopics.map((topic, index) => (
              <label
                key={index}
                className={`flex font-bold items-center justify-center text-sm px-4 py-2 rounded-full border transition whitespace-nowrap cursor-pointer ${
                  selectedTopics.includes(topic.topic)
                    ? "bg-white text-black font-semibold border-white"
                    : "bg-transparent text-white border-white hover:bg-white hover:text-black"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.topic)}
                  onChange={() => toggleTopic(topic.topic)}
                  className="hidden"
                />
                {topic.topic}
              </label>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            {visibleCount < topics.length ? (
              <button
                className="text-sm underline hover:opacity-80"
                onClick={() => setVisibleCount(visibleCount + 10)}
              >
                Show more...
              </button>
            ) : (
              <button
                className="text-sm underline hover:opacity-80"
                onClick={() => setVisibleCount(10)}
              >
                Show less
              </button>
            )}
          </div>
        </>
      )}
    </FilterSection>
  );
};

export default TopicFilter;
