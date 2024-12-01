'use client'

import React, { useState } from "react";
import styles from "./BrowseSpeakers.module.css";
import SpeakerCard from "@/app/components/Speaker/SpeakerCard/SpeakerCard";
import { Speakers } from "@/app/constants/speakers";
import PoliticalPartyFilter from "@/app/components/Filters/PoliticalPartyFilter/PoliticalPartyFilter";

const Page = () => {
    // Initial state for filters
    const initialFilterState = {
        parties: ["ALL"], // Default to "All" selected
    };

    // Main filters applied to the search
    const [filters, setFilters] = useState(initialFilterState);

    // Temporary filters for user interaction
    const [tempFilters, setTempFilters] = useState(initialFilterState);

    // Handle filter changes in the temporary state
    const handleTempFilterChange = (filterKey, updatedValue) => {
        setTempFilters({ ...tempFilters, [filterKey]: updatedValue });
    };

    // Apply filters and trigger search
    const applyFilters = () => {
        setFilters(tempFilters); // Copy temporary filters to the main filters
    };

    // Reset filters to their initial state
    const cancelFilters = () => {
        setTempFilters(initialFilterState); // Reset temporary filters
    };

    // Filter speakers based on the applied filters
    const filteredSpeakers = Speakers.filter((speaker) =>
        filters.parties.includes("ALL") || filters.parties.includes(speaker.party)
    );

    return (
        <div className={styles.pageLayout}>
            {/* Filter Container */}
            <div className={styles.filterSection}>
                <h2>Filters</h2>
                <PoliticalPartyFilter
                    selectedParties={tempFilters.parties}
                    onFilterChange={(updatedParties) => handleTempFilterChange("parties", updatedParties)}
                />



                <div className="buttonContainer">
                    <button className="button" onClick={applyFilters}>Apply Filters</button>
                    <button className="button" onClick={cancelFilters}>Cancel</button>
                </div>
            </div>

            {/* Browse Speakers */}
            <div className={styles.browseSection}>
                <h1>Browse Speakers</h1>
                <div className={styles.speakerGrid}>
                    {filteredSpeakers.map((speaker, index) => (
                        <SpeakerCard
                            key={index}
                            photo={speaker.photo}
                            name={speaker.name}
                            party={speaker.party}
                            description={speaker.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
