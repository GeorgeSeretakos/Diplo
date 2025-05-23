import React from "react";
import FilterSection from "./FilterSection.js";

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
      <div className="flex gap-2 justify-center">
        {genderOptions.map((gender) => (
          <label
            key={gender.value}
            className={`flex items-center justify-center text-sm font-bold px-4 py-2 rounded-full border transition whitespace-nowrap ${
              selectedGender === gender.value
                ? "bg-white text-black font-semibold border-white"
                : "bg-transparent text-white border-white hover:bg-white hover:text-black"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedGender === gender.value}
              onChange={() => handleGenderSelection(gender.value)}
              className="hidden"
            />
            {gender.label}
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

export default GenderFilter;
