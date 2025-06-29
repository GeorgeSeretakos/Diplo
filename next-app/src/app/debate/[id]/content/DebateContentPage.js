'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "next/navigation";
import axios from 'axios';
import NavigationBar from "@components/Navigation/NavigationBar";
import { getImageUrl } from "@utils/getImageUrl";
import NameFilter from "@components/Filters/NameFilter.js";
import SentimentFilter from "@components/Filters/SentimentFilter.js";
import SpeakerCircle from "@components/Speaker/SpeakerCircle/SpeakerCircle.js";

export default function DebateContentPage() {
  const { id: documentId } = useParams();
  const [speeches, setSpeeches] = useState([]);
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedPages, setFetchedPages] = useState(new Set([1]));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const [showFilters, setShowFilters] = useState(true);

  const [matchSpeechNumbers, setMatchSpeechNumbers] = useState([]);
  const [matchSpeechIds, setMatchSpeechIds] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const [inputValues, setInputValues] = useState({
    ageRange: { min: 18, max: 100 },
    gender: "",
    keyPhrase: "",
    topics: [],
    speakerName: "",
    parties: [],
    sentiments: []
  });

  const limit = 10;

  function getPageForSpeechNumber(speechNumber) {
    return Math.ceil(speechNumber / limit);
  }

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
        setCurrentPage(1);
        setFetchedPages(new Set([1]));

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
    const targetSpeechNumber = matchSpeechNumbers[currentMatchIndex];
    if (!targetSpeechNumber) return;

    const targetPage = getPageForSpeechNumber(targetSpeechNumber);

    const scrollToTarget = (attempts = 0) => {
      const el = document.getElementById(`speech-${targetSpeechNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (attempts < 10) {
        setTimeout(() => scrollToTarget(attempts + 1), 200);
      }
    };

    if (fetchedPages.has(targetPage)) {
      scrollToTarget();
    } else {
      fetchPageIfNeeded(targetPage).then(() => {
        scrollToTarget();
      });
    }
  }, [currentMatchIndex, matchSpeechNumbers, fetchedPages]);

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

  async function fetchPageIfNeeded(page) {
    if (fetchedPages.has(page)) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/strapi/debates/content/${documentId}`, {
        params: { page, limit }
      });
      const newSpeeches = response.data.data.debate.speeches;

      if (newSpeeches.length > 0) {
        setSpeeches((prev) => [...prev, ...newSpeeches]);
        setFetchedPages((prev) => new Set(prev).add(page));
        setCurrentPage(Math.max(currentPage, page));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching page", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreSpeeches() {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const nextPage = currentPage + 1;
      const response = await axios.get(`/api/strapi/debates/content/${documentId}`, {
        params: { page: nextPage, limit }
      });

      const newSpeeches = response.data.data.debate.speeches;

      if (newSpeeches.length > 0) {
        setSpeeches((prev) => [...prev, ...newSpeeches]);
        setFetchedPages((prev) => new Set(prev).add(nextPage));
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

  async function handleSearchInDebate() {
    try {
      const res = await axios.post("/api/search-in-debate", {
        debateId: documentId,
        keyPhrase: inputValues.keyPhrase,
        speakers: inputValues.speakerName ? [inputValues.speakerName] : [],
        sentiments: inputValues.sentiments,
      });

      const matches = res.data.speeches;
      setMatchSpeechNumbers(matches.map((s) => s.speech_number));
      setMatchSpeechIds(matches.map((s) => s.id));

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCurrentMatchIndex(0);
        });
      });
    } catch (err) {
      console.error("Search failed", err);
    }
  }

  const handleInputChange = (field, value) => {
    setInputValues((prev) => ({ ...prev, [field]: value }));
  };

  const deduplicatedSpeeches = speeches.filter(
    (speech, index, self) =>
      index === self.findIndex((s) => s.speech_id === speech.speech_id)
  );

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white">
      <NavigationBar title={title} showSearch={true} placeholder="Λέξη / φράση-κλειδί ..." />

      {!showFilters && (
        <div className="fixed bottom-[2rem] left-6 z-50">
          <button onClick={() => setShowFilters(true)} className="button bg-white">→</button>
        </div>
      )}

      <div className="flex text-white w-full m-auto pt-[2rem] relative z-10">
        {showFilters && (
          <div className="mb-6 px-8 w-1/4 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Φίλτρα</h1>
              <button onClick={() => setShowFilters(false)} className="button">Απόκρυψη</button>
            </div>
            <NameFilter
              selectedName={inputValues.speakerName}
              onFilterChange={(updatedName) => handleInputChange("speakerName", updatedName)}
            />
            <SentimentFilter
              selectedSentiments={inputValues.sentiments}
              onFilterChange={(updatedSentiments) => handleInputChange("sentiments", updatedSentiments)}
              disabled={inputValues.keyPhrase.trim() === "" && inputValues.topics.length === 0}
            />
            <button className="button mt-6 w-full" onClick={handleSearchInDebate}>
              Εφαρμογή Φίλτρων
            </button>
          </div>
        )}

        <div className={`flex flex-col items-center justify-start ${showFilters ? 'w-3/4' : 'w-full'} space-y-6 transition-all duration-300`}>
          <div className="text-center text-3xl font-bold mb-6">
            <h1>Περιεχόμενο Ομιλιών</h1>
            {matchSpeechNumbers.length > 0 && (
              <div className="flex gap-4 items-center justify-center mb-4">
                <button onClick={() => setCurrentMatchIndex((prev) => Math.max(prev - 1, 0))} disabled={currentMatchIndex === 0}>← Προηγούμενο</button>
                <span>{currentMatchIndex + 1} / {matchSpeechNumbers.length}</span>
                <button onClick={() => setCurrentMatchIndex((prev) => Math.min(prev + 1, matchSpeechNumbers.length - 1))} disabled={currentMatchIndex >= matchSpeechNumbers.length - 1}>Επόμενο →</button>
              </div>
            )}
          </div>

          {deduplicatedSpeeches.map((speech) => (
            <div key={speech.speech_id} id={`speech-${speech.speech_number}`} className="flex w-full justify-start px-6 pb-6">
              <div className="w-[200px] flex flex-col items-center justify-start text-center space-y-2">
                <SpeakerCircle speakerName={speech.speaker_name} documentId={speech.speaker?.documentId} imageUrl={getImageUrl(speech.speaker?.image)} />
              </div>
              <div className={`flex-1 p-6 backdrop-blur rounded-3xl shadow-2xl border-2 transition-all duration-300 ${matchSpeechIds.includes(speech.speech_id) ? "bg-gray-800/80" : "bg-white/10 border-white/30"}`}>
                {speech.content.map((paragraph, index) => (
                  <p key={index} className="mb-4 text-justify leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

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
