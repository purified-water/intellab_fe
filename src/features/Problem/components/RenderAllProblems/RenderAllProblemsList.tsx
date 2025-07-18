import { AllProblemsListItem } from "./AllProblemsListItem";
import { MdClose } from "rocketicons/md";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchPaginatedProblems } from "@/redux/problem/problemSlice";
import { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";
import { Button, Spinner } from "@/components/ui";
import { CircleChevronDown } from "lucide-react";

const PAGE_SIZE = 20;

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
  const [currentPage, setCurrentPage] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    dispatch(
      fetchPaginatedProblems({
        keyword: "",
        page: 0,
        size: PAGE_SIZE,
        selectedCategories: null,
        status: null,
        level: null
      })
    );
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
      if (scrollTop + clientHeight >= scrollHeight - 10 && status !== "loading" && currentPage < totalPages - 1) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (currentPage > 0) {
      dispatch(
        fetchPaginatedProblems({
          keyword: "",
          page: 0,
          size: (currentPage + 1) * PAGE_SIZE,
          selectedCategories: null,
          status: null,
          level: null
        })
      );
    }
  }, [currentPage, dispatch]);

  const renderViewMore = () => {
    const isLoading = status === "loading";
    let content = null;
    if (isLoading) {
      content = <Spinner loading={isLoading} />;
    } else if (totalPages && currentPage + 1 < totalPages) {
      content = (
        <Button type="button" disabled={isLoading} onClick={handleScroll}>
          View more
          <CircleChevronDown />
        </Button>
      );
    } else {
      content = <p className="text-gray3 text-lg">No more problems to show!</p>;
    }
    return <div className="flex flex-col items-center space-y-4 mt-4">{content}</div>;
  };

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
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">All Problems</h2>
          <AllProblemsListItem problems={problems} toggleSidebar={handleClose} />
          {renderViewMore()}
        </div>
        <button type="button" className="absolute text-gray-500 top-4 right-4" onClick={handleClose}>
          <MdClose className="icon-lg" />
        </button>
      </div>
    </div>
  );
};
