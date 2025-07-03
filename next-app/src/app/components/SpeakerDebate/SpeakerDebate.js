import React from 'react';
import SpeakerCard from "../Speaker/SpeakerCard/SpeakerCard.js";
import Debate from "../Debate/Debate.js";

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
  }) => {

  return (
    <div className="flex items-center justify-center w-full gap-4">
      {/* SpeakerCard - 1/4 */}
      <div
        className="w-1/4 flex justify-center"
      >
        <SpeakerCard documentId={speakerId} image={speakerImage} name={speakerName} />
      </div>

      {/* Debate - 3/4 */}
      <div
        className="w-3/4"
      >
        <Debate
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
