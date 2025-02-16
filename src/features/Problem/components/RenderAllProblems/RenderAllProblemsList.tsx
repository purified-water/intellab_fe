import { AllProblemsListItem } from "./AllProblemsListItem";
import { MdClose } from "rocketicons/md";
import { useEffect } from "react";
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
  // const currentPage = useSelector((state: RootState) => state.problem.currentPage);
  // const totalPages = useSelector((state: RootState) => state.problem.totalPages);
  // const status = useSelector((state: RootState) => state.problem.status);

  // NOTE: In the future, all infite scroll logic will be implemented here
  useEffect(() => {
    dispatch(fetchPaginatedProblems({ keyword: "", page: 0, size: 20 })); // Fetch first page initially using redux
  }, [dispatch]);

  return (
    <div className={`fixed inset-0 z-50 bg-opacity-50 bg-gray5 ${isOpen ? "block" : "hidden"}`}>
      <div className="fixed top-0 left-0 w-2/5 h-full bg-white shadow-lg z-60">
        <div className="p-4">
          <h2 className="text-lg font-semibold">All Problems</h2>
          <AllProblemsListItem problems={problems} toggleSidebar={toggleSidebar} />
        </div>
        <button className="absolute text-gray-500 top-4 right-4" onClick={toggleSidebar}>
          <MdClose className="icon-lg" />
        </button>
      </div>
    </div>
  );
};
