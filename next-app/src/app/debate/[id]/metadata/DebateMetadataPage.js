'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavigationBar from "@components/Navigation/NavigationBar.js";
import SpeakerCircle from "@components/Speaker/SpeakerCircle/SpeakerCircle.js";
import { getImageUrl } from "@utils/getImageUrl.js";
import axios from "axios";

const DebateMetadataPage = () => {
  const router = useRouter();
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
        const response = await axios.get(`/api/strapi/debates/metadata/${documentId}`);
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

      {/* Navbar + Tabs */}
      <NavigationBar title={title} showSearch={false}/>

      <div className="w-3/4 max-w-4xl mx-auto px-6 py-12 text-justify flex flex-col gap-8">
        <h1 className="text-3xl text-center font-bold mb-6">{title}</h1>

        {opening_section && (
          <div>
            <strong className="strong">Opening Section:</strong>
            <p className="mt-2">{opening_section}</p>
          </div>
        )}

        {topics?.length > 0 && (
          <div>
            <strong className="strong">Topics Discussed:</strong>
            <ul className="list-disc list-inside mt-2">
              {topics.map((t, idx) => (
                <li key={idx}>{t.topic}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <strong className="strong">Debate Info:</strong>
          <ul className="list-disc list-inside mt-2">
            {session_date && <li>Session Date: {session_date}</li>}
            {period && <li>Period: {period}</li>}
            {session && <li>Session: {session}</li>}
            {meeting && <li>Meeting: {meeting}</li>}
          </ul>
        </div>

        {summary && (
          <div>
            <strong className="strong">Summary:</strong>
            <p className="mt-2">{summary}</p>
          </div>
        )}

        {speakers?.length > 0 && (
          <div>
            <p className="mb-4">
              <strong className="strong">Participating Speakers:</strong> ({speakers.length})
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

            <div className="mt-6 text-center">
              {visibleSpeakers < speakers.length && (
                <button
                  className="underline font-bold"
                  onClick={() => setVisibleSpeakers(speakers.length)}
                >
                  Show All
                </button>
              )}

              {visibleSpeakers >= speakers.length && speakers.length > initialSpeakersShown && (
                <button
                  className="underline font-bold"
                  onClick={() => setVisibleSpeakers(initialSpeakersShown)}
                >
                  Show Less
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
