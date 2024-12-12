'use client'

import React, {useEffect, useState} from "react";
import styles from "./SpeakersResults.module.css";
import SpeakerCard from "@/app/components/Speaker/SpeakerCard/SpeakerCard";
import PoliticalPartyFilter from "@/app/components/Filters/PoliticalPartyFilter/PoliticalPartyFilter";
import AgeFilter from "@/app/components/Filters/AgeFilter/AgeFilter";
import GenderFilter from "@/app/components/Filters/GenderFilter/GenderFilter";
import PhraseFilter from "@/app/components/Filters/PhraseFilter/PhraseFilter";
import TopicFilter from "@/app/components/Filters/TopicFilter/TopicFilter";
import DynamicHeader from "@/utils/DynamicHeader";
import {constants} from "../../../constants/constants.js";
import {useSearchParams} from "next/navigation";


const SpeakersResults = () => {
    const STRAPI_URL = constants.STRAPI_URL;
    const API_TOKEN = constants.API_TOKEN;

    const searchParams = useSearchParams();
    const searchPerformedParam = searchParams.get("searchPerformed") === "true";
    const primaryFilterParam = searchParams.get("primaryFilter");

    const [searchPerformed, setSearchPerformed] = useState(searchPerformedParam || false);
    const [primaryFilter, setPrimaryFilter] = useState(
      primaryFilterParam || sessionStorage.getItem("primaryFilter") || null
    );
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);


    // Persist `primaryFilter` in sessionStorage
    useEffect(() => {
        if (primaryFilter) {
            sessionStorage.setItem("primaryFilter", primaryFilter);
        }
    }, [primaryFilter]);

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


    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const response = await fetch(
                  `${STRAPI_URL}/api/speakers?fields=speaker_name,documentId&populate=image`,
                  {
                      headers: {
                          Authorization: `Bearer ${API_TOKEN}`,
                      },
                  }
                );
                const data = await response.json();

                const speakersData = data.data.map((speaker) => ({
                    id: speaker.id,
                    name: speaker.speaker_name,
                    image:
                      speaker.image?.formats?.large?.url ||
                      speaker.image?.url ||
                      null, // Use large format or fallback to the original
                    documentId: speaker.documentId,
                }));
                console.log("Speaker data: ", speakersData);
                setSpeakers(speakersData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching speakers:", error);
                setLoading(false);
            }
        };

        fetchSpeakers();
    }, []);

    console.log("Speakers: ", speakers);


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
                            {speakers.map((speaker, index) => (
                                <SpeakerCard
                                    key={index}
                                    documentId={speaker.documentId}
                                    image={
                                        speaker.image
                                          ? `${STRAPI_URL}${speaker.image}`
                                          : null
                                    }
                                    speaker_name={speaker.name}
                                    // party={speaker.party}
                                    // description={speaker.description}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SpeakersResults;
