"use client";

import React, {useEffect, useState} from "react";
import DebateBig from "../../../Debate/DebateBig/DebateBig";
import SearchSection from "@components/Navigation/TopBarSearch";
import axios from "axios";
import SideBar from "@components/Navigation/Sidebar";
import styles from "./SpeakerSearch.module.css";
import TopicFilter from "../../../Filters/TopicFilter/TopicFilter.js";
import DateRangeFilter from "../../../Filters/DateRangeFilter/DateRangeFilter.js";
import PhraseFilter from "../../../Filters/PhraseFilter/PhraseFilter.js";
import {constants} from "../../../../../../constants/constants.js";


export default function SpeakerSearch({documentId}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [debates, setDebates] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
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

  const STRAPI_URL = constants.STRAPI_URL;
  const API_TOKEN = constants.API_TOKEN;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // useEffect(() => {
  //   const searchSpeakerDebates = async () => {
  //     try {
  //       const endpoint = "http://localhost:3000/api/search-debates";
  //       const body = { ...inputValues, sortBy, page, limit };
  //
  //       const response = await axios.post(endpoint, body);
  //       console.log("Search API Response: ", response);
  //
  //       setDebates(response.data.debates);
  //       setTotalPages(response.data.totalPages);
  //     } catch (error) {
  //       console.error("Error fetching all debates:", error);
  //     }
  //   };
  //   searchSpeakerDebates();
  // }, [inputValues, sortBy, page]);


  useEffect(() => {
    const fetchSpeakerDebates = async () => {
      try {
        const response = await axios.get(
          `${STRAPI_URL}/api/debates?filters[speakers][documentId][$eq]=${documentId}&populate=topics`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        setDebates(response.data.data);

        console.log("Response: ", response);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchSpeakerDebates();
  }, []);

  const handleInputChange = (name, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  console.log("Input Values: ", inputValues);
  console.log("Debates: ", debates);
  console.log("Total Pages: ", totalPages);

  return (
    <div className="bg-[rgba(244, 242, 234, 0.8)] text-black">
      <div className={styles.backgroundContainer}></div>

      <div className="flex fixed bg-[#1E1F23] top-0 w-full items-center border-b-2 m-auto z-50">
        <div className="text-white flex justify-center w-[30%] font-bold">
          <SideBar />
        </div>
        <div className="w-[70%] pr-8 pl-8 flex justify-center">
          <SearchSection
            onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
            setSortBy={setSortBy}
            setPage={setPage}
            placeholder="Enter key phrase ..."
          />
        </div>
      </div>


      <div className="flex text-white w-[100%] m-auto pt-[2rem] relative z-10">
        <div className={` space-y-6 p-10 rounded-br-2xl h-fit w-[30%] min-h-[100vh] ${isDropdownOpen ? 'h-auto' : ''}`}>

          <div className="text-center text-3xl font-bold mb-6">
            <h1>Filters</h1>
          </div>

          <DateRangeFilter
            startDate={inputValues.startDate}
            endDate={inputValues.endDate}
            handleInputChange={handleInputChange}
          />

          <TopicFilter
            selectedTopics={inputValues.topics}
            onFilterChange={(updatedSelection) => handleInputChange("topics", updatedSelection)}
          />

          <PhraseFilter
            phrase={inputValues.keyPhrase}
            onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
          />

        </div>

        {/* Debates List */}
        <div className="w-[70%] flex flex-col items-center p-10 space-y-6">
          <div className="text-center text-3xl font-bold">
            <h1>Debates of ΓΕΩΡΓΙΟΣ ΜΑΥΡΑΓΑΝΗΣ</h1>
          </div>
          <div className={styles.debateGrid}>
            {debates.map((debate, index) => (
              <DebateBig
                key={index}
                documentId={debate.documentId}
                session_date={debate.session_date}
                date={debate.date}
                topics={debate.topics}
                session={debate.session}
                period={debate.period}
                meeting={debate.meeting}
                // score={debate.top_speech?.score}
                content={debate.top_speech?.content}
                speaker_name={debate.top_speech?.speaker_name}
              />
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
