import { Problem } from "@/pages/ProblemsPage/types/resonseType";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { MdCheckCircleOutline } from "rocketicons/md";
import { useNavigate } from "react-router-dom";
interface AllProblemsListItemProps {
  problems: Problem[];
  toggleSidebar: () => void;
}

export const AllProblemsListItem = ({ problems, toggleSidebar }: AllProblemsListItemProps) => {
  const navigate = useNavigate();

  const handleProblemClicked = (problemId: string) => {
    toggleSidebar();
    navigate(`/problems/${problemId}`);
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full table-auto">
        <tbody>
          {problems.map((row, index) => (
            <tr
              key={index}
              onClick={() => handleProblemClicked(row.problemId)}
              className={`cursor-pointer hover:cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
            >
              <td className="w-6 px-4 py-2 text-center">
                {row.done == true ? <MdCheckCircleOutline className="icon-appEasy" /> : ""}
              </td>

              <td className="w-4/6 px-4 py-2 font-semibold">{row.problemName}</td>

              <td
                className={`px-4 py-2 w-1/6 font-semibold ${
                  row.level === "easy" ? "text-appEasy" : row.level === "medium" ? "text-appMedium" : "text-appHard"
                }`}
              >
                {capitalizeFirstLetter(row.level)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
