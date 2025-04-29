'use client';

import styles from "./SpeakerBio.module.css";
import React, { useEffect, useState } from "react";
import {fetchPositionHeld} from "@utils/wikidata/dataFetchers.js";
import {formatPositionHeld} from "@utils/wikidata/formatters.js";
import axios from "axios";
import PartyItem from "@components/Party/PartyItem.js";
import {getImageUrl} from "@utils/getImageUrl.js";
import {useParams} from "next/navigation";
import NavigationBar from "../../../components/Navigation/NavigationBar.js";
import SpeakerCard from "../../../components/Speaker/SpeakerCard/SpeakerCard.js";

const SpeakerBioPage = () => {
  const initialDebatesShown = 4;
  const {id: documentId} = useParams();

  const [visibleDebates, setVisibleDebates] = useState(initialDebatesShown);
  const [showMoreVisible, setShowMoreVisible] = useState(true);

  const [speakerData, setSpeakerData] = useState(null);
  const [positionsHeld, setPositionsHeld] = useState([]);
  const [wikidataEntityId, setWikidataEntityId] = useState(null);
  const [loading, setLoading] = useState(true);


  console.log("Speaker Bio received DocumentId:", documentId);

  useEffect(() => {
    if (!documentId) {
      alert("documentId is missing");
      return;
    }
    const fetchSpeakerData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/strapi/speakers/metadata/${documentId}`);
        console.log(response);
        setSpeakerData(response.data.speaker);
        console.log("Just set speakers data", speakerData);

        const link = response.data.speaker?.link;
        console.log("Link", link);
        if (link) {
          const entityId = link.split("/").pop();
          console.log("EntityId: ", entityId);
          setWikidataEntityId(entityId);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching speakerId data: ", error);
        setLoading(false);
      }
    }
    fetchSpeakerData();

  }, [documentId]);

  console.log("Wikidata id: ", wikidataEntityId);

  useEffect(() => {
    if (!wikidataEntityId) return;

    const fetchWikidataPositions = async () => {
      try {
        console.log("Called");
        const positions = await fetchPositionHeld(wikidataEntityId);
        const formattedPositions = formatPositionHeld(positions);
        setPositionsHeld(formattedPositions);

      } catch (error) {
        console.error("Error fetching positions held: ", error);
      }
    }
    fetchWikidataPositions();
  }, [wikidataEntityId]);

  console.log("Speaker data: ", speakerData);

  if (loading) return <p>Loading...</p>;
  if (!speakerData) return <p>No data available</p>

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
    debates,
  } = speakerData;


  // Construct the full image URL
  const imageUrl = getImageUrl(image);

  return (
    <div className="text-white w-full min-h-screen bg-transparent">

      {/* Navbar + Tabs */}
      <NavigationBar
        title={speaker_name}
        showSearch={false}
      />

      <div className="w-1/2 m-auto text-justify flex flex-col justify-center p-10">

        {speaker_name &&
          <div className={`flex items-center ${image ? 'justify-between' : 'justify-center'}`}>
            {image && <SpeakerCard image={imageUrl} disableClick={true}/>}
            <h1 className="text-3xl text-center font-bold mb-12">{speaker_name}</h1>
          </div>
        }

        {description &&
          <div>
            <strong className="strong">Description:</strong> {description}
          </div>
        }

        {date_of_birth && place_of_birth && (
          <div>
            <strong className="strong">Born:</strong> {date_of_birth}, {place_of_birth}
          </div>
        )}
        {date_of_death &&
          <p>
            <strong className="strong">Died:</strong>
            {date_of_death}
          </p>
        }

        {educated_at && (
          <div>
            <strong className="strong">Education:</strong>
            <ul className={styles.list}>
              {educated_at.split(",").map((education, index) => (
                <li key={index}>
                  {education.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {occupation && occupation.length > 0 && (
          <div>
            <strong className="strong">Occupation:</strong> {occupation}
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <strong className="strong">Languages:</strong> {languages}
          </div>
        )}

        {political_parties && political_parties.length > 0 && (
          <>
            <div className={`${styles.partyDetails}`}>
              <strong className="strong">Political Parties </strong>
            </div>
            <div className="mb-6">
              {political_parties.map((party) => party.name).join(", ")}
            </div>
          </>
        )}
        <div className={`${styles.partyImages}`}>
          {political_parties.map((party) => {
            const partyImage = getImageUrl(party.image, "party")

            return (
              <PartyItem
                key={party.name}
                name={party.name}
                image={partyImage}
                style={{pointerEvents: "none"}}
              />
            );
          })}
        </div>

        {positionsHeld && (
          <div>
            <strong className="strong">Positions Held</strong>
            <ul className={styles.list}>
              {positionsHeld.map((position, index) => (
                <li key={index}>
                  {position}
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Website Section */}
        {website && (
          <div className={styles.websiteSection}>
            <button>
              <a href={website} target="_blank" rel="noopener noreferrer">
              Visit Website
              </a>
            </button>
          </div>
        )}
      </div>
</div>

)
  ;
};
export default SpeakerBioPage;
