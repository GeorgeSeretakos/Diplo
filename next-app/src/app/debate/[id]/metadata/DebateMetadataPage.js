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

      <div className="w-1/2 m-auto text-justify flex flex-col justify-center p-10">
        <h1 className="text-3xl text-center font-bold mb-6">{title}</h1>

        {opening_section && (
          <div className="mb-6">
            <strong className="strong">Opening Section</strong>
            <p>{opening_section}</p>
          </div>
        )}

        {topics?.length > 0 && (
          <div className="mb-4">
            <p className="">
              <strong className="strong">Topics Discussed</strong>
              {/*{topics.map(t => t.topic).join(", ")}*/}
            </p>
            {topics.map(t => t.topic).join(", ")}
          </div>
        )}

        <ul className="mb-6">
          {session_date && <li><strong className="strong">Session Date:</strong> {session_date}</li>}
          {period && <li><strong className="strong">Period:</strong> {period}</li>}
          {session && <li><strong className="strong">Session:</strong> {session}</li>}
          {meeting && <li><strong className="strong">Meeting:</strong> {meeting}</li>}
        </ul>

        {summary && (
          <div className="mb-6">
            <strong className="strong">Summary</strong>
            <p>{summary}</p>
          </div>
        )}

        {speakers?.length > 0 && (
          <>
            <p className="font-semibold mb-4"><strong className="strong">Participating Speakers </strong>({speakers.length})</p>
            <div className="flex flex-wrap gap-4">
              {speakers.slice(0, visibleSpeakers).map((speaker, idx) => (
                <SpeakerCircle
                  key={idx}
                  speakerName={speaker.speaker_name}
                  documentId={speaker.documentId}
                  imageUrl={getImageUrl(speaker.image)}
                />
              ))}
            </div>

            {visibleSpeakers < speakers.length && (
              <button
                className="mt-4 underline font-bold"
                onClick={() => setVisibleSpeakers(speakers.length)}
              >
                Show More
              </button>
            )}

            {visibleSpeakers >= speakers.length && speakers.length > initialSpeakersShown && (
              <button
                className="mt-4 underline font-bold"
                onClick={() => setVisibleSpeakers(initialSpeakersShown)}
              >
                Show Less
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DebateMetadataPage;
