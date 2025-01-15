import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SearchBar from "@/pages/ProblemsPage/components/SearchBar";
import FilterButton from "@/pages/ProblemsPage/components/FilterButton";
import { ProblemListItem } from "@/pages/ProblemsPage/components/ProblemListItem";
import { fetchPaginatedProblems } from "@/redux/problem/problemSlice";
import { RootState } from "@/redux/rootReducer";
import { useAppDispatch } from "@/redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { motion } from "framer-motion";
import FilterComponent from "@/pages/ProblemsPage/components/FilterComponent";

export const ProblemsPage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const problems = useSelector((state: RootState) => state.problem.problems);
  const status = useSelector((state: RootState) => state.problem.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    console.log("USE EFFECT");
    dispatch(fetchPaginatedProblems({ keyword: "", page: 0, size: 20 })); // Fetch first page initially
  }, [dispatch, isAuthenticated]);

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
      dispatch(fetchPaginatedProblems({ keyword: query, size: 20, page: 0 }));
    } catch (error) {
      console.error("Failed to search courses:", error);
    } finally {
      // setLoading(false);
    }
  }).current;

  // Handle search input
  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      // setLoading(true);
      debouncedSearch(inputQuery);
      if (inputQuery !== "") {
        navigate(`/problems?keyword=${inputQuery}`);
      } else {
        navigate(`/problems`);
      }
    },
    [debouncedSearch]
  );

  // if (status === "loading") {
  //   return <div>Loading problems...</div>;
  // }

  if (status === "failed") {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col">
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
          <FilterComponent />
        </motion.div>
      }
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showFilter ? 20 : 0 }}
        transition={{ duration: 0.5 }}
        className="pb-10"
      >
        {status === "loading" ? (
          <Spinner loading={true}></Spinner>
        ) : (
          <div>
            {query !== "" ? (
              <div className="pl-10 mb-6 text-4xl font-bold text-black sm:text-4xl sm:mb-11">
                {query && problems.length === 0 ? "Not found" : "Search results"}
              </div>
            ) : (
              <div className="w-full h-[106px] flex flex-col pl-10 mb-4">
                <div className="mb-2 text-5xl font-bold tracking-wide text-appPrimary">
                  Welcome to Intellab problems!
                </div>
                <div>Improve your problem solving skills here!</div>
              </div>
            )}
            <div className="w-full px-10">{<ProblemListItem problems={problems} />}</div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
