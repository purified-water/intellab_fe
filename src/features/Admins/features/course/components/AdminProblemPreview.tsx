import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { problemAPI } from "@/lib/api";
import { ProblemType } from "@/types/ProblemType";
import { ProblemPreview } from "@/features/Admins/features/problem/components/CreateProblem/ProblemPreview/ProblemPreview";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export const AdminProblemPreview = () => {
  const [problemDetail, setProblemDetail] = useState<ProblemType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { problemId } = useParams<{ problemId: string }>();
  const [searchParams] = useSearchParams();
  const lessonName = searchParams.get("lessonName") || "Problem Preview";

  const fetchProblemDetail = async () => {
    if (!problemId) return;

    setIsLoading(true);
    try {
      const response = await problemAPI.getProblemDetail(problemId);
      setProblemDetail(response);
    } catch (error) {
      console.error("Error fetching problem detail", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemDetail();
  }, [problemId]);

  const renderHeader = () => (
    <div className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ChevronLeft className="cursor-pointer text-appPrimary" size={22} onClick={() => window.close()} />
        <div className="text-xl font-bold text-appPrimary">Back</div>
      </div>
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">{lessonName} - Problem Preview</h1>
        <p className="text-gray2">Admin Preview Mode - Submissions are for testing only</p>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="min-h-screen">
      {renderHeader()}
      <div className="container p-4 mx-auto">
        <div className="p-6 rounded-lg">
          <Skeleton className="w-3/4 h-8 mb-4" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-2/3 h-6 mb-6" />
          <Skeleton className="w-full h-96" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (!problemDetail) {
    return (
      <div className="min-h-screen">
        {renderHeader()}
        <div className="container p-4 mx-auto">
          <div className="p-6 text-center bg-white rounded-lg">
            <p className="text-gray3">Problem not found or failed to load.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {renderHeader()}
      <div className="container mx-auto">
        <ProblemPreview problemDetail={problemDetail} />
      </div>
    </div>
  );
};
