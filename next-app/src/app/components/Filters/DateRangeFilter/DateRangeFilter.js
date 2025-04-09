import React from "react";
import FilterSection from "../FilterSection.js";

const DateRangeFilter = ({startDate, endDate, handleInputChange}) => {
  return (
    <>
      <FilterSection title="Start Date">
        <input
          type="date"
          className="w-full text-white p-2 rounded-md outline-none text-xs bg-transparent border-2 border-white"
          value={startDate}
          onChange={(e) => handleInputChange("startDate", e.target.value)}
        />
      </FilterSection>

      <FilterSection title="End Date">
        <input
          type="date"
          className="w-full text-white p-2 rounded-md outline-none text-xs bg-transparent border-2 border-white"
          value={endDate}
          onChange={(e) => handleInputChange("endDate", e.target.value)}
        />
      </FilterSection>
    </>
  );
}

export default DateRangeFilter;