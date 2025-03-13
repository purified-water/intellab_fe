import { useEffect } from "react";
import { ViewAllSubmissionList } from "../components/ViewAllSubmissions/ViewAllSubmissionList";

export function ViewAllSubmissionPage() {
  useEffect(() => {
    document.title = "All Submissions | Intellab";
  }, []);

  return (
    <div className="min-h-screen">
      <ViewAllSubmissionList />
    </div>
  );
}
