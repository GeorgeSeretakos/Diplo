"use client";

import React, {useEffect, useState} from "react";
import DebateBig from "../components/Debate/DebateBig/DebateBig";
import SearchSection from "@components/Navigation/TopBarSearch";
import axios from "axios";
import SideBar from "@components/Navigation/Sidebar";
import styles from "./searchSpeakers.module.css";
import SpeakerCard from "@components/Speaker/SpeakerCard/SpeakerCard.js";
import PartyFilter from "../components/Filters/PartyFilter/PartyFilter.js";
import TopicFilter from "../components/Filters/TopicFilter/TopicFilter.js";
import AgeFilter from "../components/Filters/AgeFilter/AgeFilter.js";
import GenderFilter from "../components/Filters/GenderFilter/GenderFilter.js";
import PhraseFilter from "../components/Filters/PhraseFilter/PhraseFilter.js";
import {constants} from "../../../constants/constants.js";


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
    parties: []
  });

  const STRAPI_URL = constants.STRAPI_URL;

  useEffect(() => {
    const searchSpeakers = async () => {
      try {
        // const endpoint = "http://localhost:3000/api/search-speakers";
        const endpoint = "http://localhost:1338/api/speakers?populate=image";
        // const body = { ...inputValues, sortBy, page, limit };

        // const response = await axios.post(endpoint, body);
        const response = await axios.get(endpoint);
        console.log("Search API Response: ", response);

        setSpeakers(response.data.data);
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching all speakers:", error);
      }
    };
    searchSpeakers();
  }, [inputValues, sortBy, page]);

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

      <div className="flex fixed bg-[#1E1F23] top-0 w-full items-center border-b-2 m-auto z-50">
        <div className="text-white flex justify-center w-[30%] font-bold">
          <SideBar />
        </div>
        <div className="w-[70%] pr-8 pl-8 flex justify-center">
          <SearchSection
            onFilterChange={(updatedValue) => handleInputChange("speakerName", updatedValue)}
            setSortBy={setSortBy}
            setPage={setPage}
            placeholder="Enter speaker name ..."
          />
        </div>
      </div>


      <div className="flex text-white w-[100%] m-auto pt-[2rem] relative z-10">

        <div className={` space-y-6 p-10 rounded-br-2xl h-fit w-[40%] min-h-[100vh] ${isDropdownOpen ? 'h-auto' : ''}`}>

          <div className="mb-6">
            <div className="text-center text-3xl font-bold mb-6">
              <h1>Filters</h1>
            </div>

            <PartyFilter
              selectedParties={inputValues.parties}
              onFilterChange={(updatedSelection) => handleInputChange("parties", updatedSelection)}
            />

            <PhraseFilter
              selectedPhrase={inputValues.keyPhrase}
              onFilterChange={(updatedPhrase) => handleInputChange("keyPhrase", updatedPhrase)}
            />

            <TopicFilter
              selectedTopics={inputValues.topics}
              onFilterChange={(updatedSelection) => handleInputChange("topics", updatedSelection)}
            />

            {isClient && <AgeFilter
              selectedAgeRange={inputValues.ageRange}
              onFilterChange={(updatedRange) => handleInputChange("ageRange", updatedRange)}
            />}

            <GenderFilter
              selectedGender={inputValues.gender}
              onFilterChange={(updatedValue) => handleInputChange("gender", updatedValue)}
            />

          </div>
        </div>

        {/* Debates List */}
        <div className="w-[60%] flex flex-col items-center p-10 space-y-6">
          <div className="text-center text-3xl font-bold mb-6">
            <h1>Speakers</h1>
          </div>
          <div className={styles.speakerGrid}>
            {speakers.map((speaker, index) => {
              const speakerImage = speaker.image?.formats?.large?.url
                ? `${STRAPI_URL}${speaker.image.formats.large.url}`
                : speaker.image?.url
                  ? `${STRAPI_URL}${speaker.image.url}`
                  : "/images/politicians/default.avif";

              return (
                <SpeakerCard
                  key={index}
                  documentId={speaker.documentId}
                  image={speakerImage}
                  name={speaker.speaker_name}
                />
              );
            })}
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

                {/* Page Info */}
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
