'use client'

import React, {useEffect, useState} from "react";
import styles from "./DebateResults.module.css";
import SpeakerCard from "@/app/components/Speaker/SpeakerCard/SpeakerCard";
import { Speakers } from "@/app/constants/speakers";
import PoliticalPartyFilter from "@/app/components/Filters/PoliticalPartyFilter/PoliticalPartyFilter";
import AgeFilter from "@/app/components/Filters/AgeFilter/AgeFilter";
import GenderFilter from "@/app/components/Filters/GenderFilter/GenderFilter";
import PhraseFilter from "@/app/components/Filters/PhraseFilter/PhraseFilter";
import TopicFilter from "@/app/components/Filters/TopicFilter/TopicFilter";
import {useSearchParams} from "next/navigation";
import DynamicHeader from "@/utils/DynamicHeader";
import DebateCard from "@/app/components/Debate/DebateCard/DebateCard";

const DebatesResults = () => {

    const debates = [
        {
            documentId: "1",
            date: "2024-12-05",
            topics: ["Healthcare Reform", "Education Budget"],
            session: "Winter Session 2024",
        },
        {
            documentId: "2",
            date: "2024-11-20",
            topics: ["Climate Policy", "Renewable Energy"],
            session: "Autumn Session 2024",
        },
        {
            documentId: "3",
            date: "2024-10-15",
            topics: ["Taxation Laws", "Corporate Regulation"],
            session: "Autumn Session 2024",
        },
        {
            documentId: "4",
            date: "2024-09-25",
            topics: ["National Security", "Defense Budget"],
            session: "Monsoon Session 2024",
        },
        {
            documentId: "5",
            date: "2024-08-10",
            topics: ["Agricultural Subsidies", "Water Resource Management"],
            session: "Monsoon Session 2024",
        },
    ];



    const searchParams = useSearchParams();
    const primaryFilter = searchParams.get("primaryFilter");

    const [searchPerformed, setSearchPerformed] = useState(false);

    const resetSearch = () => {
        setSearchPerformed(false); // Reset search state
    };

    const initialFilterState = {
        parties: ["ALL"],
        topics: ["ALL"],
        ageRange: { min: 0, max: 100 },
        gender: null,
        phrase: "",
    };

    const [filters, setFilters] = useState(initialFilterState);
    const [tempFilters, setTempFilters] = useState(initialFilterState);

    const handleTempFilterChange = (filterKey, updatedValue) => {
        setTempFilters({ ...tempFilters, [filterKey]: updatedValue });
    };

    const applyFilters = () => {
        setFilters(tempFilters);
    };

    const cancelFilters = () => {
        setTempFilters(initialFilterState);
    };

    // const filteredSpeakers = Speakers.filter((speaker) => {
    //     const withinParty =
    //         filters.parties.includes("ALL") || filters.parties.includes(speaker.party);
    //     const withinTopic =
    //         filters.topics.includes("ALL") || filters.topics.some((topic) => speaker.topics.includes(topic));
    //     const withinAge =
    //         speaker.age >= filters.ageRange.min && speaker.age <= filters.ageRange.max;
    //     const withinGender =
    //         !filters.gender || speaker.gender === filters.gender;
    //
    //     return withinParty && withinAge && withinGender && withinTopic;
    // });

    return (
        <>
            {/* Search Section */}
            <div className={styles.searchSection}>
                {primaryFilter && (
                    <DynamicHeader
                        primaryFilter={primaryFilter}
                        onSearch={() => setSearchPerformed(true)} // Update searchPerformed state
                        resetSearch={resetSearch} // Reset the searchPerformed state
                    />
                )}
            </div>

            {/* Only show content if search is performed */}
            {searchPerformed && (
                <div className={styles.pageLayout}>
                    <div className={styles.filterSection}>
                        <PoliticalPartyFilter
                            selectedParties={tempFilters.parties}
                            onFilterChange={(updatedParties) => handleTempFilterChange("parties", updatedParties)}
                        />
                        <TopicFilter
                            selectedTopics={tempFilters.topics}
                            onFilterChange={(updatedTopics) => handleTempFilterChange("topics", updatedTopics)}
                        />
                        <PhraseFilter
                            phrase={tempFilters.phrase}
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
                            <button className="button" onClick={applyFilters}>Apply Filters</button>
                            <button className="button" onClick={cancelFilters}>Cancel</button>
                        </div>
                    </div>

                    <div className={styles.browseSection}>
                        <div className={styles.speakerGrid}>
                            {debates.map((debate, index) => (
                                <DebateCard
                                    key={index}
                                    documentId={debate.documentId}
                                    date={debate.date}
                                    topics={debate.topics}
                                    session={debate.session}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DebatesResults;
