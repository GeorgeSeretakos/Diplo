import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

const DynamicHeader = ({ primaryFilter, onSearch, resetSearch, inputValues, onInputChange }) => {
  const router = useRouter();

  const handleSearch = () => {
    onSearch(); // Notify the parent that a search was performed
  };

  const handleSearchAgain = () => {
    resetSearch(); // Reset the searchPerformed state in the parent component
  };

  const renderOptionContent = (option, inputValues, handleInputChange) => {

    switch(option) {
      case "name":
        return (
          <div className="inputContainer query">
            <input
              type="text"
              value={inputValues.speakerName || ""}
              onChange={(e) => handleInputChange('speakerName', e.target.value)}
              placeholder="Enter the speaker's name"
              required
            />
          </div>
        );
      // case "Search by Political Party":
      //   return (
      //     <div className="query">
      //       <input
      //         type="text"
      //         value={inputValues.actor || ""}
      //         onChange={(e) => handleInputChange('actor', e.target.value)}
      //         placeholder="Enter actor/cast member"
      //         required
      //       />
      //     </div>
      //   );
      case "speaker-phrase" || "debate-phrase":
        return (
          <div className= "query">
            <input
              type="text"
              value={inputValues.keyPhrase || ""}
              onChange={(e) => handleInputChange('keyPhrase', e.target.value)}
              placeholder="Enter the key-prhase"
              required
            />
          </div>
        );
      case "speaker-topic" || "debate-topic":
        return (
          <div className="inputContainer query">
            <input
              type="text"
              value={inputValues.topics || ""}
              onChange={(e) => handleInputChange("topics", e.target.value)}
              placeholder="Enter topics (e.g., Healthcare, Climate)"
              required
            />
          </div>
        );
      case "date":
        return (
          <div className="inputContainer query">
            <input
              type="date"
              value={inputValues.date || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </div>
        );
      case "session":
        return (
          <div className="inputContainer query">
            <input
              type="text"
              value={inputValues.session || ""}
              onChange={(e) => handleInputChange("session", e.target.value)}
              placeholder="Enter session (e.g., Winter Session 2024)"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className={`message ${!primaryFilter ? "home" : ""}`}>
        {primaryFilter === "name" && (
          <span>
            Find speakers named{" "}
            <span className="dynamic-content">{inputValues.speakerName || "speaker name"}</span>
          </span>
        )}
        {/*{primaryFilter === "speaker-topics" && (*/}
        {/*  <span>*/}
        {/*    Find out which speakers debating on:{" "}*/}
        {/*    <span className="dynamic-content">{inputValues.topics || "key phrase"}</span> in their speeches*/}
        {/*  </span>*/}
        {/*)}*/}
        {/*{primaryFilter === "debate-topics" && (*/}
        {/*  <span>*/}
        {/*    Find out which speakers have said:{" "}*/}
        {/*    <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span> in their speeches*/}
        {/*  </span>*/}
        {/*)}*/}
        {primaryFilter === "speaker-phrase" && (
          <span>
            Find out which speakers have said:{" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span> in their speeches
          </span>
        )}
        {primaryFilter === "debate-phrase" && (
          <span>
            Find out which debates include the phrase:{" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span>
          </span>
        )}
        {primaryFilter === "session" && (
          <span>
            Discover debates with parliament session:{" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span>
          </span>
        )}
        {primaryFilter === "date" && (
          <span>
            Discover debates from {" "} to {" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span>
          </span>
        )}
        {primaryFilter === "all" && (
          <span>You are currently browsing all speakers</span>
        )}
      </h1>

      <div className="buttonContainer">
        {renderOptionContent(primaryFilter, inputValues, onInputChange)}
        {primaryFilter !== "all" && (
          <>
            <button onClick={handleSearch}>Search</button>
            <button onClick={() => router.push("/browse-speakers/")}>Go Back</button>
          </>
      )}
    </div>
</div>
)
  ;
};

DynamicHeader.propTypes = {
  primaryFilter: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  inputValues: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default DynamicHeader;
