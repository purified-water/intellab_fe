import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchProps {
  onSearch: (query: string) => void;
}
const SearchBar: React.FC<SearchProps> = ({ onSearch }) => {
  return (
    <div className="flex items-center justify-start w-full p-4 bg-white">
      <div className="relative w-full pr-10 max-w-7xl">
        <FontAwesomeIcon icon={faSearch} className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          className="w-full h-[40px] p-2 pl-10 border border-gray-500 rounded-[10px] bg-white"
          placeholder="Search"
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default SearchBar;
