import { useState, useEffect } from "react";
import { ViewAllSubmissionItem } from "./ViewAllSubmissionItem";
import { problemAPI } from "@/lib/api";
import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { getUserIdFromLocalStorage } from "@/utils";
import { ChevronLeft } from "lucide-react";

export function ViewAllSubmissionList() {
  const toast = useToast();
  const userId = getUserIdFromLocalStorage();

  const [submissions, setSubmissions] = useState<SendSubmissionType[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubmissionListMeAPI = async () => {
    try {
      const response = await problemAPI.getSubmissionListMe(userId);
      setSubmissions(response.reverse());
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting submission list" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubmissionListMeAPI();
  }, []);

  const renderSkeleton = () => {
    const placeHolders = [1, 2, 3];
    return placeHolders.map((_, index) => (
      <ViewAllSubmissionItem key={index} isOdd={index % 2 == 0} submission={null} loading={true} />
    ));
  };

  const renderList = () => {
    return submissions.map((submission, index) => (
      <ViewAllSubmissionItem key={index} isOdd={index % 2 == 0} submission={submission} loading={loading} />
    ));
  };

  let content = null;
  if (loading) {
    content = renderSkeleton();
  } else {
    content = renderList();
  }

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
          <tbody>{content}</tbody>
        </table>
      </div>
    </div>
  );
}
