'use client';

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Landmark, Search } from "lucide-react";

export default function NavigationBar({
title,
showSearch = false,
placeholder = '',
onFilterChange = () => {},
setSortBy = () => {},
setPage = () => {},
showSortBy = false,
imageUrl
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onFilterChange(value);
  };

  const handleClear = () => {
    setQuery("");
    onFilterChange("");
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className="flex fixed top-0 left-0 w-full justify-between items-center p-4 px-8 border-b border-white bg-black text-white z-50">

      <div className="flex items-center gap-4 w-2/5">
        <div className="text-white flex items-center gap-2">
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            ></div>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white flex items-center gap-2">
            <Landmark size={38} className="text-white"/>
          </button>

          {!isOpen &&
            <div className="w-full">
              <span className="text-xl font-bold">{title}</span>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Speaker"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
          }

        </div>

        {/* Sidebar content */}
        <div
          className={`fixed top-0 left-0 w-[30%] h-full bg-[#1E1F23] transition-transform transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b-2">
            <Landmark size={38} className="text-white"/>
            <span className="text-2xl font-bold">Πρακτικά Βουλής</span>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X size={24}/>
            </button>
          </div>

          <nav className="p-4 text-s space-y-4">
            <Link href="/" className="block p-2 hover:bg-gray-700 rounded">Αρχική</Link>
            <Link href="/search-debates" className="block p-2 hover:bg-gray-700 rounded">Αναζήτηση Πρακτικών</Link>
            <Link href="/search-speakers" className="block p-2 hover:bg-gray-700 rounded">Αναζήτηση Ομιλητών</Link>
          </nav>
        </div>
      </div>

      {/* Search bar (optional) */}
      {showSearch && (
        <div className="flex w-3/5 items-center justify-end gap-3">
          {/* Search input container */}
          <div className="relative flex justify-center w-full">
            <input
              type="text"
              placeholder={placeholder}
              className="w-full bg-[#1E1F23] text-white pr-20 pl-4 py-2 rounded-xl border-white border-0"
              value={query}
              onChange={handleSearch}
            />
            {/* Clear button */}
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18}/>
              </button>
            )}
            {/* Search icon (disabled button) */}
            <button
              disabled
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white"
            >
              <Search size={18}/>
            </button>
          </div>

          {/* Sort select (only if showSortBy = true) */}
          {showSortBy && (
            <div className="flex items-center w-1/2">
              <span className="text-white w-full font-semibold">Ταξινόμηση</span>
              <select
                className="bg-[#1E1F23] text-white text-xs p-2 rounded-lg outline-none border-none w-full"
                onChange={handleSortChange}
              >
                <option value="newest">Νεώτερα</option>
                <option value="oldest">Παλαιότερα</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
