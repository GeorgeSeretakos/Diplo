import React from "react";
import styles from "./DebateCard.module.css";
import Link from "next/link";

const DebateCard = ({ documentId, title, topics, session, period, meeting }) => {

  console.log("DocumentId: ", documentId);

  return (
      <div className={styles.debateCard}>
        <Link href={`/debate/${documentId}/metadata`} className="link">
          <div className={styles.date}>{title}</div>
          {/*<div className={styles.topics}>*/}
          {/*  <strong>Topics:</strong>{" "}*/}
          {/*  {topics.map((t) => t.topic).join(", ")} /!* Extract topic values and join *!/*/}
          {/*</div>*/}
          {/*<div className={styles.session}>*/}
          {/*  <p><strong>Session:</strong> {session}</p>*/}
          {/*  <p><strong>Meeting:</strong> {meeting}</p>*/}
          {/*  <p><strong>Period:</strong> {period}</p>*/}
          {/*</div>*/}
        </Link>
      </div>
  );
};

export default DebateCard;
