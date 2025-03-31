import { MdCheckCircleOutline, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLock } from "rocketicons/md";
import { useState } from "react";
import { Problem } from "../../types";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { useNavigate } from "react-router-dom";

type ProblemListItemProps = {
  problems: Problem[];
};

export const ProblemListItem = ({ problems }: ProblemListItemProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Problem | null; order: "asc" | "desc" }>({
    key: null,
    order: "asc"
  });
  const navigate = useNavigate();

  const handleSort = (key: keyof Problem) => {
    setSortConfig((prevConfig) =>
      prevConfig.key === key ? { key, order: prevConfig.order === "asc" ? "desc" : "asc" } : { key, order: "asc" }
    );
  };

  const sortedData = [...problems].sort((a, b) => {
    const { key, order } = sortConfig;
    if (!key) return 0;
    const valueA = a[key];
    const valueB = b[key];
    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return 0;
  });

  const handleProblemListItemClicked = (problemId: string) => {
    navigate(`/problems/${problemId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="border-b">
          <tr className="text-xs sm:text-base">
            {["Status", "Title", "Hints", "Level", "Category"].map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left cursor-pointer text-gray2"
                onClick={() => handleSort(header.toLowerCase() as keyof Problem)}
              >
                <div className="flex items-center">
                  <p>{header}</p>
                  <p>
                    {sortConfig.key === header.toLowerCase() ? (
                      sortConfig.order === "asc" ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={index}
              className={`cursor-pointer text-xs sm:text-base ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
              onClick={() => handleProblemListItemClicked(row.problemId)}
            >
              <td className="w-12 py-2 pl-8 text-center">
                {row.isDone === true ? (
                  <MdCheckCircleOutline className="icon-appEasy" />
                ) : !row.isPublished ? (
                  <MdLock className="icon-appAccent" />
                ) : (
                  ""
                )}
              </td>
              <td className="w-2/6 px-4 py-2 font-semibold hover:text-appPrimary">
                {row.problemName}
                {!row.isPublished && (
                  <div className="inline px-2 py-1 ml-2 text-xs rounded text-appAccent bg-appFadedAccent">Premium</div>
                )}
              </td>
              <td className="w-20 px-4 py-2 font-semibold justify-items-center">
                {row.hintCount > 0 ? <MdCheckCircleOutline className="icon-appEasy" /> : ""}
              </td>
              <td
                className={`px-4 py-2 w-28 font-semibold ${row.level === "easy" ? "text-appEasy" : row.level === "medium" ? "text-appMedium" : "text-appHard"}`}
              >
                {capitalizeFirstLetter(row.level)}
              </td>
              <td className="w-2/5 px-4 py-2">{row.categories?.map((category) => category.name).join(", ") ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
