"use client";

import React, {useEffect, useState} from "react";
import axios from "axios";
import styles from "./searchSpeakers.module.css";
import {getImageUrl} from "@utils/getImageUrl.js";

import PartyFilter from "@components/Filters/PartyFilter.js";
import AgeFilter from "@components/Filters/AgeFilter.js";
import GenderFilter from "@components/Filters/GenderFilter.js";
import NameFilter from "@components/Filters/NameFilter.js";
import SentimentFilter from "@components/Filters/SentimentFilter.js";

import SpeakerCard from "@components/Speaker/SpeakerCard/SpeakerCard.js";
import NavigationBar from "@components/Navigation/NavigationBar.js";
import SpeakerDebate from "@components/SpeakerDebate/SpeakerDebate.js";
import HighIntensityFilter from "@components/Filters/HighIntensityFilter.js";
import RhetoricalIntentFilter from "@components/Filters/RhetoricalIntentFilter.js";


export default function SpeakerSearch() {
  const [isClient, setIsClient] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);
  const [totalSpeakers, setTotalSpeakers] = useState(0);

  const [inputValues, setInputValues] = useState({
    ageRange: { min: 18, max: 100},
    gender: "",
    keyPhrase: "",
    topics: [],
    speakerName: "",
    parties: [],
    rhetoricalIntent: "",
    sentiment: "",
    highIntensity: false
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const searchSpeakers = async () => {
        try {
          setLoading(true);
          setSpeakers(null); // Hide the previous results
          setTotalSpeakers(0);
          setTotalPages(1);

          const endpoint = `/api/search-speakers`;

          const body = {
            keyPhrase: inputValues.keyPhrase,
            sentiment: inputValues.sentiment,
            rhetoricalIntent: inputValues.rhetoricalIntent,
            highIntensity: inputValues.highIntensity,
            speakerName: inputValues.speakerName,
            ageRange: inputValues.ageRange,
            gender: inputValues.gender,
            parties: inputValues.parties,
            page,
            sortBy
          };

          const response = await axios.post(endpoint, body);
          setSpeakers(response.data.result);
          setTotalPages(response.data.totalPages);
          setTotalSpeakers(response.data.totalSpeakers);
          setIsFirstLoadDone(true);
        } catch (error) {
          console.error("Error fetching speakers:", error);
        } finally {
          setLoading(false);
        }
      };

      searchSpeakers();
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timeoutId); // cancel if input changes again
  }, [inputValues, page, sortBy]);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);


  const handleInputChange = (name, value) => {
    setPage(1);
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="bg-[rgba(244, 242, 234, 0.8)] text-black">
      <div className={styles.backgroundContainer}></div>

      <NavigationBar
        title="Αναζήτηση Ομιλητών"
        showSearch={true}
        placeholder="Λέξη / φράση-κλειδί (αναζητούμε από ποιούς ειπώθηκε)"
        onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
        setSortBy={setSortBy}
        setPage={setPage}
      />

      <div className="flex text-white w-[100%] m-auto mt-[6rem] relative z-10">

        <div className="space-y-6 p-10 rounded-br-2xl h-fit w-[40%] min-h-[100vh]">

          {/* Filters Section */}
          <div className="mb-6">
            <div className="text-center text-3xl font-bold mb-6">
              <h1>Φίλτρα Αναζήτησης</h1>
            </div>

            <div className="border-b border-gray-400 pb-4 mb-4">
              <NameFilter
                selectedName={inputValues.speakerName}
                onFilterChange={(updatedName) => handleInputChange("speakerName", updatedName)}
              />
            </div>

            <div className="border-b border-gray-400 pb-4 mb-4">
              <PartyFilter
                selectedParties={inputValues.parties}
                onFilterChange={(updatedSelection) => handleInputChange("parties", updatedSelection)}
              />
            </div>

            <div className="border-b border-gray-400 pb-4 mb-4">
              <GenderFilter
                selectedGender={inputValues.gender}
                onFilterChange={(updatedValue) => handleInputChange("gender", updatedValue)}
              />
            </div>

            {isClient &&
              <div className="border-b border-gray-400 pb-4 mb-4">
                <AgeFilter
                  selectedAgeRange={inputValues.ageRange}
                  onFilterChange={(updatedRange) => handleInputChange("ageRange", updatedRange)}
                />
              </div>
            }

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
        </div>


        <div className="w-[60%] flex flex-col items-center p-10 space-y-6">
          <div className="text-center text-3xl font-bold mb-6">
            <h1>Ομιλητές ({totalSpeakers})</h1>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && Array.isArray(speakers) && speakers.length > 0 && (
            <div className={styles.speakerGrid}>
              {speakers.map((speaker, index) =>
                speaker.top_speech ? (
                  <SpeakerDebate
                    key={index}
                    speakerId={speaker.documentId}
                    speakerName={speaker.speaker_name}
                    speakerImage={getImageUrl(speaker?.imageUrl)}
                    debateId={speaker.debate.documentId}
                    content={speaker.top_speech.content}
                    date={speaker.debate.date}
                    session={speaker.debate.session}
                    period={speaker.debate.period}
                  />
                ) : (
                  <SpeakerCard
                    key={index}
                    documentId={speaker.documentId}
                    image={getImageUrl(speaker?.imageUrl)}
                    name={speaker.speaker_name}
                  />
                )
              )}
            </div>
          )}

          {totalSpeakers > 0 && (
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  className="bg-[#1E1F23] text-white px-4 py-2 rounded-md disabled:opacity-50"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>

                <span className="text-white font-bold px-4 py-2">
                  Page {page} of {totalPages}
                </span>

                <button
                  className="bg-[#1E1F23] text-white px-4 py-2 rounded-md disabled:opacity-50"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            )
          }

          {/* No Results Message (only after loading and after at least one real search) */}
          {!loading && isFirstLoadDone && Array.isArray(speakers) && speakers.length === 0 && (
            <div className="flex flex-col justify-center items-center h-[60vh] px-6 text-center">
              <p className="font-bold text-gray-300 text-base max-w-xl">
                Τα φίλτρα με τα οποία αναζητήσατε δεν επέστρεψαν αποτελέσματα.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
