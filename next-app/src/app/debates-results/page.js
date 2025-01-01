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
import {constants} from "../../../constants/constants.js";

const DebatesResults = () => {
    const STRAPI_URL = constants.STRAPI_URL;

    const searchParams = useSearchParams();
    const searchPerformedParam = searchParams.get("searchPerformed") === "true";
    const primaryFilterParam = searchParams.get("primaryFilter");
    const [primaryFilter, setPrimaryFilter] = useState(
      primaryFilterParam || sessionStorage.getItem("primaryFilter") || null
    );
    const [debates, setDebates] = useState(null);
    const [loading, setLoading] = useState(false);

    // console.log("Primary filter: ", primaryFilter);

    // Persist `primaryFilter` in sessionStorage
    useEffect(() => {
        if (primaryFilter) {
            sessionStorage.setItem("primaryFilter", primaryFilter);
        }
    }, [primaryFilter]);

    // Fetch all speakers if primaryFilter is "all"
    useEffect(() => {
        if (primaryFilter === "all-debates") {
            fetchAllDebates();
        }
    }, [primaryFilter]);

    const fetchAllDebates = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/strapi/debates/all");
            console.log("api response: ", response);
            const data = await response.json();
            setDebates(data);
        } catch (error) {
            console.error("Error fetching all speakers: ", error);
        } finally {
            setLoading(false);
        }
    };

    console.log("Debates: ", debates);



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

    if (loading) {
        return <p>Loading ...</p>
    }


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
            {(searchPerformed || primaryFilter === "all-debates") && (
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
                            {debates && debates.length > 0 ? (
                              debates.map((debate, index) => (
                                <DebateCard
                                  key={index}
                                  documentId={debate.documentId}
                                  date={debate.date}
                                  topics={debate.topics}
                                  parliament_session={debate.parliament_session}
                                />
                              ))
                            ) : (
                              <p>Loading debates ...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DebatesResults;
