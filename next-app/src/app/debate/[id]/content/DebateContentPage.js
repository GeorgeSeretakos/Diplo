'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "next/navigation";
import axios from 'axios';
import NavigationBar from "@components/Navigation/NavigationBar";
import { getImageUrl } from "@utils/getImageUrl";

import PartyFilter from "@components/Filters/PartyFilter.js";
import TopicFilter from "@components/Filters/TopicFilter.js";
import NameFilter from "@components/Filters/NameFilter.js";
import SentimentFilter from "@components/Filters/SentimentFilter.js";
import SpeakerCircle from "../../../components/Speaker/SpeakerCircle/SpeakerCircle.js";

export default function DebateContentPage() {
  const { id: documentId } = useParams();
  const [speeches, setSpeeches] = useState([]);
  const [title, setTitle] = useState('');
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const limit = 10;
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
    setIsClient(true);
  }, []);

  // Fetch first speeches
  useEffect(() => {
    async function fetchInitialSpeeches() {
      setLoading(true);

      try {
        const response = await axios.get(`/api/strapi/debates/content/${documentId}`, {
          params: { page: 1, limit }
        });

        const initialSpeeches = response.data.data.debate.speeches;
        const fetchedTitle = response.data.data.debate.title;

        setSpeeches(initialSpeeches);
        setTitle(fetchedTitle);

        if (initialSpeeches.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching initial speeches:", error);
      } finally {
        setLoading(false);
      }
    }

    if (documentId) {
      fetchInitialSpeeches();
    }
  }, [documentId]);

  // Load more speeches on scroll
  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMoreSpeeches();
      }
    }, { threshold: 0.8 });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  async function loadMoreSpeeches() {
    setLoading(true);

    try {
      const nextPage = Math.floor(speeches.length / limit) + 1;
      const response = await axios.get(`/api/strapi/debates/content/${documentId}`, {
        params: { page: nextPage, limit }
      });

      const newSpeeches = response.data.data.debate.speeches;

      if (newSpeeches.length > 0) {
        setSpeeches((prev) => [...prev, ...newSpeeches]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more speeches:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white">

      {/* Navigation */}
      <NavigationBar title={title} showSearch={true} placeholder="Enter a keyphrase ..." />

      {/* Main Layout */}
      <div className="flex text-white w-[100%] m-auto pt-[2rem] relative z-10">
        {/* Filters Section */}
        <div className="mb-6 px-8 w-1/4">
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

        {/* Speeches */}
        <div className="flex flex-col items-center justify-start w-full space-y-6">
          <div className="text-center text-3xl font-bold mb-6">
            <h1>Debate Content</h1>
          </div>

          {speeches.map((speech) => {
            return (
              <div key={speech.speech_id} className="flex w-full justify-start px-6 pb-6">

                {/* Speaker Column */}
                <div className="w-[200px] flex flex-col items-center justify-start text-center space-y-2">
                  <SpeakerCircle
                    speakerName={speech.speaker_name}
                    documentId={speech.speakers[0]?.documentId}
                    imageUrl={getImageUrl(speech.speakers[0]?.image)}
                  />
                </div>

                {/* Speech Text Column */}
                <div className="flex-1 p-6 bg-none bg-opacity-70 rounded-3xl shadow-2xl border-2">
                  {speech.content.paragraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-justify leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

            );
          })}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin"></div>
            </div>
          )}

          {/* Intersection Observer trigger */}
          {hasMore && <div ref={observerRef} className="h-10"></div>}
        </div>
      </div>
    </div>
  );
}
