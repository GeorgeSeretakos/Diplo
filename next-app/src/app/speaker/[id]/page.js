"use client";

import React, {useEffect, useState} from "react";
import SearchSection from "@components/Navigation/TopBarSearch";
import axios from "axios";
import SideBar from "@components/Navigation/SideBar";
import styles from "./speaker.module.css";
import SpeakerCard from "@components/Speaker/SpeakerCard/SpeakerCard.js";
import {constants} from "../../../../constants/constants.js";
import SpeakerBio from "@components/Speaker/SpeakerBio/[id]/SpeakerBio.js";
import {useParams} from "next/navigation.js";
import SpeakerSearch from "../../components/Speaker/SpeakerSearch/[id]/SpeakerSearch.js";
import TopBarSearch from "../../components/Navigation/TopBarSearch.js";
import SpeakerNavigation from "../../components/Navigation/SpeakerNavigation.js";


export default function DebateSearch() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("bio");
  const [inputValues, setInputValues] = useState({
    ageRange: { min: 18, max: 100},
    gender: "",
    keyPhrase: "",
    topics: [],
    speakerName: "",
    parties: []
  });

  const { id: documentId } = useParams();

  console.log("DocumentId:", documentId);

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
          {/*<TopBarSearch*/}
          {/*  onFilterChange={(updatedValue) => handleInputChange("speakerName", updatedValue)}*/}
          {/*  setSortBy={setSortBy}*/}
          {/*  setPage={setPage}*/}
          {/*  placeholder="Enter speaker name ..."*/}
          {/*/>*/}
          <SpeakerNavigation
            // speakerName="ΣΤΕΛΙΟΣ ΚΑΤΣΗΣ"
            imageUrl="http://localhost:1338/uploads/image_e3d86dda2e.jpeg"
            onTabChange={setActiveTab}
          />
        </div>
      </div>


      <div className="flex text-white w-[100%] m-auto pt-[2rem] relative z-10">
        {activeTab === "bio" && <SpeakerBio documentId={documentId} />}
        {activeTab === "search" && <SpeakerSearch speakerId={documentId}/> }
          {/*// <div className="mt-12">*/}
            {/*<div className="text-center text-3xl font-bold">*/}
            {/*  <h1>Search Debates of ΣΤΕΛΙΟΣ ΚΑΤΣΗΣ</h1>*/}
            {/*</div>*/}
      </div>
    </div>
  );
}
