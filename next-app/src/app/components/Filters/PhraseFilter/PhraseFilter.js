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
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to content height
    }
  }, [tempPhrase]);

  return (
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
  );
};

export default PhraseFilter;
