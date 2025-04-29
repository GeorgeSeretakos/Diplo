"use client";

import React from "react";
import FilterSection from "./FilterSection.js";

const sentimentOptions = [
  { value: 0, label: "Very Negative" },
  { value: 1, label: "Negative" },
  { value: 2, label: "Neutral" },
  { value: 3, label: "Positive" },
  { value: 4, label: "Very Positive" },
];

const SentimentCheckboxFilter = ({ selectedSentiments = [], onFilterChange, disabled = false }) => {
  const toggleSentiment = (value) => {
    if(disabled) return;
    const isSelected = selectedSentiments.includes(value);
    const updated = isSelected
      ? selectedSentiments.filter((v) => v !== value)
      : [...selectedSentiments, value];
    onFilterChange(updated);
  };

  return (
    <FilterSection title={
      <div className="items-center">
        <div className="mb-2">Speech Tone</div>
        {disabled && (
          <div className="text-[#f9d342] text-xs font-bold">
              (enable by selecting keyphrase or topic)
          </div>
        )}
      </div>
    }>
      <div className="flex gap-2 flex-wrap justify-center">
        {sentimentOptions.map(({ value, label }) => (
          <label
            key={value}
            className={`flex items-center justify-center text-xs font-bold px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
              selectedSentiments.includes(value)
                ? "bg-white text-black font-semibold border-white"
                : "bg-transparent text-white border-white hover:bg-white hover:text-black hover:cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedSentiments.includes(value)}
              onChange={() => toggleSentiment(value)}
              className="hidden"
              disabled={disabled}
            />
            {label}
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

export default SentimentCheckboxFilter;
