"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import DebateBig from "@components/Debate/DebateBig/DebateBig";
import NavigationBar from "@components/Navigation/NavigationBar.js";

import TopicFilter from "@components/Filters/TopicFilter.js";
import SessionFilter from "@components/Filters/SessionFilter.js";
import DateRangeFilter from "@components/Filters/DateRangeFilter.js";
import SpeakerOptionsFilter from "@components/Filters/SpeakerOptionsFilter.js";
import SpeakerDebate from "@components/SpeakerDebate/SpeakerDebate.js";

import styles from "./SearchDebates.module.css";

import {useDebatesCacheStore} from "@stores/useDebatesCacheStore.js";
import {getImageUrl} from "../../utils/getImageUrl.js";
import SentimentFilter from "../components/Filters/SentimentFilter.js";

export default function DebateSearch() {

    const MAX_LIMIT = 15;

    const [inputValues, setInputValues] = useState({
        startDate: "",
        endDate: "",
        keyPhrase: "",
        session: "",
        meeting: "",
        period: "",
        topics: [],
        speakers: [],
    });

    const [limit] = useState(MAX_LIMIT); // Items per page

    const [isClient, setIsClient] = useState(false);
    const [debates, setDebates] = useState([]);
    const [sortBy, setSortBy] = useState("newest");

    const {
        cachedDebates,
        totalPages,
        page,
        setCachedDebates,
        setTotalPages,
        setPage,
        resetCache,
    } = useDebatesCacheStore();

    console.log("Cached Debates Store: ",
      cachedDebates,
      totalPages,
      page,
      setCachedDebates,
      setTotalPages,
      setPage,
      resetCache,
    );

    const handleInputChange = (name, value) => {
        setPage(1); // Reset to page 1 on any input change
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    useEffect(() => {
        setIsClient(true);
    }, []);

    // 👇 When filters change, fetch new debates
    useEffect(() => {
        const fetchDebates = async () => {
            try {
                const endpoint = "/api/search-debates";
                const body = {
                    keyPhrase: inputValues.keyPhrase,
                    strapiFilters: {
                        startDate: inputValues.startDate,
                        endDate: inputValues.endDate,
                        session: inputValues.session,
                        meeting: inputValues.meeting,
                        period: inputValues.period,
                        topics: inputValues.topics,
                        speakers: inputValues.speakers,
                    },
                    sortBy,
                };

                const response = await axios.post(endpoint, body);
                console.log("Fetched Debates:", response.data);

                setDebates(response.data.debates);
                setCachedDebates(response.data.debates);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching debates:", error);
            }
        };
        fetchDebates();
    }, [inputValues, sortBy]);

    // Helper to get paginated debates to show
    const getPaginatedDebates = () => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return cachedDebates.slice(start, end);
    };


    console.log("Debates returned: ", debates);

    return (
      <div className="bg-[rgba(244, 242, 234, 0.8)] text-black">
          <div className={styles.backgroundContainer}></div>

          {/* Top Navbar */}
          <NavigationBar
            title="Search Debates"
            showSearch={true}
            placeholder="Enter key phrase..."
            onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
            showSortBy={true}
            setSortBy={setSortBy}
            setPage={setPage}
          />


          {/* Main Layout */}
          <div className="flex text-white w-full m-auto pt-[6rem] relative z-10">
              {/* Filters Sidebar */}
              <div className="space-y-6 p-10 rounded-br-2xl h-fit w-[35%] min-h-[100vh]">
                  <div className="text-center text-3xl font-bold mb-6">
                      <h1>Filters</h1>
                  </div>

                  <DateRangeFilter
                    startDate={inputValues.startDate}
                    endDate={inputValues.endDate}
                    handleInputChange={handleInputChange}
                  />

                  <SessionFilter
                    session={inputValues.session}
                    period={inputValues.period}
                    meeting={inputValues.meeting}
                    handleInputChange={handleInputChange}
                  />

                  <SpeakerOptionsFilter
                    selectedValues={inputValues.speakers}
                    onChange={(updatedSelection) => handleInputChange("speakers", updatedSelection)}
                    placeholder="Search and select speakers..."
                  />

                  <TopicFilter
                    selectedTopics={inputValues.topics}
                    onFilterChange={(updatedSelection) => handleInputChange("topics", updatedSelection)}
                  />

                  <SentimentFilter
                    selectedSentiments={inputValues.sentiments}
                    onFilterChange={(updatedSentiments) => handleInputChange("sentiments", updatedSentiments)}
                    disabled={inputValues.keyPhrase.trim() === "" && inputValues.topics.length === 0}
                  />
              </div>

              {/* Debates Section */}
              <div className="w-[65%] flex flex-col items-center p-10 space-y-6">
                  <div className="text-center text-3xl font-bold">
                      <h1>Debates</h1>
                  </div>

                  <div className={styles.debateGrid}>
                      {getPaginatedDebates().map((debate, index) => (
                        debate.top_speech ? (
                          <SpeakerDebate
                            key={index}
                            speakerId={debate.top_speech.speaker_id}
                            speakerName={debate.top_speech.speaker_name}
                            speakerImage={getImageUrl()} // if you have speakerImage; otherwise pass empty string
                            debateId={debate.documentId}
                            topics={debate.topics}
                            content={debate.top_speech.content}
                            session_date={debate.session_date}
                            date={debate.date}
                            session={debate.session}
                            period={debate.period}
                            meeting={debate.meeting}
                          />
                        ) : (
                          <DebateBig
                            key={index}
                            documentId={debate.documentId}
                            session_date={debate.session_date}
                            date={debate.date}
                            topics={debate.topics}
                            session={debate.session}
                            period={debate.period}
                            meeting={debate.meeting}
                            content={null} // or you can pass undefined if DebateBig expects it
                            speaker_name={null}
                          />
                        )
                      ))}
                  </div>


                  {cachedDebates.length > 0 && (
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                          className="bg-[#1E1F23] text-white px-4 py-2 rounded-md disabled:opacity-50"
                          onClick={() => setPage(Math.max(page - 1, 1))}
                          disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span className="text-white font-bold px-4 py-2">
                Page {page} of {totalPages}
              </span>

                        <button
                          className="bg-[#1E1F23] text-white px-4 py-2 rounded-md disabled:opacity-50"
                          onClick={() => setPage(page + 1)}
                          disabled={page >= totalPages}
                        >
                            Next
                        </button>
                    </div>
                  )}

                  {cachedDebates.length === 0 && (
                    <div className="mt-20">
                        <p className="font-bold">The current filters applied return no results.</p>
                    </div>
                  )}
              </div>
          </div>
      </div>
    );
}
