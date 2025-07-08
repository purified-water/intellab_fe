import { MdCheckCircleOutline, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLock } from "rocketicons/md";
import { useState, useEffect } from "react";
import { Problem } from "../../types";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";
import { EmptyList, Skeleton } from "@/components/ui";
import { setProblems } from "@/redux/problem/problemSlice";

type ProblemListProps = {
  problems: Problem[];
  status: string;
};

type SortingKeys = "title" | "status" | "solution" | "level" | "category";
type Orders = "asc" | "desc";

const sortBooleans = (valueA: boolean, valueB: boolean, order: Orders) => {
  if (valueA === valueB) return 0;
  const result = valueA ? 1 : -1;
  return order === "asc" ? result : -result;
};

export const ProblemList = ({ problems, status }: ProblemListProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortingKeys | null; order: Orders }>({
    key: null,
    order: "asc"
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status === PREMIUM_STATUS.ACTIVE;
  const isAlgorithmUnlocked =
    reduxPremiumStatus?.planType !== PREMIUM_PACKAGES.RESPONSE.FREE &&
    reduxPremiumStatus?.status !== PREMIUM_PACKAGES.RESPONSE.COURSE;

  const handleSort = (key: SortingKeys) => {
    setSortConfig((prevConfig) =>
      prevConfig.key === key ? { key, order: prevConfig.order === "asc" ? "desc" : "asc" } : { key, order: "asc" }
    );
  };

  useEffect(() => {
    const newSortedData = [...problems].sort((a, b) => {
      const { key, order } = sortConfig;
      if (!key) return 0;

      if (key === "title") {
        const valueA = a["problemName"];
        const valueB = b["problemName"];
        if (typeof valueA === "string" && typeof valueB === "string") {
          return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
      } else if (key === "status") {
        const valueA = a["isDone"];
        const valueB = b["isDone"];
        if (typeof valueA === "boolean" && typeof valueB === "boolean") {
          return sortBooleans(valueA, valueB, order);
        }
      } else if (key === "solution") {
        const valueA = a["hasSolution"];
        const valueB = b["hasSolution"];
        if (typeof valueA === "boolean" && typeof valueB === "boolean") {
          return sortBooleans(valueA, valueB, order);
        }
      } else if (key === "level") {
        const valueA = a[key];
        const valueB = b[key];
        if (typeof valueA === "string" && typeof valueB === "string") {
          return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
      } else if (key === "category") {
        const valueA = a["categories"]?.map((category) => category.name).join(", ") || "";
        const valueB = b["categories"]?.map((category) => category.name).join(", ") || "";
        if (typeof valueA === "string" && typeof valueB === "string") {
          return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
      }

      return 0;
    });

    dispatch(setProblems(newSortedData));
  }, [sortConfig]);

  const handleProblemListItemClicked = (problemId: string) => {
    navigate(`/problems/${problemId}`);
  };

  const renderHeader = () => {
    const getSortIcon = (header: string) => {
      if (sortConfig.key !== header.toLowerCase()) return null;
      return sortConfig.order === "asc" ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />;
    };

    return (
      <thead className="border-b">
        <tr className="text-xs sm:text-base">
          {["Title", "Status", "Solution", "Level", "Category"].map((header, index) => (
            <th
              key={index}
              className="px-4 py-2 text-left cursor-pointer text-gray2"
              onClick={() => handleSort(header.toLowerCase() as SortingKeys)}
            >
              <div className="flex items-center">
                <p>{header}</p>
                <p>{getSortIcon(header)}</p>
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderSkeleton = () => {
    return Array.from({ length: 5 }).map((_, i) => (
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
    ));
  };

  const renderSortedProblems = () => {
    const renderIsDone = (isDone: boolean, isPublish: boolean) => {
      let result = null;
      if (isDone === true) {
        result = <MdCheckCircleOutline className="icon-appEasy" />;
      } else if (!isPublish && (!isAlgorithmUnlocked || !isCurrentPlanActive)) {
        result = <MdLock className="icon-appAccent" />;
      }
      return result;
    };

    return problems.map((problem, index) => (
      <tr
        key={index}
        className={`cursor-pointer text-xs sm:text-base transition-color duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray6/50"} hover:bg-appPrimary/10`}
        onClick={() => handleProblemListItemClicked(problem.problemId)}
      >
        <td className="w-3/6 px-4 py-2 font-medium hover:text-appPrimary">
          <span className="inline-block max-w-[400px] truncate align-middle" title={problem.problemName}>
            {problem.problemName}
          </span>
          {!problem.isPublished && (
            <div className="inline px-2 py-1 ml-2 text-xs align-middle rounded text-appAccent bg-appFadedAccent">
              Premium
            </div>
          )}
        </td>
        <td className="w-12 py-2 pl-8 text-center">{renderIsDone(problem.isDone, problem.isPublished)}</td>
        <td className="w-20 px-4 py-2 font-semibold justify-items-center">
          {problem.hasSolution == true ? <MdCheckCircleOutline className="icon-appEasy" /> : ""}
        </td>
        <td
          className={`px-4 py-2 w-28 font-semibold ${
            problem.level === "easy" ? "text-appEasy" : problem.level === "medium" ? "text-appMedium" : "text-appHard"
          }`}
        >
          {capitalizeFirstLetter(problem.level)}
        </td>
        <td className="w-2/5 px-4 py-2">{problem.categories?.map((category) => category.name).join(", ") ?? ""}</td>
      </tr>
    ));
  };

  const renderEmpty = () => {
    return (
      <tr className="text-base font-normal text-gray3">
        <td colSpan={5} className="py-5 text-center">
          <EmptyList message="No problems found." />
        </td>
      </tr>
    );
  };

  const renderBody = () => {
    let body = null;
    if (status === "loading") {
      body = renderSkeleton();
    } else if (problems.length === 0) {
      body = renderEmpty();
    } else {
      body = renderSortedProblems();
    }

    return <tbody className="text-xs sm:text-sm">{body}</tbody>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        {renderHeader()}
        {renderBody()}
      </table>
    </div>
  );
};
