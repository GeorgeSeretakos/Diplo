import React, { useState } from "react";
import Select from "react-select";
import { Label } from "../../ui/label.js";
import FilterSection from "../FilterSection.js";

const MultiSelectFilter = ({ options, selectedValues, onChange, placeholder }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <FilterSection title="Participating Speakers">
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
    </FilterSection>
  );
};

export default MultiSelectFilter;
