'use client';

import {useState} from 'react';
import SwitchTab from '@components/SwitchTab.js';
import SpeakerBioPage from "./bio/SpeakerBioPage.js";
import SpeakerSpeechesPage from "./speeches/SpeakerSpeechesPage.js";

export default function SpeakerPage() {
  const [activeTab, setActiveTab] = useState('Speaker Bio');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  console.log("Active Tab changed to:", activeTab);

  return (
    <div className="relative min-h-screen text-white bg-transparent overflow-x-hidden">
      {/* Background */}
      <div className="backgroundContainer"></div>

      {/* Top Navigation */}
      <SwitchTab
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={["Speaker Bio", "Speaker Speeches"]}
      />

      {/* Content */}
      <div className="flex justify-center">
        {activeTab === 'Speaker Bio' && <SpeakerBioPage />}
        {activeTab === 'Speaker Speeches' && <SpeakerSpeechesPage />}
      </div>
    </div>
  );
}
