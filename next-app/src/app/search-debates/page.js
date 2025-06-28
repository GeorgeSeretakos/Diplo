"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash";

import DebateBig from "@components/Debate/DebateBig/DebateBig";
import NavigationBar from "@components/Navigation/NavigationBar.js";

import TopicFilter from "@components/Filters/TopicFilter.js";
import SessionFilter from "@components/Filters/SessionFilter.js";
import DateRangeFilter from "@components/Filters/DateRangeFilter.js";
import SpeakerOptionsFilter from "@components/Filters/SpeakerOptionsFilter.js";
import SpeakerDebate from "@components/SpeakerDebate/SpeakerDebate.js";

import styles from "./SearchDebates.module.css";

import {getImageUrl} from "@utils/getImageUrl.js";
import SentimentFilter from "@components/Filters/SentimentFilter.js";

export default function DebateSearch() {

    const [isClient, setIsClient] = useState(false);
    const [debates, setDebates] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);
    const [totalDebates, setTotalDebates] = useState(0);

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

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const fetchDebates = async () => {
                try {
                    setLoading(true);
                    setDebates(null);
                    setTotalDebates(0);
                    setTotalPages(1);

                    const endpoint = "/api/search-debates";
                    const body = {
                        page,
                        keyPhrase: inputValues.keyPhrase,
                        strapiFilters: {
                            startDate: inputValues.startDate,
                            endDate: inputValues.endDate,
                            session: inputValues.session,
                            meeting: inputValues.meeting,
                            period: inputValues.period,
                            topics: inputValues.topics,
                            speakers: inputValues.speakers,
                            sentiments: inputValues.sentiments
                        },
                        sortBy
                    };

                    const response = await axios.post(endpoint, body);
                    setDebates(response.data.debates);
                    setTotalPages(response.data.totalPages);
                    setTotalDebates(response.data.totalDebates);
                    setIsFirstLoadDone(true);
                } catch (error) {
                    console.error("Error fetching debates:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchDebates();
        }, 1000); // 1s debounce

        return () => clearTimeout(timeoutId);
    }, [inputValues, page, sortBy]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const handleInputChange = (name, value) => {
        setPage(1);
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    console.log("Debates returned: ", debates);

    return (
      <div className="bg-[rgba(244, 242, 234, 0.8)] text-black">
          <div className={styles.backgroundContainer}></div>

          <NavigationBar
            title="Αναζήτηση Πρακτικών"
            showSearch={true}
            placeholder="Λέξη / Φράση - κλειδί..."
            onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
            showSortBy={true}
            setSortBy={setSortBy}
            setPage={setPage}
          />


          {/* Main Layout */}
          <div className="flex text-white w-full m-auto mt-[6rem] relative z-10">
              {/* Filters Sidebar */}
              <div className="space-y-6 p-10 rounded-br-2xl h-fit w-[35%] min-h-[100vh]">
                  <div className="text-center text-3xl font-bold mb-14">
                      <h1>Φίλτρα Αναζήτησης</h1>
                  </div>

                  <div className="border-b border-gray-400 pb-4 mb-4">
                      <DateRangeFilter
                        startDate={inputValues.startDate}
                        endDate={inputValues.endDate}
                        handleInputChange={handleInputChange}
                      />
                  </div>

                  <div className="border-b border-gray-400 pb-4 mb-4">
                      <SessionFilter
                        session={inputValues.session}
                        period={inputValues.period}
                        meeting={inputValues.meeting}
                        handleInputChange={handleInputChange}
                      />
                  </div>

                  <div className="border-b border-gray-400 pb-4 mb-4">
                      <SpeakerOptionsFilter
                        selectedValues={inputValues.speakers}
                        onChange={(updatedSelection) => handleInputChange("speakers", updatedSelection)}
                        placeholder="Search and select speakers..."
                      />
                  </div>

                  <div className="border-b border-gray-400 pb-4 mb-4">
                      <TopicFilter
                        selectedTopics={inputValues.topics}
                        onFilterChange={(updatedSelection) => handleInputChange("topics", updatedSelection)}
                      />
                  </div>

                  <div>
                      <SentimentFilter
                        selectedSentiments={inputValues.sentiments}
                        onFilterChange={(updatedSentiments) => handleInputChange("sentiments", updatedSentiments)}
                        disabled={inputValues.keyPhrase.trim() === "" && inputValues.topics.length === 0}
                      />
                  </div>
              </div>


              <div className="w-[65%] flex flex-col items-center p-10 space-y-6">
                  <div className="text-center text-3xl font-bold">
                      <h1>Κοινοβουλευτικά Πρακτικά ({totalDebates})</h1>
                  </div>

                  {/* Loading Spinner */}
                  {loading && (
                    <div className="flex justify-center py-10">
                        <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!loading && Array.isArray(debates) && debates.length > 0 && (
                    <div className={styles.debateGrid}>
                      {debates.map((debate, index) => (
                        debate.top_speech ? (
                          <SpeakerDebate
                            key={index}
                            speakerId={debate.top_speech.speaker_id}
                            speakerName={debate.top_speech.speaker_name}
                            speakerImage={getImageUrl(debate.top_speech.imageUrl)}
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
                            content={null}
                            speaker_name={null}
                          />
                        )
                      ))}
                    </div>
                  )}

                  {totalDebates > 0 && (
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

                  {/* No Results Message (only after loading and after at least one real search) */}
                  {!loading && isFirstLoadDone && Array.isArray(debates) && debates.length === 0 && (
                    <div className="mt-20">
                        <p className="font-bold">Τα φίλτρα με τα οποία αναζητήσατε δεν επέστρεψαν αποτελέσματα.</p>
                    </div>
                  )}

              </div>

          </div>
      </div>
    );
}
