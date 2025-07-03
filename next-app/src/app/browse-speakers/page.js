'use client';

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./BrowseSpeakers.module.css";
import HomePageSection from "@components/HomePageSection/HomePageSection.js"

const BrowseSpeakers = () => {
    const router = useRouter();

    return (
        <div className={styles.pageLayout}>

            <div className={`${styles.leftSection}`} style={{textAlign: "left"}}>
                <h2 className="font-bold text-4xl mb-4">Πολιτικά Πρόσωπα</h2>
                <p className="font-bold">
                    Ανακαλύψτε πληροφορίες για πολιτικά πρόσωπα, το έργο και τις τοποθετήσεις τους, μέσα από τις ομιλίες
                    και τις θεματικές ενότητες στις οποίες συμμετείχαν.
                </p>
                <div className="w-full">
                    <button className="button mt-4" onClick={() => router.push("search-speakers")}>Αναζήτηση Ομιλητών
                    </button>
                </div>
            </div>

            <div className={styles.sections}>
                {/* Section 1: Find by Name */}
                <HomePageSection
                    title="Όνοματεπώνυμο"
                    imageUrl="/images/politicians/politicians.jpg"
                />

                {/* Section 2: Browse by Party */}
                <HomePageSection
                    title="Πολιτικό Κόμμα"
                    imageUrl="/images/parties/political-parties.jpg"
                />

                {/* Section 3: Find by Key Phrase */}
                <HomePageSection
                    title="Λέξη / Φράση-κλειδί"
                    imageUrl="/images/debates/key-phrase.webp"
                />

                {/* Section 4: Browse by Topic */}
                <HomePageSection
                    title="Συναισθηματικό Φορτίο"
                    imageUrl="/images/politicians/key-phrase.jpg"
                />
            </div>
        </div>
    );
};

export default BrowseSpeakers;
