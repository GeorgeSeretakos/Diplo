import React from "react";
import styles from "./DebateCard.module.css";
import {useRouter} from "next/navigation";

const DebateCard = ({ date, topics, session }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/debates/${id}`); // Navigate to the debate metadata page
  }

  return (
    <div className={styles.debateCard} onClick={handleClick}>
      <div className={styles.date}>{date}</div>
      <div className={styles.topics}>
        <strong>Topics:</strong> {topics.join(", ")}
      </div>
      <div className={styles.session}>
        <strong>Parliament Session:</strong> {session}
      </div>
    </div>
  );
};

export default DebateCard;
