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

    const searchParams = useSearchParams();
    const searchPerformedParam = searchParams.get("searchPerformed") === "true";
    const primaryFilterParam = searchParams.get("primaryFilter");

    const [searchPerformed, setSearchPerformed] = useState(searchPerformedParam || false);
    const [primaryFilter, setPrimaryFilter] = useState(
      primaryFilterParam || sessionStorage.getItem("primaryFilter") || null
    );
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [inputValues, setInputValues] = useState({ speakerName: "", keyPhrase: "" });

    const [noResultsMessage, setNoResultsMessage] = useState("");

    // Persist `primaryFilter` in sessionStorage
    useEffect(() => {
        if (primaryFilter) {
            sessionStorage.setItem("primaryFilter", primaryFilter);
        }
    }, [primaryFilter]);

    // Fetch all speakers if primaryFilter is "all"
    useEffect(() => {
        if (primaryFilter === "all") {
            fetchAllSpeakers();
        }
    }, [primaryFilter]);

    const fetchAllSpeakers = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/strapi/speakers/all");
            const data = await response.json();
            setSpeakers(data);
        } catch (error) {
            console.error("Error fetching all speakers: ", error);
        } finally {
            setLoading(false);
        }
    };

    const resetSearch = () => {
        setSearchPerformed(false); // Reset search state
        setInputValues({
            speakerName: "",
            keyPhrase: ""
        });
        setSpeakers([]);
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

    const handleInputChange = (name, value) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };


    // Fetch speakers based on primary filet and input values
    const handleSearch = async () => {
        setNoResultsMessage("");
        setLoading(true);
        setSearchPerformed(true);

        try {
            let endpoint;
            if (primaryFilter === "name") {
                endpoint = `/api/strapi/speakers/name?name=${encodeURIComponent(inputValues.speakerName)}`;
            }
            else if (primaryFilter === "speaker-phrase") {
                endpoint  = `/api/strapi/speakers/phrase?phrase=${encodeURIComponent(inputValues.keyPhrase)}`;
            }

            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.length === 0) {
                setNoResultsMessage("No speakers were found, perform another search.");
            }
            else {
                setSpeakers(data);
            }

        } catch (error) {
            console.log("Error fetching speakers: ", error);
        } finally {
            setLoading(false);
        }
    }

    console.log("Speakers: ", speakers);



    // const filteredSpeakers = speakers.filter((speaker) => {
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
                      onSearch={handleSearch} // Update searchPerformed state
                      resetSearch={resetSearch} // Reset the searchPerformed state
                      inputValues={inputValues}
                      onInputChange={handleInputChange}
                    />
                )}
            </div>

            {/* Only show content if search is performed */}
            {(searchPerformed || primaryFilter === "all") && (
                <div className={styles.pageLayout}>
                    {noResultsMessage === "" ? (
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
                    ) :
                      <div className={styles.noResultsMessage}>
                          <p>{noResultsMessage}</p>
                      </div>
                    }

                    <div className={styles.browseSection}>
                        <div className={styles.speakerGrid}>
                            {speakers.map((speaker, index) => {
                                // Construct the full image URL
                                const imageUrl = speaker.image?.formats?.large?.url
                                  ? `${STRAPI_URL}${speaker.image.formats.large.url}`
                                  : speaker.image?.url
                                    ? `${STRAPI_URL}${speaker.image.url}`
                                    : null;

                                return (
                                  <SpeakerCard
                                    key={index}
                                    documentId={speaker.documentId}
                                    image={imageUrl}
                                    speaker_name={speaker.speaker_name}
                                    // party={speaker.party}
                                  />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SpeakersResults;