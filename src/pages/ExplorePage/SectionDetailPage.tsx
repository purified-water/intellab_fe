import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  //useLocation,
  useParams
} from "react-router-dom";
import FilterButton from "@/pages/ExplorePage/components/FilterButton";
import SearchBar from "@/pages/ExplorePage/components/SearchBar";
import { ICourse } from "@/features/Course/types";
import { courseAPI } from "@/lib/api";
import _ from "lodash";
import SearchResultComponent from "@/pages/ExplorePage/components/SearchResultComponent";
//import Course from "./components/Course";
import Pagination from "@/components/ui/Pagination";

const SectionDetailPage: React.FC = () => {
  //const location = useLocation();
  //const { courses } = location.state as { courses: ICourse[] };
  const [searchedCourses, setSearchedCourses] = useState<ICourse[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { section } = useParams<{ section: string }>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // const getSectionCourses = (section: string) => {
  //   if (section === "fundamentals") {
  //     //return courses;
  //   }
  //   if (section === "popular") {
  //     //return courses;
  //   }
  //   return [];
  // };

  const debouncedSearch = useRef(
    _.debounce(async (inputQuery: string) => {
      try {
        setLoading(true);
        const response = await courseAPI.search(inputQuery, 0);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        setSearchedCourses(response.result.content);
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

  const fetchCourses = async (page: number) => {
    setLoading(true);
    const response = await courseAPI.search(query, page);
    if (response) {
      const fetchCourses = response.result.content;
      setSearchedCourses([...searchedCourses, ...fetchCourses]);
      setCurrentPage(response.result.number);
      setTotalPages(response.result.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses(0);
  }, []);

  //const sectionCourses = getSectionCourses(section || "");
  //const displayedCourses = query ? searchedCourses : sectionCourses;

  const renderSearchResult = () => {
    return <SearchResultComponent loading={loading} courses={searchedCourses} query={query}></SearchResultComponent>;
  };

  // const renderCourses = () => {
  //   return (
  //     <div>
  //       <div className="mb-6 text-4xl font-bold tracking-wide sm:text-4xl sm:mb-11 text-appPrimary">
  //         {section && section.charAt(0).toUpperCase() + section.slice(1)} Courses
  //       </div>
  //       <div className="flex flex-wrap gap-7">
  //         {displayedCourses.map((course, index) => (
  //           <div key={index}>
  //             <Course course={course} loading={loading} />
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sm:pl-10 flex-grow">
        {/* Header section with filter button and search bar */}
        <div className="flex items-center py-4 sm:py-10">
          <FilterButton onClick={() => {}} />
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Section title */}
        {/* {query ? renderSearchResult() : renderCourses()} */}
        <div className="mb-6 text-4xl font-bold tracking-wide sm:text-4xl sm:mb-11 text-appPrimary">
          {section && section.charAt(0).toUpperCase() + section.slice(1)} Courses
        </div>
        {renderSearchResult()}
      </div>

      <div className="mt-auto">
        {totalPages && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              fetchCourses(page);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SectionDetailPage;
