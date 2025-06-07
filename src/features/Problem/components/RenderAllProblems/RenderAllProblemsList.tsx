import { AllProblemsListItem } from "./AllProblemsListItem";
import { MdClose } from "rocketicons/md";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchPaginatedProblems } from "@/redux/problem/problemSlice";
import { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";

interface RenderAllProblemsProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const RenderAllProblems = ({ isOpen, toggleSidebar }: RenderAllProblemsProps) => {
  const dispatch = useAppDispatch();
  const problems = useSelector((state: RootState) => state.problem.problems);
  const status = useSelector((state: RootState) => state.problem.status);
  const totalPages = useSelector((state: RootState) => state.problem.totalPages);
  const [visible, setVisible] = useState(isOpen);
  const [page, setPage] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    dispatch(
      fetchPaginatedProblems({ keyword: "", page: 0, size: 20, selectedCategories: null, status: null, level: null })
    ); // Fetch first page initially
  }, [dispatch]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      toggleSidebar();
    }, 200);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".sidebar-content")) return;
    handleClose();
  };

  const handleScroll = () => {
    if (sidebarRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
      // Added this to call infinite scroll when user reaches near the bottom using redux
      if (scrollTop + clientHeight >= scrollHeight - 10 && status !== "loading" && page < totalPages - 1) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 0) {
      dispatch(
        fetchPaginatedProblems({ keyword: "", page, size: 20, selectedCategories: null, status: null, level: null })
      );
    }
  }, [page, dispatch]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-opacity-50 bg-gray5 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleOutsideClick}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-2/5 h-full bg-white shadow-lg z-60 transform transition-transform duration-200 ${
          visible ? "translate-x-0" : "-translate-x-full"
        } sidebar-content overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        onScroll={handleScroll}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">All Problems</h2>
          <AllProblemsListItem problems={problems} toggleSidebar={handleClose} />
        </div>
        <button type="button" className="absolute text-gray-500 top-4 right-4" onClick={handleClose}>
          <MdClose className="icon-lg" />
        </button>
      </div>
    </div>
  );
};
