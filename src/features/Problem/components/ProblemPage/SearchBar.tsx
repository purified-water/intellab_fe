import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchProps {
  width?: number;
  value: string;
  onSearch: (query: string) => void;
  placeHolderText?: string;
}
export const SearchBar: React.FC<SearchProps> = ({ value, onSearch, width, placeHolderText }) => {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className="flex items-center justify-start p-2 bg-white">
      <div className={`relative ${width ? "" : "w-full"}`} style={width ? { width: width } : {}}>
        <Search className="absolute transform -translate-y-1/2 size-4 text-gray3 left-3 top-1/2" />
        <input
          value={query}
          type="text"
          className="w-full h-[40px] p-2 pl-10 border border-gray4 rounded-[10px] bg-white focus-visible:outline-none"
          placeholder={placeHolderText ?? "Search"}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  width: PropTypes.number,
  placeHolderText: PropTypes.string
};
