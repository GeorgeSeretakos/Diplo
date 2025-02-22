'use client';

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./BrowseSpeakers.module.css";
import SearchSection from "@/app/components/Sections/Browse Pages/SearchSection";

const BrowseSpeakers = () => {
    const router = useRouter();

    return (
        <div className={styles.pageLayout}>

            <div className={styles.leftSection}>
                <h2 className="font-bold text-4xl mb-4">Speakers</h2>
                <p className="font-bold">
                    Find speakers based on their name, the topics they discussed,
                    a key-phrase they said, the political party
                    they belong and combinations of these filter.
                </p>
                <div className="buttonContainer">
                    <button className="button mt-4" onClick={() => router.push("search-speakers")}>Browse Speakers</button>
                </div>
            </div>

            <div className={styles.sections}>
                {/* Section 1: Find by Name */}
                <SearchSection
                    title="Speaker Name"
                    imageUrl="/images/politicians/speakers.webp"
                />

                {/* Section 2: Browse by Party */}
                <SearchSection
                    title="Political Party"
                    imageUrl="/images/parties/parties.jpg"
                />

                {/* Section 3: Find by Key Phrase */}
                <SearchSection
                    title="Key Phrase"
                    imageUrl="/images/politicians/key-phrase.jpg"
                />

                {/* Section 4: Browse by Topic */}
                <SearchSection
                    title="Topic"
                    imageUrl="/images/topics/topics.jpg"
                />
            </div>
        </div>
    );
};

export default BrowseSpeakers;
