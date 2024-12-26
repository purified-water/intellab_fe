import { useEffect, useState, useRef, useCallback } from "react";
import SearchBar from "@/pages/ExplorePage/components/SearchBar";
import { Link } from "react-router-dom";
import FilterButton from "@/pages/ExplorePage/components/FilterButton";
import { courseAPI } from "@/lib/api"; // Adjust the import path as necessary
import { ICourse } from "@/features/Course/types";
import _ from "lodash";
import SearchResultComponent from "./components/SearchResultComponent"; // Adjust the import path as necessary
import Course from "./components/Course";
import { DEFAULT_COURSE } from "@/constants/defaultData";

const SEARCH_WAIT_TIME = 3000;

export const ExplorePage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [searchedCourses, setSearchedCourses] = useState<ICourse[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCourses = async () => {
    setLoading(true);
    const response = await courseAPI.getCourses();
    if (response) {
      setCourses(response.result.content);
    }
    setLoading(false);
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    _.debounce(async (query: string) => {
      if (query === "") {
        setSearchedCourses([]);
        setLoading(false);
        return;
      }
      try {
        const response = await courseAPI.search(query, 0);
        setSearchedCourses(response.result.content);
      } catch (error) {
        console.error("Failed to search courses:", error);
        setSearchedCourses([]);
      } finally {
        setLoading(false);
      }
    }, SEARCH_WAIT_TIME)
  ).current;

  // Handle search input
  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      setLoading(true);
      debouncedSearch(inputQuery);
    },
    [debouncedSearch]
  );

  // Determine which courses to display
  const displayedCourses = query ? searchedCourses : courses;

  const renderSkeletonList = () => {
    const skeletonCount = 6; // Số lượng skeleton cố định
    return (
      <div className="flex px-10 overflow-x-auto gap-7 scrollbar-hide">
        {[...Array(skeletonCount)].map((_, index) => (
          <Course key={index} course={DEFAULT_COURSE} skeletonLoading={true} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Header section with filter button and search bar */}
      <div className="flex items-center py-10 pl-10">
        <FilterButton onClick={() => {}} />
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Display search results if a query is present */}
      {query ? (
        <SearchResultComponent loading={loading} courses={displayedCourses} query={query} />
      ) : (
        <div>
          {/* Welcome message */}
          <div className="w-full h-[106px] flex flex-col pl-10">
            <div className="mb-2 text-5xl font-bold tracking-wide text-appPrimary">Welcome to Intellab explore!</div>
            <div>Find new and exciting courses here!</div>
          </div>

          {/* Section for Fundamentals For Beginner */}
          <div className="flex flex-col mb-[78px]">
            <div className="flex items-center justify-between w-full mb-[44px] pl-10">
              <div className="text-4xl font-bold text-black">Fundamentals For Beginner</div>
              <Link to="/explore/fundamentals" state={{ courses: displayedCourses }}>
                <button className="mr-20 text-lg underline text-black-50">View all &gt;</button>
              </Link>
            </div>
            {loading ? (
              renderSkeletonList()
            ) : (
              <div className="flex px-10 overflow-x-auto gap-7 scrollbar-hide">
                {displayedCourses.map((course, index) => (
                  <div key={index}>
                    <Course course={course} skeletonLoading={loading} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section for Popular Courses */}
          <div className="flex flex-col mb-[78px]">
            <div className="flex items-center justify-between w-full mb-[44px] pl-10">
              <div className="text-4xl font-bold text-black">Popular Courses</div>
              <Link to="/explore/popular" state={{ courses: displayedCourses }}>
                <button className="mr-20 text-lg underline text-black-50">View all &gt;</button>
              </Link>
            </div>
            {loading ? (
              renderSkeletonList()
            ) : (
              <div className="flex px-10 overflow-x-auto gap-7 scrollbar-hide">
                {displayedCourses.map((course, index) => (
                  <div key={index}>
                    <Course course={course} skeletonLoading={loading} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
