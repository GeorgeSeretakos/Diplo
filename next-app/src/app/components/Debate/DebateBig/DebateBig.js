import React, { useState } from "react";
import styles from "./DebateBig.module.css";
import Link from "next/link";

const DebateBig = ({ documentId, speaker_name, score, topics, content, title, session, period, meeting, style }) => {

  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 300; // Show only first 200 characters initially

  return (
    <div style={style} className={styles.debateCard}>
      <Link href={`/debate/${documentId}/metadata`} className="link">

        {/* Debate Title */}
        <div className={styles.date}>{title}</div>

        {/* Topics */}
        {topics && topics.length > 0 && (
          <div className={styles.topics}>
            <strong>Topics:</strong> {topics.map((t) => t.topic).join(", ")}
          </div>
        )}

        {/* Session Details */}
        <div className={styles.session}>
          <p><strong>Session:</strong> {session}</p>
          <p><strong>Meeting:</strong> {meeting}</p>
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
            {content.length > MAX_LENGTH && (
              <button
                className={styles.readMore}
                onClick={(e) => {
                  e.preventDefault();
                  setExpanded(!expanded);
                }}
              >
                {expanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        )}



      </Link>
    </div>
  );
};

export default DebateBig;
