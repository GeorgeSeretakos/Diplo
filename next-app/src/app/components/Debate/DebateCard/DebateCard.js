import React from "react";
import styles from "./DebateCard.module.css";
import Link from "next/link";

const DebateCard = ({ documentId, date, topics, session }) => {

  console.log("DocumentId: ", documentId);

  return (
    <Link href={`/debate/${documentId}/metadata`} className="link">
      <div className={styles.debateCard}>
        <div className={styles.date}>{date}</div>
        <div className={styles.topics}>
          <strong>Topics:</strong> {topics.join(", ")}
        </div>
        <div className={styles.session}>
          <strong>Parliament Session:</strong> {session}
        </div>
      </div>
    </Link>
  );
};

export default DebateCard;
