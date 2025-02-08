import React from "react";
import styles from "./DebateBig.module.css";
import Link from "next/link";

const DebateBig = ({ documentId, speaker_name, score, topics, content, title, session, period, meeting, style }) => {

  console.log("DocumentId: ", documentId);

  return (
      <div style={style} className={styles.debateCard}>
        <Link href={`/debate/${documentId}/metadata`} className="link">
          <div className={styles.date}>{title}</div>

          {topics && <div className={styles.topics}>
            <strong>Topics:</strong>{" "}
            {topics.map((t) => t.topic).join(", ")}
          </div>}

          <div className={styles.session}>
            <p><strong>Session:</strong> {session}</p>
            <p><strong>Meeting:</strong> {meeting}</p>
            <p><strong>Period:</strong> {period}</p>
          </div>

          {score && <div className={styles.session}>
            <p><strong>Score:</strong> {score}</p>
          </div>}

          {speaker_name && <div className={styles.session}>
            <p><strong>Speaker name:</strong> {speaker_name}</p>
          </div>}

          {content && <div dangerouslySetInnerHTML={{__html: content}}/>}
        </Link>
      </div>
  );
};

export default DebateBig;
