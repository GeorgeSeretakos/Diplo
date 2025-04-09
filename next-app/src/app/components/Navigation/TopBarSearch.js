import { useState } from "react";
import { Search, X } from "lucide-react";

const TopBarSearch = ({onFilterChange, setSortBy, setPage, placeholder}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onFilterChange(value);
  };

  const handleX = () => {
    setQuery("");
    onFilterChange("")
  }

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setPage(1);
  }


  return (
    <div className="flex items-center justify-between gap-3 w-full">

      {/* Search Input Container */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-gray text-white pr-20 pl-4 py-2 rounded-3xl border-none border-b-2 outline-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none"
          value={query}
          onChange={handleSearch}
        />

        {/* Clear Button (X) */}
        {query && (
          <button
            onClick={handleX}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18}/>
          </button>
        )}

        {/* Search Button Inside Input */}
        <button
          disabled
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white"
        >
          <Search size={18}/>
        </button>
      </div>

      {/* Sort By Section */}
      <div className="flex items-center gap-4">
        <span className="text-white w-full font-semibold">Sort By</span>
        <select
          className="bg-gray text-white text-xs p-2 rounded-lg outline-none border border-gray-600 min-w-[120px]"
          onChange={handleSortChange}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default TopBarSearch;
