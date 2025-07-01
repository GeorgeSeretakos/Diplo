'use client';

import { useState, useEffect } from "react";
import BrowseDebates from "@/app/browse-debates/page";
import BrowseSpeakers from "@/app/browse-speakers/page";
import "./styles/globals.css";
import { CgScrollV } from "react-icons/cg";

export default function Home() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) { // Adjust threshold
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={{ width: "100%", color: "white" }}>
            {/* 🎥 Video Section */}
            <div className={`videoContainer ${scrolled ? "scrolled" : ""}`}>
                <video
                    src="/videos/parliament/vouli.mp4"
                    autoPlay
                    muted
                    loop
                    className="video"
                />
                {/* Title Overlay */}
                <div className={`videoOverlay ${scrolled ? "hidden" : ""}`}>
                    <h1 className="text-2xl font-bold">Καλώς ήρθατε στην Πύλη Πρακτικών της Ελληνικής Βουλής</h1>
                    <h2 className="text-sm mt-2 text-center">
                        Περιηγηθείτε σε συνεδριάσεις, ομιλητές και θεματικές ενότητες από το παρελθόν και το παρόν.
                        <br/>
                        <span
                            className="text-yellow-300 font-semibold">Κάντε κύλιση προς τα κάτω για να ξεκινήσετε</span>
                    </h2>
                    <div className="flex justify-center fixed mt-6 left-1/2">
                        <CgScrollV size={30}/>
                    </div>
                </div>
            </div>

            {/* 📜 Main Content */}
            <div className="content">
                <BrowseDebates/>
                <BrowseSpeakers/>
            </div>
        </div>
    );
}
