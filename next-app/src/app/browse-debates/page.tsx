'use client';

import React from "react";
import { useRouter } from "next/navigation";
import styles from "../browse-speakers/BrowseSpeakers.module.css";
import SearchSection from "@/app/components/Sections/Browse Pages/SearchSection";

const BrowseSpeakers = () => {
    const router = useRouter();

    const handleFilterSelection = (filterType) => {
        router.push(`/debates-results?primaryFilter=${encodeURIComponent(filterType)}`);
    };

    return (
        <div className={styles.pageLayout}>

            <div className={styles.sections}>
                {/* Section 1: Find by Name */}
                <SearchSection
                    title="Debate Date"
                    imageUrl="/images/debates/date.jpg"
                    description="Click to search for debates based on their date"
                    onButtonClick={() => handleFilterSelection("date")}
                />

                {/* Section 2: Find by Key Phrase */}
                <SearchSection
                    title="Key Phrase"
                    imageUrl="/images/debates/key-phrase.jpg"
                    description="Click to search for debates mentioning a specific phrase"
                    onButtonClick={() => handleFilterSelection("phrase")}
                />

                {/* Section 3: Browse by Topic */}
                <SearchSection
                    title="Parliament Session"
                    imageUrl="/images/debates/parliament-session.jpg"
                    description="Click to browse debates based on parliament session"
                    onButtonClick={() => handleFilterSelection("topics")}
                />

                {/* Section 4: Browse by Party */}
                <SearchSection
                    title="Debate Topic"
                    imageUrl="/images/debates/topics.png"
                    description="Click to browse debates grouped by their political party"
                    onButtonClick={() => handleFilterSelection("party")}
                />

            </div>

            <div className={`${styles.leftSection} ${styles.leftSectionInDebates}`}>
                <h2>Browse debates</h2>
                <p>
                    Choose your initial filter and start searching for your favorite debates.
                    Once applied, you will be able to narrow down your search applying more
                    specific filters, such as participating speakers, participating parties, parliament session and
                    more.
                </p>
            </div>
        </div>
    );
};

export default BrowseSpeakers;
