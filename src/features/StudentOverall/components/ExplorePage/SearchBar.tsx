import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface SearchProps {
  value: string;
  onSearch: (query: string) => void;
  width?: string; // Add optional width prop
}
export const SearchBar: React.FC<SearchProps> = ({ value, onSearch, width = "w-full" }) => {
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
    <div className="flex items-center justify-start w-full p-2 bg-white">
      <div className={`relative ${width} max-w-none`}>
        <FontAwesomeIcon icon={faSearch} className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
        <input
          value={query}
          type="text"
          className="w-full h-[40px] p-2 pl-10 border border-gray3 rounded-[10px] bg-white focus-visible:outline-none"
          placeholder="Search"
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
  width: PropTypes.string
};
