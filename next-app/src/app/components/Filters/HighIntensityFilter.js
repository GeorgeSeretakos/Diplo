"use client";

import React from "react";

const HighIntensityFilter = ({ highIntensityOnly, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange(e.target.checked);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold text-white">
          Ομιλίες Υψηλής Συναισθηματικής Έντασης
        </h3>
        <input
          type="checkbox"
          checked={highIntensityOnly}
          onChange={handleChange}
          className="w-5 h-5 accent-none rounded-full"
        />
      </div>
    </div>
  );
};

export default HighIntensityFilter;