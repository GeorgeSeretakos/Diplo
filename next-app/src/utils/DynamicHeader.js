import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import {TextField} from "@mui/material";


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
      case "speaker-name":
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
      case "speaker-phrase":
      case "debate-phrase":
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
      case "speaker-topic":
      case "debate-topic":
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
      case "debate-date":
        return (
          <div className="inputContainer query">
            {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
            {/*  <DatePicker*/}
            {/*    style={{backgroundColor: "white"}}*/}
            {/*    label="Select a date"*/}
            {/*    value={inputValues.startDate}*/}
            {/*    onChange={(date) => handleInputChange("startDate", date.target.value)}*/}
            {/*    renderInput={(params) => <TextField {...params} />}*/}
            {/*  />*/}
            {/*</LocalizationProvider>*/}
            {/*<DatePicker*/}
            {/*  selected={inputValues.endDate}*/}
            {/*  onChange={(date) => handleInputChange("endDate", date)}*/}
            {/*  placeholderText="Select End Date"*/}
            {/*  dateFormat="yyyy-MM-dd"*/}
            {/*  required*/}
            {/*/>*/}
            <input
              type="date"
              value={inputValues.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
            />
            <input
              type="date"
              value={inputValues.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
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
        {primaryFilter === "speaker-name" && (
          <span>
            Find speakers named{" "}
            <span className="dynamic-content">{inputValues.speakerName || "speaker name"}</span>
          </span>
        )}
        {primaryFilter === "speaker-phrase" && (
          <span>
            Find out which speakers have said:{" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span> in their speeches
          </span>
        )}
        {primaryFilter === "speaker-topics" && (
          <span>
            Find out which speakers debating on:{" "}
            <span className="dynamic-content">{inputValues.topics || "key phrase"}</span> in their speeches
          </span>
        )}

        {primaryFilter === "debate-phrase" && (
          <span>
            Find out which debates include the phrase:{" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span>
          </span>
        )}
        {primaryFilter === "debate-session" && (
          <span>
            Discover debates with parliament session:{" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span>
          </span>
        )}
        {primaryFilter === "debate-date" && (
          <span>
            Discover debates from {" "}
            <span className="dynamic-content">{inputValues.startDate || "start date"} </span>
            to <span className="dynamic-content">{inputValues.endDate || "end date"}</span>
          </span>
        )}
        {primaryFilter === "debate-topics" && (
          <span>
            Find out which speakers have said:{" "}
            <span className="dynamic-content">{inputValues.keyPhrase || "key phrase"}</span> in their speeches
          </span>
        )}

        {primaryFilter === "all-speakers" && (
          <span>You are currently browsing all speakers</span>
        )}
        {primaryFilter === "all-debates" && (
          <span>You are currently browsing all debates</span>
        )}
      </h1>

      <div className="buttonContainer">
        {renderOptionContent(primaryFilter, inputValues, onInputChange)}
        {(primaryFilter !== "all-speakers" && primaryFilter !== "all-debates" ) && (
          <>
            <button onClick={handleSearch}>Search</button>
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
