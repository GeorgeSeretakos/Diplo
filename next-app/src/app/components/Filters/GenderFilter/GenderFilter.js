import React from "react";
import FilterSection from "../FilterSection.js";
import styles from "./GenderFilter.module.css";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const GenderFilter = ({ selectedGender = null, onFilterChange }) => {
  const handleGenderSelection = (gender) => {
    const newSelection = selectedGender === gender ? null : gender; // Toggle selection
    onFilterChange(newSelection);
  };

  return (
    <FilterSection title="Gender">
      <div className="buttonContainer">
        {genderOptions.map((gender) => (
          <button
            key={gender.value}
            className={`button ${styles.genderItem} ${
              selectedGender === gender.value ? styles.selected : styles.notSelected
            }`}
            onClick={() => handleGenderSelection(gender.value)}
          >
            {gender.label}
          </button>
        ))}
      </div>
    </FilterSection>
  );
};

export default GenderFilter;
