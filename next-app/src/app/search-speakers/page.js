"use client";

import React, {useEffect, useState} from "react";
import axios from "axios";
import styles from "./searchSpeakers.module.css";
import {getImageUrl} from "@utils/getImageUrl.js";

import PartyFilter from "@components/Filters/PartyFilter.js";
import TopicFilter from "@components/Filters/TopicFilter.js";
import AgeFilter from "@components/Filters/AgeFilter.js";
import GenderFilter from "@components/Filters/GenderFilter.js";
import NameFilter from "@components/Filters/NameFilter.js";
import SentimentFilter from "@components/Filters/SentimentFilter.js";

import SpeakerCard from "@components/Speaker/SpeakerCard/SpeakerCard.js";
import NavigationBar from "@components/Navigation/NavigationBar.js";
import SpeakerDebate from "../components/SpeakerDebate/SpeakerDebate.js";


export default function DebateSearch() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValues, setInputValues] = useState({
    ageRange: { min: 18, max: 100},
    gender: "",
    keyPhrase: "",
    topics: [],
    speakerName: "",
    parties: [],
    sentiments: []
  });

  useEffect(() => {
    const searchSpeakers = async () => {
      try {
        const endpoint = "http://localhost:3000/api/search-speakers";

        const body = {
          keyPhrase: inputValues.keyPhrase,
          strapiFilters: {
            speakerName: inputValues.speakerName,
            ageRange: inputValues.ageRange,
            gender: inputValues.gender,
            parties: inputValues.parties,
          },
        };

        const response = await axios.post(endpoint, body);
        console.log("Search API Response: ", response.data);

        setSpeakers(response.data.result); // ✅ corrected
        setTotalPages(response.data.totalPages); // ✅ corrected
        setPage(1); // ⚡ Optional: Reset to first page when filters change
      } catch (error) {
        console.error("Error fetching speakers:", error);
      }
    };

    searchSpeakers();
  }, [inputValues, sortBy]);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (name, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  console.log("Input Values: ", inputValues);
  console.log("Speakers: ", speakers);
  console.log("Total Pages: ". totalPages);


  return (
    <div className="bg-[rgba(244, 242, 234, 0.8)] text-black">
      <div className={styles.backgroundContainer}></div>;

      <NavigationBar
        title="Search Speakers"
        showSearch={true}
        placeholder="Enter key phrase..."
        onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
        setSortBy={setSortBy}
        setPage={setPage}
      />


      <div className="flex text-white w-[100%] m-auto pt-[2rem] relative z-10">

        <div className={` space-y-6 p-10 rounded-br-2xl h-fit w-[40%] min-h-[100vh] ${isDropdownOpen ? 'h-auto' : ''}`}>

          {/* Filters Section */}
          <div className="mb-6">
            <div className="text-center text-3xl font-bold mb-6">
              <h1>Filters</h1>
            </div>

            <NameFilter
              selectedName={inputValues.speakerName}
              onFilterChange={(updatedName) => handleInputChange("speakerName", updatedName)}
            />

            <PartyFilter
              selectedParties={inputValues.parties}
              onFilterChange={(updatedSelection) => handleInputChange("parties", updatedSelection)}
            />

            <GenderFilter
              selectedGender={inputValues.gender}
              onFilterChange={(updatedValue) => handleInputChange("gender", updatedValue)}
            />

            <TopicFilter
              selectedTopics={inputValues.topics}
              onFilterChange={(updatedSelection) => handleInputChange("topics", updatedSelection)}
            />

            {isClient && <AgeFilter
              selectedAgeRange={inputValues.ageRange}
              onFilterChange={(updatedRange) => handleInputChange("ageRange", updatedRange)}
            />}

            <SentimentFilter
              selectedSentiments={inputValues.sentiments}
              onFilterChange={(updatedSentiments) => handleInputChange("sentiments", updatedSentiments)}
              disabled={inputValues.keyPhrase.trim() === "" && inputValues.topics.length === 0}
            />

          </div>
        </div>

        {/* Debates List */}
        <div className="w-[60%] flex flex-col items-center p-10 space-y-6">
          <div className="text-center text-3xl font-bold mb-6">
            <h1>Speakers</h1>
          </div>
          <div className={styles.speakerGrid}>
            {Array.isArray(speakers) && speakers.length > 0 && speakers.map((speaker, index) => (
              speaker.top_speech ? (
                <SpeakerDebate
                  key={index}
                  speakerId={speaker.documentId}
                  speakerName={speaker.speaker_name}
                  speakerImage={getImageUrl(speaker.image)} // if you have speakerImage; otherwise pass empty string
                  debateId={speaker.debate.documentId}
                  topics={speaker.debate.topics}
                  content={speaker.top_speech.content}
                  session_date={speaker.debate.session_date}
                  date={speaker.debate.date}
                  session={speaker.debate.session}
                  period={speaker.debate.period}
                  meeting={speaker.debate.meeting}
                />
              ) : (
                <SpeakerCard
                  key={index}
                  documentId={speaker.documentId}
                  image={getImageUrl(speaker.image)}
                  name={speaker.speaker_name}
                />
              )
            ))}
          </div>

          {totalPages > 0 ? (
              <div className="flex justify-center mt-6 space-x-4">
                {/* Previous Button */}
                <button
                  className="bg-[#1E1F23] text-white px-4 py-2 rounded-md disabled:opacity-50"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>

                {/* SpeakerSpeechesPage Info */}
                <span className="text-white font-bold px-4 py-2">Page {page} of {totalPages}</span>

                {/* Next Button */}
                <button
                  className="bg-[#1E1F23] text-white px-4 py-2 rounded-md disabled:opacity-50"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            ) :
            <div className="mt-20">
              <p className="font-bold">No results found for you search</p>
            </div>
          }
        </div>
      </div>

    </div>
  );
}
