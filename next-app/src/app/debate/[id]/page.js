'use client';

import {useState} from 'react';
import SwitchTab from '@components/SwitchTab.js';
import DebateMetadataPage from './metadata/DebateMetadataPage.js';
import DebateContentPage from './content/DebateContentPage.js';

export default function DebatePage() {
  const [activeTab, setActiveTab] = useState('Πλήρες Περιεχόμενο Συνεδρίασης');

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
        tabs={["Μεταδεδομένα Συνεδρίασης", "Πλήρες Περιεχόμενο Συνεδρίασης"]}
      />


      {/* Content */}
      <div className="flex justify-center">
        {activeTab === 'Μεταδεδομένα Συνεδρίασης' && <DebateMetadataPage />}
        {activeTab === 'Πλήρες Περιεχόμενο Συνεδρίασης' && <DebateContentPage />}
      </div>
    </div>
  );
}
