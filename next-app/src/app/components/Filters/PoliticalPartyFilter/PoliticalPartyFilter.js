import React, {useEffect, useState} from "react";
import FilterSection from "../FilterSection.js";
import styles from "./PoliticalPartyFilter.module.css";
import {constants} from "../../../../../constants/constants.js";

const PoliticalPartyFilter = ({ selectedParties = [], onFilterChange }) => {

  const [parties, setParties] = useState([]);
  const STRAPI_URL = constants.STRAPI_URL;

  // Fetch parties from Strapi API
  useEffect(() => {
    const fetchAllParties = async () => {
      try {
        const response = await fetch("/api/strapi/parties");
        const data = await response.json();

        console.log("Data: ", data);

        // Format the parties received from the API
        const formattedParties = data.map((party) => ({
          value: party.name,
          label: party.name,
          image: party.image || "/images/parties/parties.jpg"
        }))

        setParties(formattedParties);
      } catch (error) {
        console.error("Error fetching topics: ", error.message);
      }
    }

    fetchAllParties();
  }, []);


  const togglePartySelection = (party) => {
    const isAlreadySelected = selectedParties.includes(party);
    const updatedSelection = isAlreadySelected
      ? selectedParties.filter((t) => t !== party) // Remove if already selected
      : [...selectedParties, party]; // Add the new topic

    onFilterChange(updatedSelection);
  };

  return (
    <FilterSection title="Political Party">
      <div className={styles.partyGrid}>
        {parties.map((party) => {
          const partyImage = party.image?.formats?.large?.url
            ? `${STRAPI_URL}${party.image.formats.large.url}`
            : party.image?.url
              ? `${STRAPI_URL}${party.image.url}`
              : "/images/parties/parties.jpg";


          return (
            <div
              key={party.value}
              className={`${styles.partyItem} ${
                selectedParties.includes(party.value) ? styles.selected : ""
              }`}
              onClick={() => togglePartySelection(party.value)}
            >
              <div className={styles.imageContainer}>
                <img
                  src={partyImage}
                  alt={party.label}
                  className={styles.partyImage}
                />
              </div>
              <p className={styles.partyLabel}>{party.label}</p>
            </div>
          );
        })}
      </div>
    </FilterSection>

  );
};

export default PoliticalPartyFilter;
