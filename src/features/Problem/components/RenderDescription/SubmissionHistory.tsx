import React from "react";
import { MdCheckCircleOutline, MdOutlineCancel } from "rocketicons/md";
import { Clock, Cpu, ChevronRight } from "lucide-react";

interface TestCaseRowProps {
  status: string;
  date: string;
  language: string;
  runtime: string;
  memory: string;
}

export const SubmissionHistory: React.FC = () => {
  const testCases: TestCaseRowProps[] = [
    {
      status: "Accepted",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "1 ms",
      memory: "11 MB"
    },
    {
      status: "Wrong Answer",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      status: "Accepted",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "1 ms",
      memory: "11 MB"
    },
    {
      status: "Wrong Answer",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      status: "Accepted",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "1 ms",
      memory: "11 MB"
    },
    {
      status: "Wrong Answer",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      status: "Accepted",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "1 ms",
      memory: "11 MB"
    },
    {
      status: "Wrong Answer",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "N/A",
      memory: "N/A"
    },
    {
      status: "Accepted",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "1 ms",
      memory: "11 MB"
    },
    {
      status: "Wrong Answer",
      date: "Jan 22, 2025",
      language: "Python",
      runtime: "N/A",
      memory: "N/A"
    }
  ];

  const handleSubmissionHistoryClick = () => {
    console.log("Submission History Clicked");
  };

  return (
    <div className="h-full pb-16 overflow-x-auto overflow-y-scroll">
      <table className="min-w-full table-auto">
        {/* Table Header */}
        <thead className="">
          <tr className="text-sm font-semibold text-left text-gray2">
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Language</th>
            <th className="px-6 py-3">Runtime</th>
            <th className="px-6 py-3">Memory</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {testCases.map((testCase, index) => (
            <tr
              key={index}
              onClick={handleSubmissionHistoryClick}
              className={`${index % 2 === 0 ? "bg-gray6" : "bg-white"} cursor-pointer`}
            >
              {/* Status */}
              <td className="w-auto py-2 pl-6 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {testCase.status === "Accepted" ? (
                    <MdCheckCircleOutline className="w-5 h-5 icon-appEasy" />
                  ) : (
                    <MdOutlineCancel className="w-5 h-5 icon-appHard" />
                  )}
                  <div className="flex flex-col">
                    <span
                      className={`font-semibold text-sm ${testCase.status === "Accepted" ? "text-appEasy" : "text-appHard"}`}
                    >
                      {testCase.status}
                    </span>
                    <span className="block text-xs text-gray3">{testCase.date}</span>
                  </div>
                </div>
              </td>

              {/* Language */}
              <td className="w-auto px-6 py-2 whitespace-nowrap">
                <span className="px-2 py-1 text-sm rounded-lg text-gray3 bg-gray5">{testCase.language}</span>
              </td>

              {/* Runtime */}
              <td className="w-auto px-6 py-2 whitespace-nowrap text-gray3">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{testCase.runtime}</span>
                </div>
              </td>

              {/* Memory */}
              <td className="w-auto px-6 py-2 text-sm whitespace-nowrap text-gray3">
                <div className="flex items-center gap-1">
                  <Cpu className="w-4 h-4" />
                  <span>{testCase.memory}</span>
                </div>
              </td>

              {/* Chevron Icon */}
              <td className="w-auto px-6 py-2 whitespace-nowrap text-gray3">
                <ChevronRight className="w-5 h-5" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
