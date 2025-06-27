import React, { useState } from "react";
import styles from "./DebateBig.module.css";
import Link from "next/link";
import useSearchFilters from "../../../../stores/searchFilters.js";

const DebateBig = ({
  documentId,
  speaker_name,
  score,
  topics,
  content,
  session_date,
  date,
  session,
  period,
  meeting,
  style,
  currentFilters,
}) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 300;
  const setFilters = useSearchFilters((state) => state.setFilters);

  return (
      <Link
        href={`/debate/${documentId}`}
        onClick={() => setFilters(currentFilters)}
        className={styles.debateCard}
        style={style}
      >

        {/* Debate Title */}
        <div className={styles.date}>{date}</div>

        {/* Topics */}
        {topics && topics.length > 0 && (
          <div className={styles.topics}>
            <strong>Topics:</strong> {topics.map((t) => t.topic).join(", ")}
          </div>
        )}

        {/* Session Details */}
        <div className={styles.session}>
          {/*<p><strong>Meeting:</strong> {meeting}</p>*/}
          <p><strong>Session:</strong> {session}</p>
          <p><strong>Period:</strong> {period}</p>
        </div>

        {/* Score */}
        {score && (
          <div className={styles.score}>
            <p><strong>Score:</strong> {score}</p>
          </div>
        )}

        {/* Speaker and Content Preview */}
        {speaker_name && content && (
          <div className={styles.speaker}>
            <strong>{speaker_name}: </strong>
            <span
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: expanded ? content : content.slice(0, MAX_LENGTH) }}
            />
            {content.length > MAX_LENGTH && <span> ... </span>}
            {/*{content.length > MAX_LENGTH && (*/}
            {/*  <button*/}
            {/*    className={styles.readMore}*/}
            {/*    onClick={(e) => {*/}
            {/*      e.preventDefault();*/}
            {/*      setExpanded(!expanded);*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    {expanded ? "Show Less" : "Read More"}*/}
            {/*  </button>*/}
            {/*)}*/}
          </div>
        )}
      </Link>
  );
};

export default DebateBig;
