import React, { useEffect, useState } from "react";
import FilterSection from "./FilterSection.js";
import { constants } from "../../../../constants/constants.js";
import PartyItem from "../Party/PartyItem.js";
import axios from "axios";
import { getImageUrl } from "../../../utils/getImageUrl.js";
import {Search, X} from "lucide-react";


const PartyFilter = ({ selectedParties = [], onFilterChange }) => {
  const [parties, setParties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ New state
  const [loading, setLoading] = useState(true);
  const STRAPI_URL = constants.STRAPI_URL;

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const query = `
          query {
            politicalParties(pagination: { limit: -1 }) {
              documentId
              name
              image {
                formats
                url
              }
            }
          }
        `;

        const response = await axios.post(
          `${STRAPI_URL}/graphql`,
          { query },
          { headers: { "Content-Type": "application/json" } }
        );

        setParties(response.data.data.politicalParties);
      } catch (error) {
        console.error("Error fetching parties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParties();
  }, []);

  // ✅ Filtered parties based on speeches input
  const filteredParties = parties.filter((party) =>
    party.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleParties = filteredParties.slice(0, visibleCount);

  const togglePartySelection = (party) => {
    const isAlreadySelected = selectedParties.includes(party);
    const updatedSelection = isAlreadySelected
      ? selectedParties.filter((t) => t !== party)
      : [...selectedParties, party];

    onFilterChange(updatedSelection);
  };

  return (
    <FilterSection title="Political Party">
      {/* Styled Search Input Container */}
      <div className="relative flex-1 mb-4">
        <input
          type="text"
          placeholder="Search political party ..."
          className="w-full text-white placeholder-white bg-transparent pr-20 pl-4 py-2 rounded-3xl border-white border-1 outline-none focus:outline-none focus:ring-0 focus:shadow-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Clear Button (X) */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}

        {/* Search Icon */}
        <button
          disabled
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white"
        >
          <Search size={18} />
        </button>
      </div>


      {loading ? (
        <p className="loadingText">Loading parties ...</p>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-y-1.5 justify-center">
            {visibleParties.map((party) => {
              const partyImage = getImageUrl(party.image, "party");

              return (
                <PartyItem
                  key={party.documentId}
                  name={party.name}
                  image={partyImage}
                  isSelected={selectedParties.includes(party.name)}
                  handleClick={() => togglePartySelection(party.name)}
                />
              );
            })}
          </div>

          <div className="flex justify-evenly items-end">
            {visibleCount > 12 && filteredParties.length > 12 && (
              <button className="showMoreButton" onClick={() => setVisibleCount(12)}>
                Show less ...
              </button>
            )}

            {visibleCount < filteredParties.length && (
              <button className="showMoreButton" onClick={() => setVisibleCount(visibleCount + 12)}>
                Show more ...
              </button>
            )}
          </div>
        </>
      )}
    </FilterSection>
  );
};

export default PartyFilter;
