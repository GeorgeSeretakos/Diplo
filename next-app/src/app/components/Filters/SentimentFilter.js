"use client";

import React from "react";
import FilterSection from "./FilterSection";

const sentimentOptions = [
  { value: 0, label: "Πολύ Αρνητικό" },
  { value: 1, label: "Αρνητικό" },
  { value: 2, label: "Ουδέτερο" },
  { value: 3, label: "Θετικό" },
  { value: 4, label: "Πολύ Θετικό" },
];

const rhetoricalOptions = [
  "Ενημέρωση/Επεξήγηση",
  "Πειθώ/Υποστήριξη",
  "Κίνητρο/Έμπνευση",
  "Κριτική/Καταγγελία",
  "Ανάμνηση/Τιμή",
  "Άλλο",
];

const SentimentFilter = ({
                           selectedSentiments = [],
                           selectedIntent = null,
                           highIntensityOnly = false,
                           onSentimentChange,
                           onIntentChange,
                           onIntensityToggle,
                           disabled = false,
                         }) => {
  const toggleSentiment = (value) => {
    if (disabled) return;
    const isSelected = selectedSentiments.includes(value);
    const updated = isSelected
      ? selectedSentiments.filter((v) => v !== value)
      : [...selectedSentiments, value];
    onSentimentChange(updated);
  };

  return (
    <>
      {/* Ρητορική Πρόθεση */}
      <FilterSection title="Ρητορική Πρόθεση">
        <div className="flex gap-2 flex-wrap justify-center">
          {rhetoricalOptions.map((intent) => {
            const isSelected = selectedIntent === intent;

            return (
              <label
                key={intent}
                className={`flex items-center justify-center text-xs font-bold px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
                  isSelected
                    ? "bg-white text-black font-semibold border-white"
                    : "bg-transparent text-white border-white hover:bg-white hover:text-black hover:cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    onIntentChange(isSelected ? null : intent)
                  }
                  className="hidden"
                  disabled={disabled}
                />
                {intent}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Φρασεολογία Ομιλίας */}
      <FilterSection
        title={
          <div className="items-center">
            <div className="mb-2">Συναισθηματικό Φορτίο Ομιλίας</div>
            {disabled && (
              <div className="text-[#f9d342] text-xs font-bold">
                (ενεργοποιείται με επιλογή θεματικής ή λέξης-κλειδί)
              </div>
            )}
          </div>
        }
      >
        {/* Sentiment pills */}
        <div className="flex gap-2 flex-wrap justify-center mb-3">
          {sentimentOptions.map(({value, label}) => (
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

        {/* High intensity checkbox */}
        <div className="flex justify-center">
          <label className="inline-flex items-center gap-2 text-white text-sm whitespace-nowrap">
            <input
              type="checkbox"
              disabled={disabled}
              checked={highIntensityOnly}
              onChange={(e) => onIntensityToggle(e.target.checked)}
              className="form-checkbox w-4 h-4 accent-white"
            />
            <span>Μόνο Ομιλίες Υψηλής Συναισθηματικής Έντασης</span>
          </label>
        </div>

      </FilterSection>

    </>
  );
};

export default SentimentFilter;
