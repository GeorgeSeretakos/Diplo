import React, { useState } from "react";
import styles from "./SpeakerModal.module.css"; // CSS for styling


const SpeakerModal = ({ speakersData, isOpen, onClose, selectedSpeakers, setSelectedSpeakers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Filter speakers based on user input
  const filteredSpeakers = speakersData.filter((speaker) =>
    speaker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle speaker selection
  const toggleSpeakerSelection = (speaker) => {
    if (selectedSpeakers.some((s) => s.id === speaker.id)) {
      setSelectedSpeakers(selectedSpeakers.filter((s) => s.id !== speaker.id)); // Remove if already selected
    } else {
      setSelectedSpeakers([...selectedSpeakers, speaker]); // Add to selection
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Select Speakers</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for a speaker..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Display Filtered Speaker Components */}
        <div className={styles.speakerList}>
          {filteredSpeakers.length > 0 ? (
            filteredSpeakers.map((speaker) => (
              <div
                key={speaker.id}
                className={`${styles.speakerCard} ${selectedSpeakers.some((s) => s.id === speaker.id) ? styles.selected : ""}`}
                onClick={() => toggleSpeakerSelection(speaker)}
              >
                <img src={speaker.image} alt={speaker.name} className={styles.speakerImage} />
                <p>{speaker.name}</p>
                {selectedSpeakers.some((s) => s.id === speaker.id) && <span className={styles.checkmark}>✔</span>}
              </div>
            ))
          ) : (
            <p className={styles.noResults}>No speakers found</p>
          )}
        </div>

        {/* Confirm Selection Button */}
        <button className={styles.confirmButton} onClick={onClose}>Confirm Selection</button>
      </div>
    </div>
  );
};

const SpeakerFilter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Select Speakers</button>

      {/* Show selected speakers */}
      {selectedSpeakers.length > 0 && (
        <div className={styles.selectedSpeakersList}>
          <strong>Selected:</strong> {selectedSpeakers.map((s) => s.name).join(", ")}
        </div>
      )}

      {/* Speaker Modal */}
      <SpeakerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSpeakers={selectedSpeakers}
        setSelectedSpeakers={setSelectedSpeakers}
      />
    </div>
  );
};

export default SpeakerFilter;
