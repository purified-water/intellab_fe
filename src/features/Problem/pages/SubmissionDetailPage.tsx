import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Skeleton } from "@/components/ui";
import { Shield, AlertTriangle, CheckCircle, Clock, Code, ChevronLeft } from "lucide-react";
import { SubmissionTypeNoProblem, MOSSResult } from "../types/SubmissionType";
import { SubmissionInformation } from "../components/RenderDescription/SubmissionInformation";
import { SEO } from "@/components/SEO";
import { problemAPI } from "@/lib/api";

// Mock data generator - replace with actual API call later
const generateMockMOSSResult = (submissionId: string): MOSSResult => {
  const random = Math.random();
  const similarityScore = Math.floor(random * 100);

  const mockMatches = [
    {
      matchId: "match-1",
      submissionId: "sub-456",
      studentName: "Alice Johnson",
      studentId: "ST001",
      similarityPercentage: 85,
      matchedLines: 42,
      totalLines: 50,
      codeSnippet: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}`
    },
    {
      matchId: "match-2",
      submissionId: "sub-789",
      studentName: "Bob Smith",
      studentId: "ST002",
      similarityPercentage: 67,
      matchedLines: 33,
      totalLines: 50,
      codeSnippet: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`
    },
    {
      matchId: "match-3",
      submissionId: "sub-101",
      studentName: "Carol Davis",
      studentId: "ST003",
      similarityPercentage: 52,
      matchedLines: 26,
      totalLines: 50,
      codeSnippet: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`
    }
  ];

  return {
    analysisId: `analysis-${submissionId}`,
    similarityScore,
    status: similarityScore > 70 ? "flagged" : "analyzed",
    reportUrl: `https://moss.stanford.edu/results/${submissionId}`,
    analyzedAt: new Date().toISOString(),
    matches: similarityScore > 30 ? mockMatches.slice(0, Math.ceil(similarityScore / 30)) : [],
    threshold: 50
  };
};

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

        // Add mock MOSS result for demo purposes (remove when MOSS API is ready)
        const mockMOSS = generateMockMOSSResult(submissionId || "");

        setSubmissionData({
          ...response,
          mossResult: response.mossResult || mockMOSS // Use existing MOSS data if available, otherwise use mock
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

  const getStatusIcon = (status: string, size: string = "sm") => {
    let iconSize = "w-6 h-6";
    if (size === "lg") {
      iconSize = "w-8 h-8";
    }
    switch (status) {
      case "pending":
        return <Clock className={`${iconSize} text-appMedium`} />;
      case "analyzed":
        return <CheckCircle className={`${iconSize} text-appEasy`} />;
      case "flagged":
        return <AlertTriangle className={`${iconSize} text-appHard`} />;
      case "failed":
        return <AlertTriangle className={`${iconSize} text-appHard`} />;
      default:
        return <CheckCircle className={`${iconSize} text-appInfo`} />;
    }
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

              {submissionData.mossResult && (
                <div className="flex items-center space-x-3">
                  {getStatusIcon(submissionData.mossResult.status)}
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      Plagiarism: {submissionData.mossResult.similarityScore.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {submissionData.mossResult.status === "flagged" ? "Flagged" : "Analyzed"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-6xl p-6 mx-auto space-y-6">
          {/* Summary Cards */}
          {submissionData.mossResult && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-appInfo" />
                  <div>
                    <div className="text-2xl font-bold">{submissionData.mossResult.similarityScore.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Overall Similarity</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(submissionData.mossResult.status, "lg")}
                  <div>
                    <div className="text-2xl font-bold">{submissionData.mossResult.matches?.length || 0}</div>
                    <div className="text-sm text-gray-600">Similar Submissions</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <Code className="w-8 h-8 text-gray-500" />
                  <div>
                    <div className="text-xl font-bold">{submissionData.programmingLanguage}</div>
                    <div className="text-sm text-gray-600">Language</div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
