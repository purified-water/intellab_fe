import { MdCheckCircleOutline, MdOutlineCancel } from "rocketicons/md";
import { Clock, Cpu, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { problemAPI } from "@/lib/api";
import { useState, useEffect } from "react";
import { SubmissionHistoryType } from "../../types/SubmissionHistoryType";
import { shortenDate } from "@/utils/dateUtils";
import { SubmissionInformation } from "./SubmissionInformation";
import { SubmissionTypeNoProblem } from "../../types/SubmissionType";

export const SubmissionHistory = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [submissionList, setSubmissionList] = useState<SubmissionHistoryType[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<
    (SubmissionTypeNoProblem & { isPassed: boolean }) | null
  >(null);
  const [currentPanel, setCurrentPanel] = useState<"history" | "details">("history");
  const [isLoading, setIsLoading] = useState(false);

  const getSubmissionHistory = async () => {
    if (!problemId) return;
    try {
      const response = await problemAPI.getSubmissionHistory(problemId);
      // TEMPORARY: Add submitDate to each submission
      const submissionsWithDate = response.map((submission: SubmissionHistoryType) => ({
        ...submission,
        submitDate: new Date().toLocaleString()
      }));

      setSubmissionList(submissionsWithDate);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSubmissionHistory();
  }, [problemId]);

  const handleSubmissionClick = async (submission: SubmissionHistoryType) => {
    setIsLoading(true); // Show loading state while fetching data
    try {
      const response = await problemAPI.getUpdateSubmission(submission.submissionId);
      setSelectedSubmission({
        ...response,
        isPassed: submission.status === "Accepted" ? true : false
      });
      setCurrentPanel("details"); // Switch to details panel
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentPanel("history");
    setSelectedSubmission(null);
  };

  if (isLoading) {
    return (
      <div className="mt-4 text-center text-gray3">
        <span>Loading...</span>
      </div>
    );
  }

  console.log("selectedSubmission", selectedSubmission);

  return (
    <div className="h-full pb-16 overflow-x-auto overflow-y-scroll">
      {currentPanel === "history" ? (
        submissionList.length === 0 ? (
          <div className="mt-4 text-center text-gray3">
            <span>No submission history</span>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            {/* Table Header */}
            <thead>
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
              {submissionList.map((submission, index) => (
                <tr
                  key={index}
                  onClick={() => handleSubmissionClick(submission)}
                  className={`${index % 2 === 0 ? "bg-gray6/60" : "bg-white"} cursor-pointer`}
                >
                  {/* Status */}
                  <td className="w-auto py-2 pl-6 whitespace-nowrap">
                    <div className="flex items-center gap-x-1">
                      {submission.status === "Accepted" ? (
                        <MdCheckCircleOutline className="w-5 h-5 icon-appEasy" />
                      ) : (
                        <MdOutlineCancel className="w-5 h-5 icon-appHard" />
                      )}
                      <div className="flex flex-col">
                        <span
                          className={`font-semibold text-sm ${submission.status === "Accepted" ? "text-appEasy" : "text-appHard"}`}
                        >
                          {submission.status}
                        </span>
                        {submission.submitDate && (
                          <span className="block text-xs text-gray2">{shortenDate(submission.submitDate)}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="w-auto px-6 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 text-sm rounded-lg text-gray2 bg-gray5">
                      {submission.programmingLanguage.split(" ")[0]}
                    </span>
                  </td>

                  {/* Runtime */}
                  <td className="w-auto px-6 py-2 whitespace-nowrap text-gray2">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{submission.runtime ? (submission.runtime * 1000).toFixed(0) : "N/A"} ms</span>
                    </div>
                  </td>

                  {/* Memory */}
                  <td className="w-auto px-6 py-2 text-sm whitespace-nowrap text-gray2">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-4 h-4" />
                      <span>{submission.memory ? (submission.memory / 1000).toFixed(1) : "N/A"} MB</span>
                    </div>
                  </td>

                  {/* Chevron Icon */}
                  <td className="w-auto px-6 py-2 text-left whitespace-nowrap text-gray2">
                    <ChevronRight className="w-5 h-5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        selectedSubmission && (
          <SubmissionInformation
            isPassed={selectedSubmission.isPassed}
            historyInformation={selectedSubmission}
            onBack={handleBack}
          />
          // <div>Hiii: {selectedSubmission.programmingLanguage} {selectedSubmission.isPassed ? "true" : "false"}</div>
        )
      )}
    </div>
  );
};
