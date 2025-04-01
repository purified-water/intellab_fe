import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { courseAPI } from "@/lib/api"; // Adjust the import path as necessary
import { ICourse } from "@/types";
// import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { getExploreCourse, resetFilters } from "@/redux/course/courseSlice";
import { motion } from "framer-motion";
import { AIOrb } from "@/features/MainChatBot/components/AIOrb";
import { AppFooter } from "@/components/AppFooter";
import { ScrollableList } from "@/components/ui/HorizontallyListScrollButtons";
import { Course, FilterButton, FilterComponent, SearchResultComponent, SearchBar } from "../components";
import { getUserIdFromLocalStorage } from "@/utils";

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

  useEffect(() => {
    document.title = "Explore | Intellab";
  }, []);

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
      console.log("Search response:", response);

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
      <div className="flex py-4 overflow-x-auto gap-7 scrollbar-hide">
        {[...Array(skeletonCount)].map((_, index) => (
          <Course key={index} course={null} skeletonLoading={true} />
        ))}
      </div>
    );
  };

  const renderEmptyCourse = () => {
    return <div className="flex items-center justify-center w-full text-2xl text-black">No courses available</div>;
  };

  const renderCourses = (displayingCourses: ICourse[]) => {
    return (
      <div className="flex py-4 overflow-x-auto gap-7 scrollbar-hide">
        <ScrollableList size="large">
          {displayingCourses.map((course) => (
            <Course key={course.courseId} course={course} skeletonLoading={loading} />
          ))}
        </ScrollableList>
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
    <>
      <div className="flex flex-col w-full pt-3 mx-auto md:max-w-5xl lg:max-w-[90rem] px-4 md:px-28">
        {/* Header section with filter button and search bar */}
        <div className="flex items-center pt-10">
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
            className="flex items-center py-2 pl-[100px]"
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
            <div className="flex items-center justify-center w-full">
              <SearchResultComponent loading={loading} courses={displayedCourses} query={query} />
            </div>
          ) : (
            <div>
              {/* Welcome message */}
              <div className="flex flex-col w-full">
                <div className="mb-2 text-5xl font-bold tracking-wide text-appPrimary">
                  Welcome to Intellab explore!
                </div>
                <span className="mt-2 text-xl font-light text-gray3">Find new and exciting courses here!</span>
              </div>
              {!hasFilter ? (
                <div className="mt-8">
                  {/* Section for Fundamentals For Beginner */}
                  <div className="flex flex-col mb-8 sm:mb-[78px]">
                    <div className="flex items-center justify-between w-full mb-0 sm:mb-8">
                      <div className="text-2xl font-bold text-black sm:text-4xl">Fundamental For Beginner</div>
                      {/* NOTE: 26/12/2024 temporarily hide this this button */}
                      <Link to="/explore/fundamental" state={{ courses: displayedCourses, section: "fundamentals" }}>
                        <button className="text-lg underline text-black-50">View all &gt;</button>
                      </Link>
                    </div>
                    {!loading && displayedCourses.length === 0 && renderEmptyCourse()}
                    {loading || !displayedCourses ? renderSkeletonList() : renderCourses(displayedCourses)}
                  </div>

                  {/* Section for Popular Courses */}
                  <div className="flex flex-col mb-[78px]">
                    <div className="flex items-center justify-between w-full mb-0 sm:mb-8">
                      <div className="text-2xl font-bold text-black sm:text-4xl">Popular Courses</div>
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

      <AppFooter />

      <AIOrb />
    </>
  );
};
