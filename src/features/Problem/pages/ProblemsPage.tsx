import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { fetchPaginatedProblems } from "@/redux/problem/problemSlice";
import { RootState } from "@/redux/rootReducer";
import { useAppDispatch } from "@/redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "@/components/ui";
import { FilterButton, FilterComponent, ProblemListItem, SearchBar } from "../components";
import { motion } from "framer-motion";
import { AppFooter } from "@/components/AppFooter";
import { AIOrb } from "@/features/MainChatBot/components/AIOrb";

export const ProblemsPage = () => {
  const dispatch = useAppDispatch();
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const problems = useSelector((state: RootState) => state.problem.problems);
  const currentPage = useSelector((state: RootState) => state.problem.currentPage);
  const totalPages = useSelector((state: RootState) => state.problem.totalPages);
  const status = useSelector((state: RootState) => state.problem.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    document.title = "Problems | Intellab";
  }, []);

  useEffect(() => {
    dispatch(
      fetchPaginatedProblems({ keyword: "", page: 0, size: 20, selectedCategories: [], status: null, level: null })
    ); // Fetch first page initially
    console.log("fetchPaginatedProblems", problems);
  }, [dispatch]);

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
      dispatch(
        fetchPaginatedProblems({ keyword: query, size: 20, page: 0, selectedCategories: [], status: null, level: null })
      );
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
    <>
      <div className="flex flex-col w-full pt-3 mx-auto md:max-w-5xl lg:max-w-[90rem] md:px-28">
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
            className="flex items-center py-2 pl-[100px] shadow-none"
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
          {
            <div>
              {query !== "" ? (
                <div className="mb-6 text-4xl font-bold text-black sm:text-4xl sm:mb-11">
                  {query && problems.length === 0 ? "Not found" : "Search results"}
                </div>
              ) : (
                <div className="flex flex-col w-full mb-4">
                  <div className="mb-2 text-5xl font-bold tracking-wide text-appPrimary">
                    Welcome to Intellab problems!
                  </div>
                  <span className="mt-2 text-xl font-light text-gray3">Improve your problem solving skills here!</span>
                </div>
              )}
              <div className="flex flex-col w-full mt-8">
                <ProblemListItem problems={problems} status={status} />
                {totalPages != 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page: number) =>
                      dispatch(
                        fetchPaginatedProblems({
                          keyword: "",
                          page: page,
                          size: 20,
                          selectedCategories: [],
                          status: null,
                          level: null
                        })
                      )
                    }
                  />
                )}
              </div>
            </div>
          }
        </motion.div>
      </div>

      <AppFooter />

      <AIOrb />
    </>
  );
};
