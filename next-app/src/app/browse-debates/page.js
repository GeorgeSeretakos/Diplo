'use client';

import React from "react";
import { useRouter } from "next/navigation";
import styles from "../browse-speakers/BrowseSpeakers.module.css";
import SearchSection from "@components/Sections/Browse Pages/SearchSection.js"

const BrowseSpeakers = () => {
    const router = useRouter();

    return (
        <div className={styles.pageLayout}>

            <div className={styles.sections}>
                {/* Section 1: Find by Name */}
                <SearchSection
                    title="Εύρος Ημερομηνιών"
                    imageUrl="/images/debates/date.jpg"
                    description="Click to search for debates based on their date"
                />

                {/* Section 2: Find by Key Phrase */}
                <SearchSection
                    title="Συμμετέχοντες Ομιλητές"
                    imageUrl="/images/politicians/speakers.webp"
                    description="Click to search for debates mentioning a specific phrase"
                />

                {/* Section 3: Browse by Topic */}
                <SearchSection
                    title="Κοινοβουλευτική Σύνοδος"
                    imageUrl="/images/debates/parliament-session.jpg"
                    description="Click to browse debates based on parliament session"
                />

                {/* Section 4: Browse by Party */}
                <SearchSection
                    title="Θέματα Συζήτησης"
                    imageUrl="/images/debates/topics.png"
                    description="Click to browse debates grouped by their political party"
                />

            </div>

            <div className={`${styles.leftSection} ${styles.leftSectionInDebates}`}>
                <h2 className="font-bold text-4xl mb-4">Κοινοβουλευτικά Πρακτικά</h2>
                <p className="font-bold">
                    Περιηγηθείτε σε πρακτικά συνεδριάσεων της Βουλής, αναζητώντας περιεχόμενο που σας ενδιαφέρει βάσει θεματικής, χρονικής περιόδου ή παρεμβάσεων συγκεκριμένων ομιλητών.
                </p>
                <div className="w-full flex justify-end">
                    <button className="button mt-4" onClick={() => router.push("/search-debates")}>Αναζήτηση Πρακτικών</button>
                </div>
            </div>
        </div>
    );
};

export default BrowseSpeakers;
