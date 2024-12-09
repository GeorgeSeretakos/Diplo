import React from "react";
import FilterSection from "../FilterSection.js";
import styles from "./PoliticalPartyFilter.module.css";

const politicalParties = [
  { value: "ALL", label: "All", image: "/images/parties/greek_parties.jpg" },
  { value: "ΝΔ", label: "ΝΔ", image: "/images/parties/NewDemocracy.png" },
  { value: "ΣΥΡΙΖΑ", label: "ΣΥΡΙΖΑ", image: "/images/parties/Syriza.svg" },
  { value: "ΠΑΣΟΚ", label: "ΠΑΣΟΚ", image: "/images/parties/Pasok.svg" },
  { value: "ΚΚΕ", label: "ΚΚΕ", image: "images/parties/KKE.svg"}
];

const PoliticalPartyFilter = ({ selectedParties = [], onFilterChange }) => {
  const togglePartySelection = (party) => {
    if (party === "ALL") {
      onFilterChange(["ALL"]); // Select only "All" and clear other selections
    } else {
      const isAlreadySelected = selectedParties.includes(party);
      let updatedSelection = isAlreadySelected
        ? selectedParties.filter((p) => p !== party) // Remove if already selected
        : [...selectedParties.filter((p) => p !== "ALL"), party]; // Add new party, remove "All"

      // If the user deselects all, default back to "All"
      if (updatedSelection.length === 0) {
        updatedSelection = ["ALL"];
      }

      onFilterChange(updatedSelection);
    }
  };

  return (
    <FilterSection title="Political Party">
      <div className={styles.partyGrid}>
        {politicalParties.map((party) => (
          <div
            key={party.value}
            className={`${styles.partyItem} ${
              selectedParties.includes(party.value) ? styles.selected : ""
            }`}
            onClick={() => togglePartySelection(party.value)}
          >
            <div className={styles.imageContainer}>
              <img src={party.image} alt={party.label} className={styles.partyImage}/>
            </div>
            <p className={styles.partyLabel}>{party.label}</p>
          </div>
        ))}
      </div>
    </FilterSection>
  );
};

export default PoliticalPartyFilter;
