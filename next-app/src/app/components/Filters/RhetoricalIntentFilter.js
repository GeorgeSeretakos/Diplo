"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import FilterSection from "./FilterSection";

const rhetoricalOptions = [
  { value: "Inform/Explain", label: "Ενημέρωση/Επεξήγηση" },
  { value: "Persuade/Advocate", label: "Πειθώ/Υποστήριξη" },
  { value: "Motivate/Inspire", label: "Κίνητρο/Έμπνευση" },
  { value: "Criticize/Denounce", label: "Κριτική/Καταγγελία" },
  { value: "Commemorate/Honor", label: "Ανάμνηση/Τιμή" },
  { value: "Other", label: "Άλλο" },
];

const RhetoricalIntentFilter = ({ selectedRhetoricalIntent = "", onFilterChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState(selectedRhetoricalIntent);

  useEffect(() => {
    setTempSelection(selectedRhetoricalIntent);
  }, [selectedRhetoricalIntent]);

  const applySelection = () => {
    onFilterChange(tempSelection);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempSelection("");
    onFilterChange("");
  };

  const selectedLabel = rhetoricalOptions.find(opt => opt.value === selectedRhetoricalIntent)?.label;

  return (
    <FilterSection>
      {/* Title + Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-lg font-bold text-white">Πρόθεση Ομιλητή</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(true)}
            disabled={disabled}
            className={`px-3 py-1 text-sm font-bold border rounded-full transition ${
              disabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "text-white border-white bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            + Επιλογή
          </button>
          {selectedRhetoricalIntent && (
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
      {selectedRhetoricalIntent && (
        <div className="flex flex-wrap gap-2 justify-start mb-2">
          <span className="flex font-bold items-center justify-center text-sm px-4 py-2 rounded-full border border-white bg-white text-black">
            {selectedLabel}
          </span>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isOpen && !disabled} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Dialog.Panel className="bg-white/10 backdrop-blur-md border border-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
            <Dialog.Title className="text-lg font-bold mb-4 text-white text-center">
              Επιλέξτε Ρητορική Πρόθεση
            </Dialog.Title>

            {/* Options */}
            <div className="flex flex-wrap w-3/4 m-auto gap-3 max-h-96 overflow-y-auto justify-center scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
              {rhetoricalOptions.map(({ value, label }) => (
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
                    name="rhetoricalIntent"
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

export default RhetoricalIntentFilter;
