'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "next/navigation";
import axios from 'axios';
import NavigationBar from "@components/Navigation/NavigationBar";
import { getImageUrl } from "@utils/getImageUrl";
import SentimentFilter from "@components/Filters/SentimentFilter.js";
import SpeakerCircle from "@components/Speaker/SpeakerCircle/SpeakerCircle.js";
import SpeakerOptionsFilter from "@components/Filters/SpeakerOptionsFilter.js";
import RhetoricalIntentFilter from "@components/Filters/RhetoricalIntentFilter.js";
import HighIntensityFilter from "@components/Filters/HighIntensityFilter.js";

export default function DebateContentPage() {
  const { id: documentId } = useParams();
  const [speeches, setSpeeches] = useState([]);
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const [showFilters, setShowFilters] = useState(true);

  const [matchSpeechIds, setMatchSpeechIds] = useState([]);

  const [inputValues, setInputValues] = useState({
    keyPhrase: "",
    speakers: [],
    rhetoricalIntent: "",
    sentiment: "",
    highIntensity: false
  });

  const limit = 10;

  useEffect(() => {
    async function fetchInitialSpeeches() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/debates/content/${documentId}`, {
          params: { page: 1, limit }
        });

        const initialSpeeches = response.data.data.debate.speeches;
        const fetchedTitle = response.data.data.debate.title;

        setSpeeches(initialSpeeches);
        setTitle(fetchedTitle);
        setCurrentPage(1);

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


  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    async function loadMoreSpeeches() {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const nextPage = currentPage + 1;
        const response = await axios.get(`/api/debates/content/${documentId}`, {
          params: { page: nextPage, limit }
        });

        const newSpeeches = response.data.data.debate.speeches;

        if (newSpeeches.length > 0) {
          setSpeeches((prev) => [...prev, ...newSpeeches]);
          setCurrentPage(nextPage);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching more speeches:", error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMoreSpeeches();
      }
    }, { threshold: 0.8 });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, currentPage, documentId]);


  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const hasActiveFilters =
        inputValues.keyPhrase.trim() !== "" ||
        inputValues.speakers.length > 0 ||
        inputValues.sentiment.trim() !== "" ||
        inputValues.rhetoricalIntent.trim() !== "" ||
        inputValues.highIntensity !== null;

      if (!hasActiveFilters) {
        setMatchSpeechIds([]);
        return;
      }

      try {
        const res = await axios.post("/api/search-in-debate", {
          debateId: documentId,
          keyPhrase: inputValues.keyPhrase,
          speakers: inputValues.speakers,
          sentiment: inputValues.sentiment,
          rhetoricalIntent: inputValues.rhetoricalIntent,
          highIntensity: inputValues.highIntensity
        });

        const matches = res.data.speeches;
        setMatchSpeechIds(matches.map((s) => s.id));
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 1500); // debounce 1.5s

    return () => clearTimeout(delayDebounce);
  }, [inputValues, documentId]);


  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <div className="relative min-h-screen w-full bg-transparent text-white">
      <NavigationBar
        title={title}
        showSearch={true}
        placeholder="Λέξη / φράση-κλειδί ..."
        onFilterChange={(updatedValue) => handleInputChange("keyPhrase", updatedValue)}
      />

      {!showFilters && (
        <div className="fixed bottom-[2rem] left-6 z-50">
          <button onClick={() => setShowFilters(true)} className="button bg-white">→</button>
        </div>
      )}

      <div className="flex text-white w-full m-auto pt-[2rem] relative z-10">
        {showFilters && (
          <div className="mb-6 px-8 w-1/3 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Φίλτρα</h1>
              <button onClick={() => setShowFilters(false)} className="button">Απόκρυψη</button>
            </div>

            <div className="border-b border-gray-400 pb-4 mb-4">
              <SpeakerOptionsFilter
                selectedValues={inputValues.speakers}
                onChange={(updatedSelection) => handleInputChange("speakers", updatedSelection)}
                placeholder="Search and select speakers..."
                debateId={documentId}
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
        )}

        <div
          className={`flex flex-col items-center justify-start ${showFilters ? 'w-2/3' : 'w-full'} space-y-6 transition-all duration-300`}>
          <div className="text-center text-3xl font-bold mb-6">
            <h1>Περιεχόμενο Ομιλιών</h1>
          </div>

          {speeches
            .filter((speech, index, self) =>
              index === self.findIndex((s) => s.speech_id === speech.speech_id)
            )
            .map((speech) => {
              const isMatch = matchSpeechIds.includes(speech.speech_id);

              return (
                <div key={speech.speech_id} id={`speech-${speech.speech_number}`}
                     className="flex w-full justify-start px-6 pb-6">
                  <div className="w-[200px] flex flex-col items-center justify-start text-center space-y-2">
                    <SpeakerCircle
                      speakerName={speech.speaker_name}
                      documentId={speech.speaker?.documentId}
                      imageUrl={getImageUrl(speech.speaker?.image)}
                    />
                  </div>
                  <div className={`flex-1 p-6 backdrop-blur rounded-3xl shadow-2xl border-2 transition-all duration-300 ${
                    isMatch ? "bg-gray-800" : "bg-white/10 border-white/30"
                  }`}>
                    {speech.content.map((paragraph, index) => (
                      <p key={index} className="mb-4 text-justify leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>
              );
            })}

          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin"></div>
            </div>
          )}

          {hasMore && <div ref={observerRef} className="h-10"></div>}
        </div>
      </div>
    </div>
  );
}