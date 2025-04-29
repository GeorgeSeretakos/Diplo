import React from 'react';
import SpeakerCard from "../Speaker/SpeakerCard/SpeakerCard.js";
import DebateBig from "../Debate/DebateBig/DebateBig.js";
import useSearchFilters from "../../../stores/searchFilters.js";

const SpeakerDebate = ({
                         speakerId,
                         speakerName,
                         speakerImage,
                         debateId,
                         topics,
                         content,
                         session_date,
                         date,
                         session,
                         period,
                         meeting,
                         currentFilters,
                       }) => {
  const setFilters = useSearchFilters((state) => state.setFilters);

  const handleSpeakerClick = () => {
    setFilters(currentFilters)
  }

  const handleDebateClick = () => {
    setFilters(currentFilters)
  }

  return (
    <div className="flex items-center justify-center w-full gap-4">
      {/* SpeakerCard - 1/4 */}
      <div
        className="w-1/4 flex justify-center"
        onClick={handleSpeakerClick}
      >
        <SpeakerCard documentId={speakerId} image={speakerImage} name={speakerName} />
      </div>

      {/* DebateBig - 3/4 */}
      <div
        className="w-3/4"
        onClick={handleDebateClick}
      >
        <DebateBig
          documentId={debateId}
          speaker_name={speakerName}
          topics={topics}
          content={content}
          session_date={session_date}
          date={date}
          session={session}
          period={period}
          meeting={meeting}
        />
      </div>
    </div>
  )
}

export default SpeakerDebate;
