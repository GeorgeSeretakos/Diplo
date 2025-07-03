import React from "react";
import FilterSection from "./FilterSection.js";
import periodsWithSessions from "/public/data/periods_with_sessions.json";

const SessionFilter = ({ session, handleInputChange }) => {

  return (
    <>
      <FilterSection title="Σύνοδος / Περίοδος">
        <select
          id="session-period"
          className="text-xs bg-transparent border-2 border-white text-white w-full"
          value={session}
          onChange={(e) => handleInputChange("session", e.target.value)}
        >
          <option value="">-- Επιλέξτε Σύνοδο / Περίοδο --</option>
          {periodsWithSessions.map((group, index) => (
            <React.Fragment key={index}>
              <option disabled className="bg-white text-black font-bold">
                ── {group.period} ──
              </option>
              {group.sessions.map((sessionLabel, idx) => (
                <option key={idx} value={sessionLabel}>
                  {sessionLabel}
                </option>
              ))}
            </React.Fragment>
          ))}
        </select>
      </FilterSection>
    </>
  );
};

export default SessionFilter;
