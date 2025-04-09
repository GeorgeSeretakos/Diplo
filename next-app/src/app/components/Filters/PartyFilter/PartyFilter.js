import React, { useEffect, useState } from "react";
import FilterSection from "../FilterSection.js";
import styles from "./PartyFilter.module.css";
import { constants } from "../../../../../constants/constants.js";
import PartyItem from "../../Party/PartyItem.js";
import axios from "axios";

const PartyFilter = ({ selectedParties = [], onFilterChange }) => {
  const [parties, setParties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const STRAPI_URL = constants.STRAPI_URL;

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const query = `
          query {
            politicalParties(pagination: { limit: -1 }) {
              documentId
              name
              image {
                formats
                url
              }
            }
          }
        `;

        const response = await axios.post(
          `${STRAPI_URL}/graphql`,
          { query },
          { headers: { "Content-Type": "application/json" } }
        );

        setParties(response.data.data.politicalParties);
      } catch (error) {
        console.error("Error fetching parties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParties();
  }, []);

  const visibleParties = parties.slice(0, visibleCount);

  const togglePartySelection = (party) => {
    const isAlreadySelected = selectedParties.includes(party);
    const updatedSelection = isAlreadySelected
      ? selectedParties.filter((t) => t !== party)
      : [...selectedParties, party];

    onFilterChange(updatedSelection);
  };

  return (
    <FilterSection title="Political Party">
      {loading ? (
        <p className="loadingText">Loading parties ...</p>
      ) : (
        <>
          <div className={styles.partyGrid}>
            {visibleParties.map((party) => {
              const partyImage = party.image?.formats?.large?.url
                ? `${STRAPI_URL}${party.image.formats.large.url}`
                : party.image?.url
                  ? `${STRAPI_URL}${party.image.url}`
                  : "/images/parties/parties.jpg";

              return (
                <PartyItem
                  key={party.documentId}
                  name={party.name}
                  image={partyImage}
                  isSelected={selectedParties.includes(party.name)}
                  handleClick={() => togglePartySelection(party.name)}
                />
              );
            })}
          </div>

          {visibleCount < parties.length && (
            <button className="showMoreButton" onClick={() => setVisibleCount(visibleCount + 12)}>
              Show more ...
            </button>
          )}

          {visibleCount >= parties.length && (
            <button className="showMoreButton" onClick={() => setVisibleCount(12)}>
              Show less ...
            </button>
          )}
        </>
      )}
    </FilterSection>
  );
};

export default PartyFilter;
