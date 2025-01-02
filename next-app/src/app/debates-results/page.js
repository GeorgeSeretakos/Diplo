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
import DynamicHeader from "../../utils/DynamicHeader.js";
import DebateCard from "@/app/components/Debate/DebateCard/DebateCard";
import {constants} from "../../../constants/constants.js";
import axios from "axios";

const DebatesResults = () => {
    const STRAPI_URL = constants.STRAPI_URL;

    const [noResultsMessage, setNoResultsMessage] = useState("");

    const searchParams = useSearchParams();
    const searchPerformedParam = searchParams.get("searchPerformed") === "true";
    const primaryFilterParam = searchParams.get("primaryFilter");
    const [primaryFilter, setPrimaryFilter] = useState(
      primaryFilterParam || sessionStorage.getItem("primaryFilter") || null
    );
    const [debates, setDebates] = useState([]);
    const [loading, setLoading] = useState(false);

    const [inputValues, setInputValues] = useState({
        startDate: "",
        endDate: "",
        parliament_session: "",
        keyPhrase: ""
    });


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
        setInputValues({
            startDate: "",
            endDate: "",
            keyPhrase: ""
        });
        setDebates([]);
    };

    const initialFilterState = {
        parties: ["ALL"],
        topics: ["ALL"],
        ageRange: { min: 0, max: 100 },
        gender: null,
        phrase: "",
    };

    const handleInputChange = (name, value) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
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

    const handleSearch = async () => {
        setNoResultsMessage("");
        setLoading(true);
        setSearchPerformed(true);

        try {
            let endpoint;
            if (primaryFilter === "debate-date") {
                // Define the endpoint for your API
                endpoint = "/api/strapi/debates/dateRange"; // Adjust this based on your API route

                // const body = {
                //     startDate: new Date(inputValues.startDate).toISOString().split("T")[0],
                //     endDate: new Date(inputValues.endDate).toISOString().split("T")[0],
                // };

                const body = {
                    startDate: inputValues.startDate,
                    endDate: inputValues.endDate
                }

                console.log("Body being sent:", body); // Debugging log

                // Make the Axios request
                const response = await axios.post(endpoint, body);
                console.log("Response: ", response.data);
                //
                // console.log("Response data: ", response.data);

                // Check and handle the response
                if (response.data?.length === 0) {
                    setNoResultsMessage("No debates found for the selected date range.");
                }
                setDebates(response.data);
            }
        } catch (error) {
            console.error("Error fetching debates: ", error.message);
            setNoResultsMessage("An error occurred while fetching debates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
            {(searchPerformed || primaryFilter === "all-debates") && (
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
                            {debates.map((debate, index) => (
                              <DebateCard
                                key={index}
                                documentId={debate.documentId}
                                date={debate.date}
                                topics={debate.topics}
                                parliament_session={debate.parliament_session}
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
