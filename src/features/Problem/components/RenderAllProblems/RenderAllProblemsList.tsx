import { AllProblemsListItem } from "./AllProblemsListItem";
import { MdClose } from "rocketicons/md";

interface RenderAllProblemsProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const RenderAllProblems = ({ isOpen, toggleSidebar }: RenderAllProblemsProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 bg-gray5">
      <div className="fixed top-0 left-0 w-2/5 h-full bg-white shadow-lg z-60">
        <div className="p-4">
          <h2 className="text-lg font-semibold">All Problems</h2>
          <AllProblemsListItem />
        </div>
        <button className="absolute text-gray-500 top-4 right-4" onClick={toggleSidebar}>
          <MdClose className="icon-lg" />
        </button>
      </div>
    </div>
  );
};
