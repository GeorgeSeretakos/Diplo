import React from "react";
import styles from "./DebateCard.module.css";
import Link from "next/link";

const DebateCard = ({ documentId, date, topics, session, period, meeting }) => {

  console.log("DocumentId: ", documentId);

  return (
    <Link href={`/debate/${documentId}/metadata`} className="link">
      <div className={styles.debateCard}>
        <div className={styles.date}>{date}</div>
        <div className={styles.topics}>
          <strong>Topics:</strong>{" "}
          {topics.map((t) => t.topic).join(", ")} {/* Extract topic values and join */}
        </div>
        <div className={styles.session}>
          <p><strong>Session:</strong> {session}</p>
          <p><strong>Meeting:</strong> {meeting}</p>
          <p><strong>Period:</strong> {period}</p>
        </div>
      </div>
    </Link>
  );
};

export default DebateCard;
