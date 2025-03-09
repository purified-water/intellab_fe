import { useState, useEffect } from "react";
import { ViewAllSubmissionItem } from "./ViewAllSubmissionItem";
import { problemAPI } from "@/lib/api";
import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { getUserIdFromLocalStorage } from "@/utils";

export function ViewAllSubmissionList() {
  const toast = useToast();
  const userId = getUserIdFromLocalStorage();

  const [submissions, setSubmissions] = useState<SendSubmissionType[]>([]);
  const [loading, setLoading] = useState(true);

  const getSubmissionListMeAPI = async () => {
    try {
      const response = await problemAPI.getSubmissionListMe(userId);
      setSubmissions(response.reverse());
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error getting submission list" });
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
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-4">All my submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-gray3 text-lg">
            <tr className="text-left font-semibold text-gray-700 border-b border-gray3">
              <th className="py-3 px-4 border-b">Time submitted</th>
              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">Result</th>
              <th className="py-3 px-4 border-b">Runtime</th>
              <th className="py-3 px-4 border-b">Memory</th>
              <th className="py-3 px-4 border-b">Language</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </div>
  );
}
