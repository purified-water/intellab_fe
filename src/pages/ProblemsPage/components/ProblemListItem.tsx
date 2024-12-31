import { MdCheckCircleOutline, MdKeyboardArrowUp, MdKeyboardArrowDown } from "rocketicons/md";
import { useState } from "react";

type Row = {
  status: string;
  title: string;
  hints: string;
  level: string;
  category: string;
};

const data: Row[] = [
  { status: "solved", title: "1. Two Sum", hints: "True", level: "Medium", category: "String, Hash table" },
  { status: "", title: "1. Two Sum", hints: "False", level: "Easy", category: "String, Hash table, Array, Numbers" },
  { status: "", title: "1. Two Sum", hints: "False", level: "Easy", category: "String, Hash table, Array, Numbers" },
  {
    status: "solved",
    title: "1. Two Sum",
    hints: "False",
    level: "Hard",
    category: "String, Hash table, Array, Numbers"
  },
  { status: "", title: "1. Two Sum", hints: "False", level: "Easy", category: "String, Hash table, Array, Numbers" }
  // Add more rows as needed
];

export const ProblemListItem = () => {
  const [sortKey, setSortKey] = useState<keyof Row | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleProblemClicked = () => {
    console.log("Problem clicked");
  };

  const handleSort = (key: keyof Row) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const valueA = a[sortKey];
    const valueB = b[sortKey];
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="border-b">
          <tr>
            {["Status", "Title", "Hints", "Level", "Category"].map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left cursor-pointer text-gray2"
                onClick={() => handleSort(header.toLowerCase() as keyof Row)}
              >
                <div className="flex items-center">
                  <p>{header}</p>
                  <p>
                    {sortKey === header.toLowerCase() ? (
                      sortOrder === "asc" ? (
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
              onClick={handleProblemClicked}
              className={`cursor-pointer hover:cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
            >
              <td className="w-12 px-4 py-2 text-center">
                {row.status === "solved" ? <MdCheckCircleOutline className="icon-appEasy" /> : ""}
              </td>

              <td className="w-2/6 px-4 py-2 font-semibold">{row.title}</td>

              <td className="w-20 px-4 py-2 font-semibold text-center">
                {row.hints === "True" ? <MdCheckCircleOutline className="icon-appEasy" /> : ""}
              </td>

              <td
                className={`px-4 py-2 w-28 font-semibold ${
                  row.level === "Easy" ? "text-appEasy" : row.level === "Medium" ? "text-appMedium" : "text-appHard"
                }`}
              >
                {row.level}
              </td>

              <td className="w-2/5 px-4 py-2">{row.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
