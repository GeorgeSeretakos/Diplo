'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import axios from 'axios';
import NavigationBar from "@components/Navigation/NavigationBar";
import { getImageUrl } from "@utils/getImageUrl";

import TopicFilter from "@components/Filters/TopicFilter.js";
import SentimentFilter from "@components/Filters/SentimentFilter.js";
import DateRangeFilter from "@components/Filters/DateRangeFilter.js";
import SessionFilter from "@components/Filters/SessionFilter.js";
import styles from "../../../search-debates/SearchDebates.module.css";
import DebateBig from "../../../components/Debate/DebateBig/DebateBig.js";

export default function DebateContentPage() {
  const { id: speakerDocumentId } = useParams();

  const [debates, setDebates] = useState([]);
  const [title, setTitle] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const [inputValues, setInputValues] = useState({
    keyPhrase: "",
    startDate: "",
    endDate: "",
    session: "",
    meeting: "",
    period: "",
    topics: [],
    sentiments: [],
  });
  const [sortBy, setSortBy] = useState("newest");


  const handleInputChange = (name, value) => {
    setPage(1);
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchSpeakerDebates = async () => {
      try {
        setLoading(true);

        const endpoint = "/api/search-speaker-speeches";
        const body = {
          speakerId: speakerDocumentId,
          keyPhrase: inputValues.keyPhrase,
          strapiFilters: {
            startDate: inputValues.startDate,
            endDate: inputValues.endDate,
            session: inputValues.session,
            meeting: inputValues.meeting,
            period: inputValues.period,
            topics: inputValues.topics,
            sentiments: inputValues.sentiments,
          },
        };

        const response = await axios.post(endpoint, body);
        console.log("Fetched Debates:", response.data);

        setDebates(response.data.debates || []);

        if(response.data.debates?.length > 0) {
          const speakerName = response.data.debates[0]?.top_speech?.speaker_name || '';
          setTitle(speakerName)
        }
      } catch (error) {
        console.error("Error fetching speaker debates:", error);
      } finally {
        setLoading(false);
      }
    };

    if (speakerDocumentId) {
      fetchSpeakerDebates();
    }
  }, [inputValues, speakerDocumentId]);

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white">
      {/* Navigation */}
      <NavigationBar
        title={title}
        showSearch={true}
        placeholder="Enter a keyphrase ..."
        onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
        showSortBy={true}
        // sortBy={}
      />

      {/* Main Layout */}
      <div className="flex text-white w-full pt-8 relative z-10">
        {/* Filters Section */}
        <div className="mb-6 px-8 w-2/5">
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

          <SentimentFilter
            selectedSentiments={inputValues.sentiments}
            onFilterChange={(updatedSentiments) => handleInputChange("sentiments", updatedSentiments)}
            disabled={inputValues.keyPhrase.trim() === "" && inputValues.topics.length === 0}
          />
        </div>

        {/* Debates Section */}
        <div className="flex flex-col items-center justify-start w-full space-y-6">
          <div className="text-center text-3xl font-bold mb-6">
            <h1>
              Debates of {title} ({debates ? debates.length : 0})
            </h1>
          </div>

          <div className={styles.debateGrid}>
            {Array.isArray(debates) && debates.length > 0 ? (
              debates.map((debate, index) => (
                <DebateBig
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
              ))
            ) : !loading && (
              <div className="text-center text-xl py-10">
                No debates found.
              </div>
            )}
          </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin"></div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
