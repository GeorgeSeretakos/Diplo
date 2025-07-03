'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import NavigationBar from "@components/Navigation/NavigationBar.js";
import PartyItem from "@components/Party/PartyItem.js";
import { fetchPositionHeld } from "@utils/wikidata/dataFetchers.js";
import { formatPositionHeld } from "@utils/wikidata/formatters.js";
import { getImageUrl } from "@utils/getImageUrl.js";
import { formatDateToGreek } from "@utils/formatDate.js";
import Image from "next/image";

const SpeakerBioPage = () => {
  const { id: documentId } = useParams();

  const [speakerData, setSpeakerData] = useState(null);
  const [positionsHeld, setPositionsHeld] = useState([]);
  const [wikidataEntityId, setWikidataEntityId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;

    const fetchSpeakerData = async () => {
      try {
        const response = await axios.get(`/api/speakers/metadata/${documentId}`);
        const speaker = response.data.speaker;
        setSpeakerData(speaker);

        const link = speaker?.link;
        if (link) {
          const entityId = link.split("/").pop();
          setWikidataEntityId(entityId);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching speaker data:", error);
        setLoading(false);
      }
    };

    fetchSpeakerData();
  }, [documentId]);

  useEffect(() => {
    if (!wikidataEntityId) return;

    const fetchWikidataPositions = async () => {
      try {
        const positions = await fetchPositionHeld(wikidataEntityId);
        setPositionsHeld(formatPositionHeld(positions));
      } catch (error) {
        console.error("Error fetching positions held:", error);
      }
    };

    fetchWikidataPositions();
  }, [wikidataEntityId]);

  if (loading) return <p className="text-white text-center py-8">Loading...</p>;
  if (!speakerData) return <p className="text-white text-center py-8">No data available</p>;

  const {
    speaker_name,
    description,
    image,
    date_of_birth,
    place_of_birth,
    date_of_death,
    educated_at,
    occupation,
    website,
    languages,
    political_parties,
    age,
    link,
  } = speakerData;

  const imageUrl = getImageUrl(image);

  return (
    <div className="text-white w-full min-h-screen bg-transparent">
      <NavigationBar title={speaker_name} showSearch={false} />

      <div className="w-3/4 max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8">

        {/* Speaker Header */}
        {speaker_name && (
          <div className="w-full rounded-2xl shadow-xl p-6 flex flex-col items-center text-center gap-6 bg-white/5 backdrop-blur">
            {image && (
              <div className="w-[168px] h-[240px] relative rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={imageUrl}
                  alt={`${speaker_name} portrait`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 168px"
                  priority // optional: speeds up loading for important images
                />
              </div>
            )}
            <h1 className="text-3xl font-extrabold">{speaker_name}</h1>
            {link === '-' ? (
              <p className="text-gray-300 text-base max-w-xl">
                Οι πληροφορίες του συγκεκριμένου ομιλητή δεν έχουν εμπλουτιστεί ακόμη από εξωτερικές πηγές.
                Δείτε περισσότερα για το συγκεκριμένο πολιτικό πρόσωπο στις κοινοβουλευτικές του συμμετοχές!
              </p>
            ) : (
              age && (
                <p className="text-gray-300 text-base max-w-xl">
                  {description ? `${description}, ` : ""}{age} ετών
                </p>
              )
            )}
            {political_parties?.length > 0 && (
              <div className="w-full max-w-md">
                <div className="flex flex-wrap justify-center gap-3">
                  {political_parties.map((party) => (
                    <PartyItem
                      key={party.name}
                      name={party.name}
                      image={getImageUrl(party.image, "party")}
                      style={{ pointerEvents: "none" }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Career & Education */}
        {(positionsHeld.length > 0 || educated_at || occupation) && (
          <div className="bg-white/5 backdrop-blur rounded-2xl shadow-xl p-6">
            {positionsHeld.length > 0 && (
              <>
                <strong className="block font-semibold text-lg mb-1">Θέσεις Εργασίας</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-200">
                  {positionsHeld.map((position, index) => (
                    <li key={index}>{position}</li>
                  ))}
                </ul>
              </>
            )}

            {educated_at && (
              <>
                <strong className="block font-semibold text-lg mt-6 mb-1">Εκπαίδευση</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-200">
                  {educated_at.split(",").map((edu, index) => (
                    <li key={index}>{edu.trim()}</li>
                  ))}
                </ul>
              </>
            )}

            {occupation && (
              <>
                <strong className="block font-semibold text-lg mt-6 mb-1">Ενασχόληση</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-200">
                  {occupation.split(",").map((job, index) => (
                    <li key={index}>{job.trim()}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Biography */}
        {(languages || date_of_birth || date_of_death) && (
          <div className="bg-white/5 backdrop-blur rounded-2xl shadow-xl p-6">
            {languages && (
              <>
                <strong className="block font-semibold text-lg mb-1">Ομιλεί τις Γλώσσες</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-200">
                  {languages.split(",").map((lang, index) => (
                    <li key={index}>{lang.trim()}</li>
                  ))}
                </ul>
              </>
            )}

            {date_of_birth && place_of_birth && (
              <>
                <strong className="block font-semibold text-lg mt-6 mb-1">Ημερομηνία Γέννησης</strong>
                <p className="mt-2 text-gray-200">{formatDateToGreek(date_of_birth)}, {place_of_birth}</p>
              </>
            )}

            {date_of_death && (
              <>
                <strong className="block font-semibold text-lg mt-6 mb-1">Ημερομηνία Θανάτου</strong>
                <p className="mt-2 text-gray-200">{formatDateToGreek(date_of_death)}</p>
              </>
            )}
          </div>
        )}

        {/* Website */}
        {website && (
          <div className="buttonContainer">
            <a href={website} target="_blank" rel="noopener noreferrer">
              <button className="button">Προσωπική Ιστοσελίδα</button>
            </a>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <button className="button">Σύνδεσμος Wikidata</button>
            </a>
          </div>
        )}
      </div>
    </div>
  );

};

export default SpeakerBioPage;
