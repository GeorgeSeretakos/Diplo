import React, { useState } from "react";
import FilterSection from "./FilterSection.js";
import {Search, X} from "lucide-react";

const NameFilter = ({ onFilterChange }) => {
  const [query, setQuery] = useState("");
  const handleX = () => {
    onFilterChange("");
    setQuery("");
  }

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onFilterChange(e.target.value);
  }

  return (
    <FilterSection title="Speaker Name">
      {/* Search Input Container */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Enter speakers name ..."
          className="w-full text-white placeholder-white bg-transparent pr-20 pl-4 py-2 rounded-3xl border-white border-1 outline-none focus:outline-none focus:ring-0 focus:shadow-none"
          value={query}
          onChange={handleSearch}
        />

        {/* Clear Button (X) */}
        {query && (
          <button
            onClick={handleX}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18}/>
          </button>
        )}

        {/* Search Button Inside Input */}
        <button
          disabled
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white"
        >
          <Search size={18}/>
        </button>
      </div>
    </FilterSection>
  );
};

export default NameFilter;
