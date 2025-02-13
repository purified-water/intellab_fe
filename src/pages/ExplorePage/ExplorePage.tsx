import { useEffect, useState, useRef, useCallback } from "react";
import SearchBar from "@/pages/ExplorePage/components/SearchBar";
import {
  Link,
  //Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import FilterButton from "@/pages/ExplorePage/components/FilterButton";
import { courseAPI } from "@/lib/api"; // Adjust the import path as necessary
import { ICourse } from "@/features/Course/types";
// import _ from "lodash";
import SearchResultComponent from "./components/SearchResultComponent"; // Adjust the import path as necessary
import Course from "./components/Course";
import { DEFAULT_COURSE } from "@/constants/defaultData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import FilterComponent from "./components/FilterComponent";
import { getExploreCourse, resetFilters } from "@/redux/course/courseSlice";
import { motion } from "framer-motion";

// const SEARCH_WAIT_TIME = 3000;

export const ExplorePage = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const exploreCourses = useSelector((state: RootState) => state.course.exploreCourses);
  const hasFilter = useSelector((state: RootState) => state.course.hasFilter);
  const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    return userId;
  };

  const fetchCourses = async () => {
    setLoading(true);
    const userUid = getUserIdFromLocalStorage();
    const response = userUid ? await courseAPI.getUnEnrollCourses(userUid) : await courseAPI.getCourses();
    // const response = await courseAPI.getCourses();
    if (response) {
      dispatch(getExploreCourse(response.result.content));
      dispatch(resetFilters());
    }
    setLoading(false);
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, [isAuthenticated]);

  // Fetch search results based on query parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");
    if (keyword) {
      handleSearch(keyword);
    }
  }, [location.search]);

  // Debounced search function
  const debouncedSearch = useRef(async (query: string) => {
    // if (query === "") {
    //   setSearchedCourses([]);
    //   dispatch(getExploreCourse());
    //   setLoading(false);
    //   return;
    // }
    try {
      const response = await courseAPI.search(query, 0);
      console.log("QUERY", query);
      dispatch(getExploreCourse(response.result.content));
    } catch (error) {
      console.error("Failed to search courses:", error);
    } finally {
      setLoading(false);
    }
  }).current;

  // Handle search input
  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      setLoading(true);
      debouncedSearch(inputQuery);
      navigate(`/explore?keyword=${inputQuery}`);
    },
    [debouncedSearch]
  );

  // Determine which courses to display
  const displayedCourses = query ? exploreCourses : exploreCourses;
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

  const renderEmptyCourse = () => {
    return <div className="flex items-center justify-center w-full text-2xl text-black">No courses available</div>;
  };

  const renderCourses = (displayingCourses: ICourse[]) => {
    return (
      <div className="flex px-10 overflow-x-auto gap-7 scrollbar-hide">
        {displayingCourses.map((course) => (
          <div key={course.courseId}>
            <Course course={course} skeletonLoading={loading} />
          </div>
        ))}
      </div>
    );
  };

  const renderGridCourses = () => (
    <div className="flex flex-wrap gap-7 sm:pl-10">
      {displayedCourses.map((course) => (
        <Course key={course.courseId} course={course} skeletonLoading={loading} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Header section with filter button and search bar */}
      <div className="flex items-center pt-10 pl-10">
        <FilterButton
          onClick={() => {
            setShowFilter(!showFilter);
          }}
        />
        <SearchBar value={query} onSearch={handleSearch} />
      </div>
      {
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: showFilter ? "auto" : 0, opacity: showFilter ? 1 : 0 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ overflow: "hidden" }}
          className="py-2"
        >
          <FilterComponent keyword={query} />
        </motion.div>
      }
      {/* Display search results if a query is present */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showFilter ? 20 : 0 }}
        transition={{ duration: 0.5 }}
        className="pb-10"
      >
        {query ? (
          <div className="sm:pl-10">
            {" "}
            <SearchResultComponent loading={loading} courses={displayedCourses} query={query} />
          </div>
        ) : (
          <div>
            {/* Welcome message */}
            <div className="w-full h-[106px] flex flex-col pl-10">
              <div className="mb-2 text-5xl font-bold tracking-wide text-appPrimary">Welcome to Intellab explore!</div>
              <div>Find new and exciting courses here!</div>
            </div>
            {!hasFilter ? (
              <div>
                {/* Section for Fundamentals For Beginner */}
                <div className="flex flex-col mb-[78px]">
                  <div className="flex items-center justify-between w-full mb-[44px] pl-10">
                    <div className="text-4xl font-bold text-black">Fundamentals For Beginner</div>
                    {/* NOTE: 26/12/2024 temporarily hide this this button */}
                    <Link to="/explore/fundamentals" state={{ courses: displayedCourses, section: "fundamentals" }}>
                      <button className="mr-20 text-lg underline text-black-50">View all &gt;</button>
                    </Link>
                  </div>
                  {!loading && displayedCourses.length === 0 && renderEmptyCourse()}
                  {loading || !displayedCourses ? renderSkeletonList() : renderCourses(displayedCourses)}
                </div>

                {/* Section for Popular Courses */}
                <div className="flex flex-col mb-[78px]">
                  <div className="flex items-center justify-between w-full mb-[44px] pl-10">
                    <div className="text-4xl font-bold text-black">Popular Courses</div>
                    {/* NOTE: 26/12/2024 temporarily hide this this button */}
                    {/* <Link to="/explore/popular" state={{ courses: displayedCourses }}>
                <button className="mr-20 text-lg underline text-black-50">View all &gt;</button>
              </Link> */}
                  </div>
                  {!loading && displayedCourses.length === 0 && renderEmptyCourse()}
                  {loading || !displayedCourses ? renderSkeletonList() : renderCourses(displayedCourses)}
                </div>
              </div>
            ) : displayedCourses.length !== 0 ? (
              renderGridCourses()
            ) : (
              renderEmptyCourse()
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
