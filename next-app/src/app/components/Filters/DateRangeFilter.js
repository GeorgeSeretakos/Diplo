import React from "react";
import FilterSection from "./FilterSection.js";

const DateRangeFilter = ({ startDate, endDate, handleInputChange }) => {
  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <FilterSection title="Aπό">
          <input
            type="date"
            className="w-full text-white p-2 rounded-md outline-none text-xs bg-transparent border-2 border-white"
            value={startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
          />
        </FilterSection>
      </div>

      <div className="w-1/2 text-right">
        <FilterSection title="Έως">
          <input
            type="date"
            className="w-full text-white p-2 rounded-md outline-none text-xs bg-transparent border-2 border-white"
            value={endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
          />
        </FilterSection>
      </div>
    </div>
  );
};

export default DateRangeFilter;
