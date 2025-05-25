import { MdCheckCircleOutline, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLock } from "rocketicons/md";
import { useState } from "react";
import { Problem } from "../../types";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type ProblemListItemProps = {
  problems: Problem[];
  status: string;
};

export const ProblemListItem = ({ problems, status }: ProblemListItemProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Problem | null; order: "asc" | "desc" }>({
    key: null,
    order: "asc"
  });

  const navigate = useNavigate();

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status === PREMIUM_STATUS.ACTIVE;
  const isAlgorithmUnlocked =
    reduxPremiumStatus?.planType !== PREMIUM_PACKAGES.RESPONSE.FREE &&
    reduxPremiumStatus?.status !== PREMIUM_PACKAGES.RESPONSE.COURSE;

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
            {["Title", "Status", "Solution", "Level", "Category"].map((header, index) => (
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
        <tbody className="text-xs sm:text-sm">
          {status === "loading"
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-gray6/50"}`}>
                  <td className="w-2/6 px-4 py-3">
                    <Skeleton className="w-3/4 h-4" />
                  </td>
                  <td className="w-12 py-3 pl-8 text-center">
                    <Skeleton className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="w-20 px-4 py-3">
                    <Skeleton className="w-6 h-4 mx-auto" />
                  </td>
                  <td className="px-4 py-3 w-28">
                    <Skeleton className="w-3/5 h-4" />
                  </td>
                  <td className="w-2/5 px-4 py-3">
                    <Skeleton className="w-4/5 h-4" />
                  </td>
                </tr>
              ))
            : sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={`cursor-pointer text-xs sm:text-base ${index % 2 === 0 ? "bg-white" : "bg-gray6/50"}`}
                  onClick={() => handleProblemListItemClicked(row.problemId)}
                >
                  <td className="w-3/6 px-4 py-2 font-medium hover:text-appPrimary">
                    <span className="inline-block max-w-[400px] truncate align-middle" title={row.problemName}>
                      {row.problemName}
                    </span>
                    {!row.isPublished && (
                      <div className="inline px-2 py-1 ml-2 text-xs align-middle rounded text-appAccent bg-appFadedAccent">
                        Premium
                      </div>
                    )}
                  </td>
                  <td className="w-12 py-2 pl-8 text-center">
                    {row.isDone === true ? (
                      <MdCheckCircleOutline className="icon-appEasy" />
                    ) : !row.isPublished && (!isAlgorithmUnlocked || !isCurrentPlanActive) ? (
                      <MdLock className="icon-appAccent" />
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="w-20 px-4 py-2 font-semibold justify-items-center">
                    {row.hasSolution == true ? <MdCheckCircleOutline className="icon-appEasy" /> : ""}
                  </td>
                  <td
                    className={`px-4 py-2 w-28 font-semibold ${
                      row.level === "easy" ? "text-appEasy" : row.level === "medium" ? "text-appMedium" : "text-appHard"
                    }`}
                  >
                    {capitalizeFirstLetter(row.level)}
                  </td>
                  <td className="w-2/5 px-4 py-2">
                    {row.categories?.map((category) => category.name).join(", ") ?? ""}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
