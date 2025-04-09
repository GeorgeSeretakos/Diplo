import React, { useState } from "react";
import SpeakerCircle from "@components/Speaker/SpeakerCircle/SpeakerCircle.js";

const SpeakerNavigation = ({ speakerName, imageUrl, onTabChange }) => {
  const [activeTab, setActiveTab] = useState("bio");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex items-center justify-between bg-[#1E1F23] border-0 px-8 py-4 w-full border-white">
      {/* Speaker Header */}
      <div className="flex items-center space-x-4">
        {/*{imageUrl && (*/}
        {/*  <SpeakerCircle name={speakerName} photo={imageUrl} style={{ width: "2.5rem", height: "2.5rem", padding: "0" }} />*/}
        {/*)}*/}
        {speakerName && <h1 className="text-white text-2xl font-bold">{speakerName}</h1>}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-6 ml-auto"> {/* ✅ Pushed to the right */}
        <button
          // className={`text-lg font-bold px-4 py-2 transition duration-300 ${
          //   activeTab === "bio" ? "text-[#f9d342] border-b-2 border-[#f9d342]" : "text-white hover:text-[#f9d342]"
          // }`}
          className="button"
          onClick={() => handleTabClick("bio")}
        >
          Speaker Bio
        </button>
        <button
          // className={`text-lg font-bold px-4 py-2 transition duration-300 ${
          //   activeTab === "search" ? "text-[#f9d342] border-b-2 border-[#f9d342]" : "text-white hover:text-[#f9d342]"
          // }`}
          className="button"
          onClick={() => handleTabClick("search")}
        >
          Speaker Debates
        </button>
      </div>
    </div>
  );
};

export default SpeakerNavigation;
