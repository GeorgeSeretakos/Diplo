'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import axios from 'axios';
import NavigationBar from "@components/Navigation/NavigationBar";

import SentimentFilter from "@components/Filters/SentimentFilter.js";
import DateRangeFilter from "@components/Filters/DateRangeFilter.js";
import SessionFilter from "@components/Filters/SessionFilter.js";
import styles from "../../../search-debates/SearchDebates.module.css";
import Debate from "@components/Debate/Debate.js";
import RhetoricalIntentFilter from "@components/Filters/RhetoricalIntentFilter.js";
import HighIntensityFilter from "@components/Filters/HighIntensityFilter.js";
import TopicFilter from "@components/Filters/TopicFilter.js";

export default function DebateContentPage() {
  const { id: speakerDocumentId } = useParams();

  const [debates, setDebates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDebates, setTotalDebates] = useState(0);
  const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const [title, setTitle] = useState('');

  const [inputValues, setInputValues] = useState({
    keyPhrase: "",
    startDate: "",
    endDate: "",
    session: "",
    topics: [],
    sentiment: "",
    rhetoricalIntent: "",
    highIntensity: false,
  });

  useEffect(() => {
    const fetchSpeakerDebates = async () => {
      try {
        setLoading(true);
        setDebates(null);
        setTotalDebates(0);
        setTotalPages(1);

        const endpoint = "/api/search-speaker-speeches";
        const body = {
          speakerId: speakerDocumentId,
          keyPhrase: inputValues.keyPhrase,
          startDate: inputValues.startDate,
          endDate: inputValues.endDate,
          session: inputValues.session,
          topics: inputValues.topics,
          sentiment: inputValues.sentiment,
          rhetoricalIntent: inputValues.rhetoricalIntent,
          highIntensity: inputValues.highIntensity,
          page,
          sortBy
        };

        const response = await axios.post(endpoint, body);
        console.log("Response: ", response.data);
        setDebates(response.data.debates || []);
        setTotalPages(response.data.totalPages);
        setTotalDebates(response.data.totalDebates);
        setIsFirstLoadDone(true);
        setTitle(response.data.speaker_name);

      } catch (error) {
        console.error("Error fetching speaker debates:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (speakerDocumentId) {
        fetchSpeakerDebates();
      }
    }, 1500); // debounce for 1.5 second

    return () => clearTimeout(timeoutId);
  }, [inputValues, page, sortBy, speakerDocumentId]);


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


  return (
    <div className="relative min-h-screen w-full bg-transparent text-white">
      {/* Navigation */}
      <NavigationBar
        title={title}
        showSearch={true}
        placeholder="Λέξη / Φράση - κλειδί..."
        onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
        showSortBy={true}
        setSortBy={setSortBy}
        setPage={setPage}
      />

      {/* Main Layout */}
      <div className="flex text-white w-full p-10 relative z-10">
        {/* Filters Section */}
        <div className="mb-6 px-8 w-[30%]">
          <div className="text-center text-3xl font-bold mb-16">
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
            <TopicFilter
              selectedTopics={inputValues.topics}
              onFilterChange={(updatedSelection) => handleInputChange("topics", updatedSelection)}
            />
          </div>

          <div className="border-b border-gray-400 pb-4 mb-4">
            <RhetoricalIntentFilter
              selectedRhetoricalIntent={inputValues.rhetoricalIntent}
              onFilterChange={(updatedSelection) => handleInputChange("rhetoricalIntent", updatedSelection)}
            />
          </div>

          <div className="border-b border-gray-400 pb-4 mb-4">
            <SentimentFilter
              selectedSentiment={inputValues.sentiment}
              onFilterChange={(updatedSelection) => handleInputChange("sentiment", updatedSelection)}
            />
          </div>

          <HighIntensityFilter
            selectedIntensity={inputValues.highIntensity}
            onFilterChange={(updatedSelection) => handleInputChange("highIntensity", updatedSelection)}
          />
        </div>

        {/* Debates Section */}
        <div className="flex flex-col items-center justify-start w-[70%] space-y-6">
          <div className="text-center text-3xl font-bold mb-6">
            <h1>
              Πρακτικά Ομιλητή: ({totalDebates})
            </h1>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && totalDebates > 0 && (
            <div className={styles.debateGrid}>
              {debates.map((debate, index) => (
                <Debate
                  key={index}
                  documentId={debate.documentId}
                  date={debate.date}
                  topics={debate.topics}
                  session={debate.session}
                  period={debate.period}
                  meeting={debate.meeting}
                  content={debate.top_speech?.content}
                  speaker_name={debate.top_speech?.speaker_name}
                />
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
