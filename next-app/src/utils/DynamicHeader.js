import React, { useState } from "react";
import PropTypes from "prop-types";
import renderOptionContent from "./renderOptionsContent.js";
import { useRouter } from "next/navigation";

const DynamicHeader = ({ primaryFilter, onSearch, resetSearch }) => {
  const router = useRouter();

  const [inputValues, setInputValues] = useState({
    speakerName: "",
    keyPhrase: "",
  });
  const [speakerName, setSpeakerName] = useState("speaker name");
  const [keyPhrase, setKeyPhrase] = useState("key phrase");

  const [searchPerformed, setSearchPerformed] = useState(false);

  const resetInputFields = () => {
    setInputValues({
      speakerName: "",
      keyPhrase: "",
    });
    setSpeakerName("speaker name");
    setKeyPhrase("key phrase");
  };

  const handleInputChange = (name, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    if (name === "speakerName") setSpeakerName(value || "speaker name");
    else if (name === "keyPhrase") setKeyPhrase(value || "key-phrase");
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    onSearch(); // Notify the parent that a search was performed
  };

  const handleSearchAgain = () => {
    setSearchPerformed(false);
    resetInputFields();
    resetSearch(); // Reset the searchPerformed state in the parent component
  };

  return (
    <div>
      <h1 className={`message ${!primaryFilter ? "home" : ""}`}>
        {primaryFilter === "Search by Name" && (
          <span>
            Find speakers named{" "}
            <span className="dynamic-content">{speakerName}</span>
          </span>
        )}
        {primaryFilter === "Search by Key Phrase" && (
          <span>
            Find out which speakers have said:{" "}
            <span className="dynamic-content">{keyPhrase}</span> in their
            speeches
          </span>
        )}
      </h1>

      <div className="buttonContainer">
        {!searchPerformed ? (
          <>
            {renderOptionContent(primaryFilter, inputValues, handleInputChange)}
            <button onClick={handleSearch}>Search</button>
          </>
        ) : (
          <>
            <button onClick={() => handleSearchAgain()}>Search Again</button>
          </>
        )}
        <button onClick={() => router.push("/browse-speakers/")}>Go Back</button>
      </div>
    </div>
  );
};

DynamicHeader.propTypes = {
  primaryFilter: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
};

export default DynamicHeader;
