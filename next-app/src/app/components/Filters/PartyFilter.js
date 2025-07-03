import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import FilterSection from "./FilterSection";
import PartyItem from "../Party/PartyItem";
import { getImageUrl } from "@/utils/getImageUrl";
import axios from "axios";
import { Search, X } from "lucide-react";


const PartyFilter = ({ selectedParties = [], onFilterChange }) => {
  const [parties, setParties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelection, setTempSelection] = useState(selectedParties);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

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

        const partyList = response.data.data.politicalParties;

        // ✅ Update state
        setParties(partyList);

        // ✅ Preload all images
        const preloadImages = (partyList) => {
          partyList.forEach((p) => {
            const url = getImageUrl(p.image, "party");
            const img = new Image();
            img.src = url;
          });
        };
        preloadImages(partyList);
      } catch (err) {
        console.error("Error fetching parties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, []);


  const toggleParty = (name) => {
    setTempSelection((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const applySelection = () => {
    onFilterChange(tempSelection);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempSelection([]);
    onFilterChange([]);
  };

  const filteredParties = parties.filter((party) =>
    party.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FilterSection>
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-lg font-bold text-white">Κόμμα</h3>

        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-1 text-sm font-bold text-white border border-white rounded-full bg-transparent hover:bg-white hover:text-black transition"
          >
            + Επιλογή
          </button>

          {selectedParties.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm font-bold hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-start">
        {selectedParties.map((name) => {
          const partyData = parties.find((p) => p.name === name);
          const partyImage = getImageUrl(partyData?.image, "party");

          return (
            <PartyItem
              key={name}
              name={name}
              image={partyImage}
              isSelected={true}
              highlight={false}
              style={{pointerEvents: "none"}}
            />
          );
        })}
      </div>


      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Dialog.Panel
            className="bg-white/10 backdrop-blur-md border border-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
            <Dialog.Title className="text-lg font-bold mb-4 text-white text-center">
              Επιλέξτε Κόμματα
            </Dialog.Title>

            {/* Search bar */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Αναζήτηση κόμματος ..."
                className="w-full text-white placeholder-white bg-transparent pr-20 pl-4 py-2 rounded-3xl border-white border outline-none focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={18}/>
                </button>
              )}
              <button disabled className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
                <Search size={18}/>
              </button>
            </div>

            {/* Party grid */}
            {loading ? (
              <p className="text-white">Loading parties ...</p>
            ) : (
              <div
                className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
                {filteredParties.map((party) => (
                  <PartyItem
                    key={party.documentId}
                    name={party.name}
                    image={getImageUrl(party.image, "party")}
                    isSelected={tempSelection.includes(party.name)}
                    handleClick={() => toggleParty(party.name)}
                  />
                ))}
              </div>
            )}

            {/* Modal actions */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setTempSelection([])}
                className="text-sm text-white hover:underline"
              >
                Reset
              </button>
              <button
                onClick={applySelection}
                className="px-3 py-1.5 text-sm bg-white text-black rounded-full font-semibold hover:opacity-90"
              >
                Εφαρμογή
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </FilterSection>
  );
};

export default PartyFilter;
