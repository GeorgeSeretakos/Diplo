'use client';

import {useState} from 'react';
import SwitchTab from '@components/SwitchTab.js';
import SpeakerBioPage from "./bio/SpeakerBioPage.js";
import SpeakerSpeechesPage from "./speeches/SpeakerSpeechesPage.js";

export default function SpeakerPage() {
  const [activeTab, setActiveTab] = useState('Προσωπικά Στοιχεία Ομιλητή');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="relative min-h-screen text-white bg-transparent overflow-x-hidden">
      <div className="backgroundContainer"></div>

      <SwitchTab
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={["Προσωπικά Στοιχεία Ομιλητή", "Κοινοβουλευτικές Συμμετοχές Ομιλητή"]}
      />

      <div className="flex justify-center">
        {activeTab === 'Προσωπικά Στοιχεία Ομιλητή' && <SpeakerBioPage />}
        {activeTab === 'Κοινοβουλευτικές Συμμετοχές Ομιλητή' && <SpeakerSpeechesPage />}
      </div>
    </div>
  );
}