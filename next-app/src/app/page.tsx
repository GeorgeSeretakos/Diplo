import SpeakersSection from "@/app/components/Sections/Home Page/SpeakerSection/SpeakersSection";
import ActionButtonsSection from "@/app/components/Sections/Home Page/ActionButtonsSection/ActionButtonsSection";
import DebatesSection from "@/app/components/Sections/Home Page/DebatesSection/DebatesSection";
import TopicsSection from "@/app/components/Sections/Home Page/TopicsSection/TopicsSection";

export default function Home() {
    return (
        <div style={{ width: "100%"}}>
            {/* Video Section */}
            <div className="videoContainer">
                <video
                    src="/videos/parliament/vouli.mp4"
                    autoPlay
                    muted
                    loop
                    className="video"
                />
                {/* Title Overlay */}
                <div className="videoOverlay">
                    <h1 className="mainTitle">Welcome to the Greek Parliament Debates Portal</h1>
                    <h2 className="video-subtitle">Search and explore debates, speakers, and topics from past and current sessions</h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="content">
                <SpeakersSection />
                <DebatesSection />
                <TopicsSection />
            </div>
        </div>
    );
}
