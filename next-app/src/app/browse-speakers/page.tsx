'use client';

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./BrowseSpeakers.module.css";
import SearchSection from "@/app/components/Sections/Browse Pages/SearchSection";

const BrowseSpeakers = () => {
    const router = useRouter();

    const handleFilterSelection = (filterType) => {
        router.push(`/speakers-results?primaryFilter=${encodeURIComponent(filterType)}`);
    };

    return (
        <div className={styles.pageLayout}>

            <div className={styles.leftSection}>
                <h2>Browse speakers</h2>
                <p>
                    Choose your initial filter and start searching for your favorite speakers.
                    Once applied, you will be able to narrow down your search applying more
                    specific filters, such as age, gender and more.
                </p>
                <div className="buttonContainer">
                    <button className="button" onClick={() => handleFilterSelection("all")}>Browse all</button>
                    <button className="button" onClick={() => router.push("/")}>Go Back</button>
                </div>
            </div>

            <div className={styles.sections}>
                {/* Section 1: Find by Name */}
                <SearchSection
                    title="Speaker Name"
                    imageUrl="/images/politicians/speakers.webp"
                    description="Click to search for speakers based on their name"
                    onButtonClick={() => handleFilterSelection("name")}
                />

                {/* Section 2: Browse by Party */}
                <SearchSection
                    title="Political Party"
                    imageUrl="/images/parties/parties.jpg"
                    description="Click to browse speakers grouped by their political party"
                    onButtonClick={() => handleFilterSelection("speaker-party")}
                />

                {/* Section 3: Find by Key Phrase */}
                <SearchSection
                    title="Key Phrase"
                    imageUrl="/images/politicians/key-phrase.jpg"
                    description="Click to search for speakers who have said a specific phrase"
                    onButtonClick={() => handleFilterSelection("speaker-phrase")}
                />

                {/* Section 4: Browse by Topic */}
                <SearchSection
                    title="Topic"
                    imageUrl="/images/topics/topics.jpg"
                    description="Click to browse speakers debating specific topics"
                    onButtonClick={() => handleFilterSelection("speaker-topic")}
                />
            </div>
        </div>
    );
};

export default BrowseSpeakers;
