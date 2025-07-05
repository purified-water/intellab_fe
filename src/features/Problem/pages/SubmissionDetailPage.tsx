import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Skeleton } from "@/components/ui";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { SubmissionTypeNoProblem } from "../types/SubmissionType";
import { SubmissionInformation } from "../components/RenderDescription/SubmissionInformation";
import { SEO } from "@/components/SEO";
import { problemAPI } from "@/lib/api";

export const SubmissionDetailPage = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [submissionData, setSubmissionData] = useState<SubmissionTypeNoProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Call the real API to get submission data
        const response = await problemAPI.getUpdateSubmission(submissionId!);

        setSubmissionData({
          ...response
        });
      } catch (err) {
        console.error("Error fetching submission data:", err);
        setError("Failed to load submission data");
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) {
      fetchSubmissionData();
    }
  }, [submissionId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container max-w-6xl p-6 mx-auto">
        <Skeleton className="h-8 mb-4 bg-gray-200 rounded"></Skeleton>
        <Skeleton className="h-64 mb-4 bg-gray-200 rounded"></Skeleton>
        <Skeleton className="h-32 bg-gray-200 rounded"></Skeleton>
      </div>
    );
  }

  if (error || !submissionData) {
    return (
      <div className="container max-w-6xl p-6 mx-auto">
        <div className="py-12 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-600">Submission Not Found</h2>
          <p className="mb-4 text-gray-500">{error || "The requested submission could not be found."}</p>
          <Button onClick={handleBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Problem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={`Submission ${submissionId} | Intellab`} />
      <div className="min-h-screen mb-8">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container max-w-6xl p-6 mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={handleBack} className="p-2">
                  <ChevronLeft />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-appPrimary">Submission Details</h1>
                  <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                    <span>Submission ID: {submissionId}</span>
                    <span>•</span>
                    <span>Language: {submissionData.programmingLanguage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-6xl p-6 mx-auto space-y-6">
          {/* Submission Information Component */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Submission Details</h2>
            </div>
            <SubmissionInformation
              isPassed={submissionData.isSolved}
              historyInformation={submissionData}
              onBack={handleBack}
              viewingPage={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};
