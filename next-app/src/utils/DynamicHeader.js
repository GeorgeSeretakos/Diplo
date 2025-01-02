import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import TopicFilter from "../app/components/Filters/TopicFilter/TopicFilter.js";


const DynamicHeader = ({ primaryFilter, onSearch, resetSearch, inputValues, onInputChange }) => {
  const router = useRouter();

  const [sessions, setSessions] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);


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
        const handleFilterChange = (updatedTopics) => {
          setSelectedTopics(updatedTopics); // Update the selected topics state
          handleInputChange("topics", updatedTopics); // Sync with parent state
          console.log("Selected Topics:", updatedTopics); // Debugging
        };

        return (
          <header>
            <div>
              <h1>Explore Topics</h1>
              <TopicFilter
                selectedTopics={selectedTopics} // Ensure selectedTopics is defined
                onFilterChange={handleFilterChange} // Pass the change handler
              />
            </div>
          </header>
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
      case "debate-session":
        useEffect(() => {
          const fetchParliamentSessionAttributes = async () => {
            try {
              const response = await fetch("/api/strapi/parliamentSession/uniqueAttributes");
              const data = await response.json();

              // Update state with fetched data
              setSessions(data.sessions || []);
              setPeriods(data.periods || []);
              setMeetings(data.meetings || []);
            } catch (error) {
              console.error("Error fetching unique attributes:", error.message);
            }
          };

          fetchParliamentSessionAttributes();
        }, []);
        return (
          <div className="inputContainer query">
              {/* Session Input */}
              <div>
                <label htmlFor="session">Session:</label>
                <select id="session" value={inputValues.session} onChange={(e) => handleInputChange("session", e.target.value)}>
                  <option value="">-- Select Session --</option>
                  {sessions.map((session, index) => (
                    <option key={index} value={session}>
                      {session}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Input */}
              <div>
                <label htmlFor="period">Period:</label>
                <select id="period" value={inputValues.period} onChange={(e) => handleInputChange("period", e.target.value)}>
                  <option value="">-- Select Period --</option>
                  {periods.map((period, index) => (
                    <option key={index} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meeting Input */}
              <div>
                <label htmlFor="meeting">Meeting:</label>
                <select id="meeting" value={inputValues.meeting} onChange={(e) => handleInputChange("meeting", e.target.value)}>
                  <option value="">-- Select Meeting --</option>
                  {meetings.map((meeting, index) => (
                    <option key={index} value={meeting}>
                      {meeting}
                    </option>
                  ))}
                </select>
              </div>
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
            Discover debates within the following parliament session:
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
