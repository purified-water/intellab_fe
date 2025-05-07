import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ICourse } from "@/types";
import { courseAPI } from "@/lib/api";
import { Pagination } from "@/components/ui";
import { motion } from "framer-motion";
import { FilterComponent, SearchBar, SearchResultComponent, FilterButton } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getExploreCourse } from "@/redux/course/courseSlice";
import { RootState } from "@/redux/rootReducer";

export const SectionDetailPage: React.FC = () => {
  const [searchedCourses, setSearchedCourses] = useState<ICourse[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { section } = useParams<{ section: string }>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const exploreCourses = useSelector((state: RootState) => state.course.exploreCourses);

  const [showFilter, setShowFilter] = useState<boolean>(false);

  // Fetch search results based on query parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");
    if (keyword) {
      handleSearch(keyword);
    }
  }, [location.search]);

  const debouncedSearch = useRef(async (inputQuery: string) => {
    try {
      setLoading(true);
      const response = await courseAPI.search(inputQuery, 0);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (response) {
        dispatch(getExploreCourse(response.result.content));
      }
      setLoading(false);
      setSearchedCourses(response.result.content);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to search courses:", error);
      }
      setSearchedCourses([]);
    }
  }).current;

  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      debouncedSearch(inputQuery);
      navigate(`/explore/${section}?keyword=${inputQuery}`);
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
    return (
      <div className="pl-10">
        <SearchResultComponent loading={loading} courses={exploreCourses} query={query}></SearchResultComponent>
      </div>
    );
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
    <div className="flex flex-col w-full pt-3 mx-auto md:max-w-5xl lg:max-w-[90rem] px-4 md:px-28">
      <div className="flex-grow pt-10">
        {/* Header section with filter button and search bar */}
        <div className="flex items-center">
          <FilterButton
            onClick={() => {
              setShowFilter(!showFilter);
            }}
          />
          <SearchBar value={query} onSearch={handleSearch} />
        </div>
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

        {/* Section title */}
        {/* {query ? renderSearchResult() : renderCourses()} */}
      </div>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showFilter ? 20 : 0 }}
        transition={{ duration: 0.5 }}
        className="pb-10"
      >
        <div className="pl-10 mx-auto mb-6 text-4xl font-bold tracking-wide sm:text-4xl sm:mb-11 text-appPrimary">
          {section && section.charAt(0).toUpperCase() + section.slice(1)} Courses
        </div>
        {renderSearchResult()}
      </motion.div>

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
