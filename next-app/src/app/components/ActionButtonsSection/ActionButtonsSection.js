import React from "react";
import styles from "./ActionButtonsSection.module.css";

const ActionButtonsSection = () => {
  return (
    <div className={styles.actionButtonsSection}>
      {/* Left Action Buttons */}
      <div className={styles.actionButtons}>
        <div className={styles.actionButton} title="Filter Debates">
          <img src="/icons/filter.svg" alt="Filter Debates" className={styles.icon}/>
        </div>
        <div className={styles.actionButton} title="Sort by Date">
          <img src="/icons/sort.svg" alt="Sort by Date" className={styles.icon}/>
        </div>
        <div className={styles.actionButton} title="Search Topics">
          <img src="/icons/search.svg" alt="Search Topics" className={styles.icon}/>
        </div>
        <div className={styles.actionButton} title="View Statistics">
          <img src="/icons/stats.svg" alt="View Statistics" className={styles.icon}/>
        </div>
      </div>

      {/* Search Bar */}
      <div className="inputContainer">
        <input type="text" placeholder="Search debates with key-phrase ..." style={{width: 400}}/>
        <button>Search</button>
      </div>

      {/* Right Action Buttons */}
      <div className={styles.actionButtons}>
        <div className={styles.actionButton} title="User Profile">
          <img src="/icons/user.svg" alt="User Profile" className={styles.icon}/>
        </div>
        <div className={styles.actionButton} title="Notifications">
          <img src="/icons/notifications.svg" alt="Notifications" className={styles.icon}/>
        </div>
        <div className={styles.actionButton} title="Settings">
          <img src="/icons/settings.svg" alt="Settings" className={styles.icon}/>
        </div>
      </div>
    </div>
  );
};

export default ActionButtonsSection;
