import React, { useCallback, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import FilterButton from "@/pages/ExplorePage/components/FilterButton";
import SearchBar from "@/pages/ExplorePage/components/SearchBar";
import { ICourse } from "@/features/Course/types";
import { courseAPI } from "@/lib/api";
import _ from "lodash";
import SearchResultComponent from "@/pages/ExplorePage/components/SearchResultComponent";
import Course from "./components/Course";
import Spinner from "@/components/ui/Spinner";

const SectionDetailPage: React.FC = () => {
  const location = useLocation();
  const { courses } = location.state as { courses: ICourse[] };
  const [searchedCourses, setSearchedCourses] = useState<ICourse[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { section } = useParams<{ section: string }>();

  const getSectionCourses = (section: string) => {
    if (section === "fundamentals") {
      return courses;
    }
    if (section === "popular") {
      return courses;
    }
    return [];
  };

  const debouncedSearch = useRef(
    _.debounce(async (inputQuery: string) => {
      if (inputQuery === "") {
        setSearchedCourses([]);
        return;
      }
      try {
        setLoading(true);
        const response = await courseAPI.search(inputQuery);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        setSearchedCourses(response.result);
      } catch (error) {
        console.error("Failed to search courses:", error);
        setSearchedCourses([]);
      }
    }, 300)
  ).current;

  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      debouncedSearch(inputQuery);
    },
    [debouncedSearch]
  );

  const sectionCourses = getSectionCourses(section || "");
  const displayedCourses = query ? searchedCourses : sectionCourses;

  const renderSearchResult = () => {
    return <SearchResultComponent loading={loading} courses={displayedCourses} query={query}></SearchResultComponent>;
  };

  const renderCourses = () => {
    return (
      <div>
        <div className="mb-6 text-4xl font-bold tracking-wide sm:text-4xl sm:mb-11 text-appPrimary">
          {section && section.charAt(0).toUpperCase() + section.slice(1)} Courses
        </div>
        <div className="flex flex-wrap gap-7">
          {displayedCourses.map((course, index) => (
            <div key={index}>
              <Course course={course} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="sm:pl-10">
      {/* Header section with filter button and search bar */}
      <div className="flex items-center py-4 sm:py-10">
        <FilterButton onClick={() => { }} />
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Section title */}
      {query ? renderSearchResult() : renderCourses()}
    </div>
  );
};

export default SectionDetailPage;
