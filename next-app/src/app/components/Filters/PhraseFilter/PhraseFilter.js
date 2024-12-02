import React, { useState, useRef, useEffect } from "react";
import FilterSection from "../FilterSection.js";
import styles from "./PhraseFilter.module.css";

const PhraseFilter = ({ phrase = "", onPhraseChange }) => {
  const [tempPhrase, setTempPhrase] = useState(phrase);
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setTempPhrase(e.target.value);
    onPhraseChange(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      // Adjust height dynamically
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight - 20}px`; // Set height to content height
    }
  }, [tempPhrase]);

  return (
    <FilterSection title="Search by Phrase">
      <div style={{color: "#333"} }>Discover which politicians have said your key-phrase in their speech</div>
      <div className={styles.phraseContainer}>
        <textarea
          ref={textareaRef}
          placeholder="Enter a phrase..."
          value={tempPhrase}
          onChange={handleInputChange}
          className={styles.textarea}
          rows={1} // Initial height: one line
        />
      </div>
    </FilterSection>
  );
};

export default PhraseFilter;
