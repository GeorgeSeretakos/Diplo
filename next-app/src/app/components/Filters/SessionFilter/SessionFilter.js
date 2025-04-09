import React, { useState, useEffect } from "react";
import FilterSection from "../FilterSection.js";

const SessionFilter = ({ session, period, meeting, handleInputChange }) => {

  const [sessions, setSessions] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchParliamentSessionAttributes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/strapi/parliamentSession/uniqueAttributes`);
        const data = await response.json();

        setSessions(data.sessions || []);
        setPeriods(data.periods || []);
        setMeetings(data.meetings || []);
      } catch (error) {
        console.error("Error fetching unique attributes:", error);
      }
    };
    fetchParliamentSessionAttributes();
  }, []);

  return (
    <>
      <FilterSection title="Session">
        <select id="session" className="text-xs bg-transparent border-2 border-white" value={session}
                onChange={(e) => handleInputChange("session", e.target.value)}>
          <option value="">-- Select Session --</option>
          {sessions.map((session, index) => (
            <option key={index} value={session}>
              {session}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Period">
        <select id="period" className="text-xs bg-transparent border-2 border-white" value={period}
                onChange={(e) => handleInputChange("period", e.target.value)}>
          <option value="">-- Select Period --</option>
          {periods.map((period, index) => (
            <option key={index} value={period}>
              {period}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Meeting">
        <select id="meeting" className="text-xs bg-transparent border-2 border-white" value={meeting}
                onChange={(e) => handleInputChange("meeting", e.target.value)}>
          <option value="">-- Select Meeting --</option>
          {meetings.map((meeting, index) => (
            <option key={index} value={meeting}>
              {meeting}
            </option>
          ))}
        </select>
      </FilterSection>
    </>
  );
};

export default SessionFilter;
