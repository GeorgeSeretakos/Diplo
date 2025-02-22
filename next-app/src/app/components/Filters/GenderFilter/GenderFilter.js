import React from "react";
import FilterSection from "../FilterSection.js";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const GenderFilter = ({ selectedGender, onFilterChange }) => {
  const handleGenderSelection = (gender) => {
    const newSelection = selectedGender === gender ? "" : gender;
    onFilterChange(newSelection);
  };

  return (
    <FilterSection title="Gender">
      <div className="flex gap-4">
        {genderOptions.map((gender) => (
          <button
            key={gender.value}
            className={`button transition ${
              selectedGender === gender.value
                ? "!bg-[#1a1a1a] !text-[white]"
                : ""
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
