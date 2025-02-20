'use client';

import { useState, useEffect } from "react";
import BrowseDebates from "@/app/browse-debates/page";
import BrowseSpeakers from "@/app/browse-speakers/page";
import "./styles/globals.css";

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
                    <h1 className="mainTitle">Welcome to the Greek Parliament Debates Portal</h1>
                    <h2 className="video-subtitle">Search and explore debates, speakers, and topics from past and current sessions</h2>
                </div>
            </div>

            {/* 📜 Main Content */}
            <div className="content">
                <BrowseDebates />
                <BrowseSpeakers />
            </div>
        </div>
    );
}
