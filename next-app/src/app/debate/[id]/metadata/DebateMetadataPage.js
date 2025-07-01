'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavigationBar from "@components/Navigation/NavigationBar.js";
import SpeakerCircle from "@components/Speaker/SpeakerCircle/SpeakerCircle.js";
import { getImageUrl } from "@utils/getImageUrl.js";
import axios from "axios";

const DebateMetadataPage = () => {
  const { id: documentId } = useParams();

  const initialSpeakersShown = 3;
  const [debateData, setDebateData] = useState(null);
  const [visibleSpeakers, setVisibleSpeakers] = useState(initialSpeakersShown);

  const [activeTab, setActiveTab] = useState('Metadata');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!documentId) return;

    const fetchDebateData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/strapi/debates/metadata/${documentId}`);
        setDebateData(response.data.debate);
      } catch (error) {
        console.error("Error fetching debate metadata:", error);
      }
    };

    fetchDebateData();
  }, [documentId]);

  if (!debateData) return <p>Loading debate metadata...</p>;

  const {
    title,
    session,
    session_date,
    period,
    meeting,
    topics,
    opening_section,
    speakers,
    summary,
  } = debateData;

  return (
    <div className="text-white w-full min-h-screen bg-transparent">
      <NavigationBar title={title} showSearch={false} />

      <div className="w-3/4 max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8">

        {/* Title */}
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl font-extrabold">{title}</h1>
        </div>

        {/* Opening Section */}
        {opening_section && (
          <div className="bg-white/5 rounded-xl shadow p-6">
            <strong className="text-lg">Εναρκτήρια Ενότητα</strong>
            <p className="mt-2">{opening_section}</p>
          </div>
        )}

        {/* Topics */}
        {topics?.length > 0 && (
          <div className="bg-white/5 rounded-xl shadow p-6">
            <strong className="text-lg">Θέματα Συζήτησης</strong>
            <ul className="list-disc list-inside mt-2">
              {topics.map((t, idx) => (
                <li key={idx}>{t.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white/5 rounded-xl shadow p-6">
          <strong className="text-lg">Πληροφορίες Συνεδρίασης</strong>
          <ul className="list-disc list-inside mt-2">
            {session && <li>Σύνοδος: {session}</li>}
            {period && <li>Περίοδος: {period}</li>}
            {meeting && <li>Συνεδρίαση: {meeting}</li>}
            {session_date && <li>Ημερομηνία: {session_date}</li>}
          </ul>
        </div>

        {/* Summary */}
        {summary && (
          <div className="bg-white/5 rounded-xl shadow p-6">
            <strong className="text-lg">Περίληψη</strong>
            <p className="mt-2">{summary}</p>
          </div>
        )}

        {/* Speakers */}
        {speakers?.length > 0 && (
          <div className="bg-white/5 rounded-xl shadow p-6">
            <p className="mb-4">
              <strong className="text-lg">Συμμετέχοντες Ομιλητές</strong> ({speakers.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {speakers.slice(0, visibleSpeakers).map((speaker, idx) => (
                <SpeakerCircle
                  key={idx}
                  speakerName={speaker.speaker_name}
                  documentId={speaker.documentId}
                  imageUrl={getImageUrl(speaker.image)}
                />
              ))}
            </div>

            {/* Toggle Button */}
            <div className="mt-6 text-center">
              {visibleSpeakers < speakers.length ? (
                <button
                  className="text-white border border-white rounded-full px-4 py-1 hover:bg-white hover:text-black transition"
                  onClick={() => setVisibleSpeakers(speakers.length)}
                >
                  Προβολή Όλων
                </button>
              ) : speakers.length > initialSpeakersShown && (
                <button
                  className="text-white border border-white rounded-full px-4 py-1 hover:bg-white hover:text-black transition"
                  onClick={() => setVisibleSpeakers(initialSpeakersShown)}
                >
                  Απόκρυψη
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );

};

export default DebateMetadataPage;
