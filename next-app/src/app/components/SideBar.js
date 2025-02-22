'use client';

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Landmark } from "lucide-react";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-white w-full">
      {/* Top Bar Section */}
      <div className="flex items-center justify-evenly p-4">
        {/* Clickable Title */}
        <Link href={"/"} className="flex items-center space-x-2 text-xl font-bold">
          <div className="flex items-center gap-1">
            <Landmark size={38} className="text-white" />
            <span className="text-2xl">Debates Portal</span>
          </div>
        </Link>

        {/* Overlay (Background Blur) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)} // Clicking outside closes sidebar
          ></div>
        )}

        {/* Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-[30%] h-full bg-[#1E1F23] transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b-2">
          <div className="flex items-center gap-1">
            <Landmark size={38} className="text-white"/>
            <span className="text-2xl">Debates Portal</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white">
            <X size={24}/>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 text-s space-y-4">
          <Link href={"/"} className="block p-2 hover:bg-gray-700 rounded">Home</Link>
          <Link href={"/browse-debates"} className="block p-2 hover:bg-gray-700 rounded">Debates</Link>
          <Link href={"/browse-speakers"} className="block p-2 hover:bg-gray-700 rounded">Speakers</Link>
        </nav>
      </div>
    </div>
  );
}
