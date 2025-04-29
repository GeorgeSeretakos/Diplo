import React, {useEffect, useState} from "react";
import Select from "react-select";
import FilterSection from "./FilterSection.js";
import {constants} from "@constants/constants.js";

const MultiSelectFilter = ({ selectedValues, onChange, placeholder }) => {
  const [options, setOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchSpeakers = async () => {
      try {
        const query = `
          query {
            speakers(pagination: { limit: -1 }) {
              speaker_name
            }
          }
        `;
        const response = await fetch(`${constants.STRAPI_URL}/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        const speakerNames = result?.data?.speakers?.map((s) => s.speaker_name) || [];
        setOptions(speakerNames);
      } catch (error) {
        console.error("Error fetching speakers:", error);
      }
    };

    fetchSpeakers();
  }, []);

  return (
    <FilterSection title="Participating Speakers">
      {isMounted && (
        <Select
          isMulti
          options={options.map((option) => ({ value: option, label: option }))}
          value={selectedValues.map((value) => ({ value, label: value }))}
          onChange={(selectedOptions) =>
            onChange(selectedOptions ? selectedOptions.map((option) => option.value) : [])
          }
          onMenuOpen={() => setIsDropdownOpen(true)}
          onMenuClose={() => setIsDropdownOpen(false)}
          placeholder={placeholder || "Select options..."}
          className="text-xs text-white"
          styles={{
            control: (base, { isFocused }) => ({
              ...base,
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              border: "2px solid white",
              boxShadow: isFocused ? "none" : "none",
            }),
            placeholder: (base) => ({
              ...base,
              color: "white !important",
              fontSize: "bold",
              opacity: 1,
            }),
            input: (base) => ({
              ...base,
              color: "white",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#1a1a1a",
              color: "white",
              position: "absolute",
              zIndex: 9999,
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? "#374151" : "#1a1a1a",
              color: "white",
              fontSize: "0.75rem",
              lineHeight: "1rem",
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#374151",
              color: "white",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "white",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "white",
              ":hover": {
                backgroundColor: "#4b5563",
              },
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPosition="absolute"
          menuPortalTarget={document.body}
        />
      )}
    </FilterSection>
  );
};

export default MultiSelectFilter;
