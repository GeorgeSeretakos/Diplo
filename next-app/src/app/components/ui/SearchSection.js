import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const SearchSection = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [sortBy, setSortBy] = useState("relevance");


  const handleSearch = () => {
    console.log("Search called!");
  };

  return (
    <div className="flex items-center justify-between gap-3 w-full">

      {/* Search Input Container */}
      <div className="relative w-[70%]">
        <input
          type="text"
          placeholder="Enter key phrase..."
          className="w-full bg-gray text-white text-lg pr-20 pl-4 py-2 rounded-3xl outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        {/* Clear Button (X) */}
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18}/>
          </button>
        )}

        {/* Search Button Inside Input */}
        <button
          onClick={handleSearch}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 p-2 rounded-full text-white"
        >
          <Search size={18}/>
        </button>
      </div>

      {/* Sort By Section */}
      <div className="flex items-center gap-4">
        <span className="text-white w-full font-semibold">Sort By</span>
        <select
          className="bg-gray text-white p-2 rounded-lg outline-none border border-gray-600 min-w-[120px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default SearchSection;
