'use client';

import React from 'react';

export default function SwitchTab({ activeTab, onTabChange, tabs }) {
  return (
    <div className="flex justify-center space-x-4 bg-transparent py-2 mt-[8rem] mb-[2rem]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-2 font-semibold rounded-3xl border transition 
            ${
            activeTab === tab
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
          }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
