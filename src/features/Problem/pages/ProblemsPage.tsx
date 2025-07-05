import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { fetchPaginatedProblems } from "@/redux/problem/problemSlice";
import { RootState } from "@/redux/rootReducer";
import { useAppDispatch } from "@/redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination, Spinner } from "@/components/ui";
import { FilterButton, FilterComponent, ProblemList, SearchBar } from "../components";
import { motion } from "framer-motion";
import { AIOrb } from "@/features/MainChatBot/components/AIOrb";
import { SEO } from "@/components/SEO";
import React from "react";
const AppFooter = React.lazy(() => import("@/components/AppFooter").then((module) => ({ default: module.AppFooter })));

export const ProblemsPage = () => {
  const dispatch = useAppDispatch();
  const problems = useSelector((state: RootState) => state.problem.problems);
  const currentPage = useSelector((state: RootState) => state.problem.currentPage);
  const totalPages = useSelector((state: RootState) => state.problem.totalPages);
  const status = useSelector((state: RootState) => state.problem.status);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    dispatch(
      fetchPaginatedProblems({ keyword: "", page: 0, size: 20, selectedCategories: [], status: null, level: null })
    ); // Fetch first page initially
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
    try {
      dispatch(
        fetchPaginatedProblems({ keyword: query, size: 20, page: 0, selectedCategories: [], status: null, level: null })
      );
    } catch (error) {
      console.error("Failed to search courses:", error);
    }
  }).current;

  // Handle search input
  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      debouncedSearch(inputQuery);
      if (inputQuery !== "") {
        navigate(`/problems?keyword=${inputQuery}`);
      } else {
        navigate(`/problems`);
      }
    },
    [debouncedSearch]
  );

  if (status === "failed") {
    return <div>Error</div>;
  }

  const renderHeader = () => {
    return (
      <div className="flex items-center pt-10">
        <FilterButton
          onClick={() => {
            setShowFilter(!showFilter);
          }}
        />
        <div className="flex-1">
          <SearchBar value={query} onSearch={handleSearch} />
        </div>
      </div>
    );
  };

  const renderFilterDialog = () => {
    return (
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
    );
  };

  const renderTitle = () => {
    let result = (
      <div className="mb-6 text-4xl font-bold text-black sm:text-4xl sm:mb-11">
        {query && problems.length === 0 ? "Not found" : "Search results"}
      </div>
    );
    if (query === "") {
      result = (
        <div className="flex flex-col w-full mb-4">
          <h2 className="text-4xl font-bold tracking-tight text-transparent bg-gradient-to-tr from-appPrimary to-appSecondary bg-clip-text">
            Welcome to Intellab problems!
          </h2>
          <span className="mt-2 text-xl font-light text-gray3">Improve your problem solving skills here!</span>
        </div>
      );
    }
    return result;
  };

  const renderPagination = () => {
    return (
      totalPages != 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) =>
            dispatch(
              fetchPaginatedProblems({
                keyword: query,
                page: page,
                size: 20,
                selectedCategories: [],
                status: null,
                level: null
              })
            )
          }
        />
      )
    );
  };

  const renderProblemList = () => {
    return (
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showFilter ? 20 : 0 }}
        transition={{ duration: 0.5 }}
        className="pb-10"
      >
        <div>
          {renderTitle()}
          <div className="flex flex-col w-full mt-8">
            <ProblemList problems={problems} status={status} />
            {renderPagination()}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <SEO title="Problems | Intellab" />
      <div className="flex flex-col w-full pt-3 mx-auto md:max-w-5xl lg:max-w-[90rem] md:px-28">
        {renderHeader()}
        {renderFilterDialog()}
        {renderProblemList()}
      </div>

      <Suspense fallback={<Spinner className="size-6" loading />}>
        <AppFooter />
      </Suspense>

      <AIOrb />
    </>
  );
};
