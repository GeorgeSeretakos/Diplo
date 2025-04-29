'use client';

import {useState} from 'react';
import SwitchTab from '@components/SwitchTab.js';
import DebateMetadataPage from './metadata/DebateMetadataPage.js';
import DebateContentPage from './content/DebateContentPage.js';

export default function DebatePage() {
  const [activeTab, setActiveTab] = useState('Metadata');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  console.log("Active Tab changed to:", activeTab);

  return (
    <div className="relative min-h-screen mt-20 text-white bg-transparent overflow-x-hidden">
      {/* Background */}
      <div className="backgroundContainer"></div>

      {/* Top Navigation */}
      <SwitchTab
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={["Metadata", "Search Content"]}
      />


      {/* Content */}
      <div className="flex justify-center">
        {activeTab === 'Metadata' && <DebateMetadataPage />}
        {activeTab === 'Search Content' && <DebateContentPage />}
      </div>
    </div>
  );
}
