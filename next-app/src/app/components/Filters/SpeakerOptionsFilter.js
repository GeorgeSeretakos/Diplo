import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import FilterSection from "./FilterSection";
import { constants } from "../../../../constants/constants";
import axios from "axios";
import { Search, X } from "lucide-react";
import { getImageUrl } from "../../../utils/getImageUrl.js";

const SpeakerOptionsFilter = ({ selectedValues = [], onChange }) => {
  const [speakers, setSpeakers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelection, setTempSelection] = useState(selectedValues);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const STRAPI_URL = constants.STRAPI_URL;

  const fetchSpeakers = async () => {
    setLoading(true);
    try {
      const query = `
        query {
          speakers(pagination: { limit: -1 }) {
            documentId
            speaker_name
            image {
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
      setSpeakers(response.data.data.speakers || []);
    } catch (err) {
      console.error("Error fetching speakers:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeaker = (name) => {
    setTempSelection((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const applySelection = () => {
    onChange(tempSelection);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempSelection([]);
    onChange([]);
  };

  const filteredSpeakers = speakers.filter((speaker) =>
    speaker.speaker_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = () => {
    setIsOpen(true);
    if (speakers.length === 0) fetchSpeakers();
  };

  return (
    <FilterSection>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-lg font-bold text-white">Συμμετέχοντες Ομιλητές</h3>
        <div className="flex gap-2">
          <button
            onClick={openModal}
            className="px-3 py-1 text-sm font-bold text-white border border-white rounded-full bg-transparent hover:bg-white hover:text-black transition"
          >
            + Επιλογή
          </button>
          {selectedValues.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm font-bold hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Selected speakers in filter preview */}
      <div className="flex flex-wrap gap-2 justify-start max-w-full">
        {selectedValues.slice(0, 20).map((name) => {
          const speaker = speakers.find((s) => s.speaker_name === name);

          return (
            <div key={name} className="flex flex-col items-center w-[125px] gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                <img
                  src={getImageUrl(speaker?.image)}
                  alt={name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="text-center text-xs font-semibold leading-tight text-white">
                {name.split(" ").map((word, idx) => (
                  <span key={idx} className="block leading-tight text-center break-words">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>


      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Dialog.Panel
            className="bg-white/10 backdrop-blur-md border border-white p-6 px-10 rounded-2xl shadow-xl w-full max-w-4xl">
            <Dialog.Title className="text-lg font-bold mb-4 text-white text-center">
              Επιλέξτε Ομιλητές
            </Dialog.Title>

            {/* Search bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Αναζήτηση ομιλητή ..."
                className="w-full text-white placeholder-white bg-transparent pr-20 pl-4 py-2 rounded-3xl border-white border outline-none"
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

            {/* Speaker grid */}
            {loading ? (
              <p className="text-white">Loading speakers...</p>
            ) : (
              <div
                className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-6 max-h-[450px] overflow-y-auto overflow-x-hidden px-6">
                {filteredSpeakers.map((speaker) => {
                  const isSelected = tempSelection.includes(speaker.speaker_name);
                  return (
                    <div
                      key={speaker.documentId}
                      onClick={() => toggleSpeaker(speaker.speaker_name)}
                      className="flex flex-col items-center cursor-pointer w-20 space-y-1"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                        <img
                          src={getImageUrl(speaker.image)}
                          alt={speaker.speaker_name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div
                        className={`text-center text-xs font-semibold leading-tight ${isSelected ? "text-[#f9d342]" : "text-white"}`}>
                        {speaker.speaker_name.split(" ").map((word, idx) => (
                          <span key={idx} className="block truncate">{word}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
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

export default SpeakerOptionsFilter;
