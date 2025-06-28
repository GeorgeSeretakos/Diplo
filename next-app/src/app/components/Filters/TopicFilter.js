import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import FilterSection from "./FilterSection";

const PREDEFINED_TOPICS = [
  "Οικονομική Πολιτική και Δημοσιονομικά",
  "Ανάπτυξη, Ανταγωνιστικότητα και Επενδύσεις",
  "Εργασιακές Σχέσεις και Κοινωνική Ασφάλιση",
  "Παιδεία, Θρησκεύματα, Έρευνα και Καινοτομία",
  "Υγεία και Κοινωνική Πρόνοια",
  "Εξωτερική Πολιτική και Ευρωπαϊκές Υποθέσεις",
  "Εθνική Άμυνα",
  "Δικαιοσύνη και Ανθρώπινα Δικαιώματα",
  "Δημόσια Τάξη και Προστασία του Πολίτη",
  "Περιβάλλον, Ενέργεια και Κλιματική Αλλαγή",
  "Υποδομές, Μεταφορές και Δίκτυα",
  "Αγροτική Ανάπτυξη και Τρόφιμα",
  "Τουρισμός",
  "Πολιτισμός και Αθλητισμός",
  "Ψηφιακή Διακυβέρνηση και Επικοινωνίες",
  "Στεγαστική Πολιτική και Αστικός Σχεδιασμός",
  "Δημόσια Διοίκηση και Αποκέντρωση",
  "Μετανάστευση και Άσυλο",
  "Ναυτιλία και Νησιωτική Πολιτική",
  "Θεσμικά Ζητήματα και Κοινοβουλευτικές Διαδικασίες",
  "Άλλο / Γενικά Θέματα",
];

const TopicFilter = ({ selectedTopics = [], onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState(selectedTopics);

  const toggleTopic = (topic) => {
    setTempSelection((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
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

  return (
    <FilterSection>
      {/* Title + Buttons Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-lg font-bold text-white">Θεματική Κατηγορία</h3>

        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-1 text-sm font-bold text-white border border-white rounded-full bg-transparent hover:bg-white hover:text-black transition"
          >
            + Επιλογή
          </button>

          {selectedTopics.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm font-bold hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>


      {/* Selected Topics */}
      <div className="flex flex-wrap gap-2 justify-start">
        {selectedTopics.map((topic, index) => (
          <span
            key={index}
            className="flex font-bold items-center justify-center text-sm px-4 py-2 rounded-full border border-white bg-white text-black"
          >
          {topic}
        </span>
        ))}

      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Dialog.Panel
            className="bg-white/10 backdrop-blur-md border border-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
            <Dialog.Title className="text-lg font-bold mb-4 text-white text-center">
              Επιλέξτε Θεματικές Κατηγορίες
            </Dialog.Title>

            {/* Topic options */}
            <div
              className="flex flex-wrap gap-3 max-h-96 overflow-y-auto justify-center scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent"
            >
              {PREDEFINED_TOPICS.map((topic, index) => (
                <label
                  key={index}
                  className={`cursor-pointer font-bold px-4 py-2 rounded-full border text-sm text-center transition
                    ${
                    tempSelection.includes(topic)
                      ? "bg-white text-black border-white"
                      : "bg-transparent border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tempSelection.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                    className="hidden"
                  />
                  {topic}
                </label>
              ))}
            </div>

            {/* Modal buttons */}
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

export default TopicFilter;
