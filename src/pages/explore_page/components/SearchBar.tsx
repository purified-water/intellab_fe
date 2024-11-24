import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [query, setQuery] = React.useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="flex items-center justify-center p-4 bg-white">
      <div className="relative w-full">
        <FontAwesomeIcon icon={faSearch} className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          className="w-[1196px] h-[40px] p-2 pl-10 border border-gray-500 rounded-[10px] bg-white"
          placeholder="Search"
          value={query}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
