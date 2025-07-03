"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import FilterSection from "./FilterSection";

const sentimentOptions = [
  { value: "very_negative", label: "Πολύ Αρνητικό" },
  { value: "negative", label: "Αρνητικό" },
  { value: "neutral", label: "Ουδέτερο" },
  { value: "positive", label: "Θετικό" },
  { value: "very_positive", label: "Πολύ Θετικό" },
];

const SentimentFilter = ({ selectedSentiment = "", onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState(selectedSentiment);

  useEffect(() => {
    // Sync temp state with external state
    setTempSelection(selectedSentiment);
  }, [selectedSentiment]);

  const applySelection = () => {
    onFilterChange(tempSelection);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempSelection("");
    onFilterChange("");
  };

  const selectedLabel = sentimentOptions.find(
    (opt) => opt.value === selectedSentiment
  )?.label;

  return (
    <FilterSection>
      {/* Title + Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-lg font-bold text-white">Συναισθηματικό Φορτίο</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-1 text-sm font-bold text-white border border-white rounded-full bg-transparent hover:bg-white hover:text-black transition"
          >
            + Επιλογή
          </button>
          {selectedSentiment && (
            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm font-bold hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Selected Value */}
      {selectedSentiment && (
        <div className="flex flex-wrap gap-2 justify-start mb-2">
          <span className="flex font-bold items-center justify-center text-sm px-4 py-2 rounded-full border border-white bg-white text-black">
            {selectedLabel}
          </span>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Dialog.Panel className="bg-white/10 backdrop-blur-md border border-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
            <Dialog.Title className="text-lg font-bold mb-4 text-white text-center">
              Επιλέξτε Συναισθηματικό Φόρτο
            </Dialog.Title>

            {/* Options */}
            <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto justify-center scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
              {sentimentOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`cursor-pointer font-bold px-4 py-2 rounded-full border text-sm text-center transition ${
                    tempSelection === value
                      ? "bg-white text-black border-white"
                      : "bg-transparent border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="sentiment"
                    value={value}
                    checked={tempSelection === value}
                    onChange={() => setTempSelection(value)}
                    className="hidden"
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setTempSelection("")}
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

export default SentimentFilter;
