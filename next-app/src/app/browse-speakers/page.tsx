'use client'

import React, { useState } from "react";
import styles from "./BrowseSpeakers.module.css";
import SpeakerCard from "@/app/components/Speaker/SpeakerCard/SpeakerCard";
import { Speakers } from "@/app/constants/speakers";
import PoliticalPartyFilter from "@/app/components/Filters/PoliticalPartyFilter/PoliticalPartyFilter";
import AgeFilter from "@/app/components/Filters/AgeFilter/AgeFilter";
import GenderFilter from "@/app/components/Filters/GenderFilter/GenderFilter";
import PhraseFilter from "@/app/components/Filters/PhraseFilter/PhraseFilter";

const Page = () => {
    // Initial state for filters
    const initialFilterState = {
        parties: ["ALL"], // Default to "All" selected
        ageRange: { min: 0, max: 100 }, // Default age range
        gender: null, // Default: no gender selected
        phrase: "", // Default: no phrase filter applied
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
    const filteredSpeakers = Speakers.filter((speaker) => {
        const withinParty =
            filters.parties.includes("ALL") || filters.parties.includes(speaker.party);
        const withinAge =
            speaker.age >= filters.ageRange.min && speaker.age <= filters.ageRange.max;
        const withinGender =
            !filters.gender || speaker.gender === filters.gender;
        // Match phrase logic

        return withinParty && withinAge && withinGender;
    });

    return (
        <div className={styles.pageLayout}>
            {/* Filter Container */}
            <div className={styles.filterSection}>
                <h2>Filters</h2>
                <PoliticalPartyFilter
                    selectedParties={tempFilters.parties}
                    onFilterChange={(updatedParties) => handleTempFilterChange("parties", updatedParties)}
                />

                <PoliticalPartyFilter
                    selectedParties={tempFilters.parties}
                    onFilterChange={(updatedParties) => handleTempFilterChange("parties", updatedParties)}
                />

                <PhraseFilter
                    prhase={tempFilters.phrase}
                    onPhraseChange={(updatedPhrase) => handleTempFilterChange("phrase", updatedPhrase)}
                />

                <AgeFilter
                    ageRange={tempFilters.ageRange}
                    onAgeRangeChange={(updatedRange) => handleTempFilterChange("ageRange", updatedRange)}
                />

                <GenderFilter
                    selectedGender={tempFilters.gender}
                    onFilterChange={(updatedGender) => handleTempFilterChange("gender", updatedGender)}
                />


                <div className="buttonContainer">
                    <button className="button dynamic-content" onClick={applyFilters}>Apply Filters</button>
                    <button className="button dynamic-content" onClick={cancelFilters}>Cancel</button>
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
