import { useState, useEffect } from "react";
import { ViewAllSubmissionItem } from "./ViewAllSubmissionItem";
import { problemAPI } from "@/lib/api";
import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { getUserIdFromLocalStorage } from "@/utils";
import { ChevronLeft, CircleChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { Spinner } from "@/components/ui";

export function ViewAllSubmissionList() {
  const toast = useToast();
  const userId = getUserIdFromLocalStorage();

  const [submissions, setSubmissions] = useState<SendSubmissionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  const getSubmissionListMeAPI = async (page: number) => {
    setLoading(true);
    try {
      const response = await problemAPI.getSubmissionListMe(userId, page);
      const { number, totalPages: fetchedTotalPages, content } = response;
      setCurrentPage(number);
      if (totalPages === undefined) {
        setTotalPages(fetchedTotalPages);
      }
      setSubmissions((prev) => [...prev, ...content]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting submission list" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubmissionListMeAPI(currentPage);
  }, []);

  const renderList = () => {
    return submissions.map((submission, index) => (
      <ViewAllSubmissionItem key={index} isOdd={index % 2 == 0} submission={submission} loading={false} />
    ));
  };

  const renderViewMore = () => {
    if (loading) {
      return <Spinner loading={loading} />;
    } else if (totalPages && currentPage + 1 < totalPages) {
      return (
        <Button type="button" disabled={loading} onClick={() => getSubmissionListMeAPI(currentPage + 1)}>
          View more
          <CircleChevronDown />
        </Button>
      );
    } else {
      return <p className="text-gray3 text-lg">No more submissions to show!</p>;
    }
  };

  return (
    <div className="container p-4 mx-auto mt-8">
      <h1
        className="flex items-center mb-8 text-2xl font-bold cursor-pointer hover:text-appPrimary"
        onClick={() => window.history.back()}
      >
        <ChevronLeft className="mr-1" />
        All My Submissions
      </h1>{" "}
      <div className="flex justify-center overflow-x-auto">
        <table className="min-w-fit w-[1200px] table-auto">
          <thead className="text-base text-gray2">
            <tr className="font-semibold text-left border-b border-gray3">
              <th className="px-4 py-3 border-b">Time submitted</th>
              <th className="px-4 py-3 border-b">Title</th>
              <th className="px-4 py-3 border-b">Result</th>
              <th className="px-4 py-3 border-b">Runtime</th>
              <th className="px-4 py-3 border-b">Memory</th>
              <th className="px-4 py-3 border-b">Language</th>
            </tr>
          </thead>
          <tbody>{renderList()}</tbody>
        </table>
      </div>
      <div className="flex flex-col items-center space-y-4 mt-4">{renderViewMore()}</div>
    </div>
  );
}
