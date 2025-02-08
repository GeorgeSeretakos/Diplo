'use client';

import React, { useState } from "react";
import FilterModal from "../../app/components/FilterModal/FilterModal"
import AgeFilter from "../../app/components/Filters/AgeFilter/AgeFilter"; // Your existing speaker filter component

const FilterPage = () => {
    const [activeFilter, setActiveFilter] = useState(null); // Tracks the active filter

    return (
        <div>
            <h1>Search Debates</h1>

            {/* Filter Buttons */}
            <div className="filters">
                <button onClick={() => setActiveFilter("speakers")}>👥 Select Speakers</button>
                <button onClick={() => setActiveFilter("topics")}>📌 Select Topics</button>
            </div>

            {/* Render the Modal Only When a Filter is Active */}
            <FilterModal
                isOpen={!!activeFilter}
                onClose={() => setActiveFilter(null)}
                title={activeFilter === "speakers" ? "Select Speakers" : "Select Topics"}
            >
                {activeFilter === "speakers" && <AgeFilter />}
            </FilterModal>
        </div>
    );
};

export default FilterPage;
