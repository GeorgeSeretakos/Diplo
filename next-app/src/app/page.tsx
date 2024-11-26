import HeroSection from "@/app/components/HeroSection/HeroSection";
import SpeakersSection from "@/app/components/BelowHeroSection/SpeakersSection";
import ActionButtonsSection from "@/app/components/ActionButtonsSection/ActionButtonsSection";
import {colors} from "@/utils/colors";

export default function Home() {
  return (
      <div style={{ width: "100%"}}>

          {/* Video Section */}
          <div className="videoContainer">
              <video
                src="/videos/vouli.mp4"
                autoPlay
                muted
                loop
                className="video"
              />
              {/* Title Overlay */}
              <div className="videoOverlay">
                  <h1 className="mainTitle">Welcome to the Greek Parliament Debates Portal</h1>
                  <h2 className="subtitle">Search and explore debates, speakers, and topics from past and current sessions</h2>
              </div>
          </div>

          {/* Main Content */}
          <div className="content">
              {/*<HeroSection />*/}
              <SpeakersSection />
              <SpeakersSection />
              <SpeakersSection />
              <ActionButtonsSection />
          </div>

      </div>
  );
}
