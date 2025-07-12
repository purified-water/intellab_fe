import { Button } from "@/components/ui/Button";
import { CheckCircle, ExternalLink } from "lucide-react";
import { MOSSResultComponent } from "./MOSSResult";
import { Spinner } from "@/components/ui";
import { useGetMossResult } from "../../hooks/useMoss";
import { MOSSResult } from "../../types/SubmissionType";

interface MOSSSectionProps {
  submissionId: string;
  language: string;
  viewingPage?: boolean;
  existingMossResults?: MOSSResult[];
  onViewDetailedReport?: () => void;
}

export const MOSSSection = ({
  submissionId,
  language,
  viewingPage = false,
  existingMossResults,
  onViewDetailedReport
}: MOSSSectionProps) => {
  // Use MOSS hook for passed submissions
  const { data: mossResults, isLoading: isMossLoading } = useGetMossResult(submissionId);

  if (!mossResults && !existingMossResults && !isMossLoading) {
    // If no MOSS results and not loading, return null
    return null;
  }

  const handleViewMossReport = () => {
    if (mossResults && mossResults.length > 0) {
      window.open(mossResults[0].reportUrl, "_blank");
    } else if (existingMossResults && existingMossResults.length > 0) {
      window.open(existingMossResults[0].reportUrl, "_blank");
    }
  };

  return (
    <div className="mt-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Plagiarism Detection</h3>
        {!viewingPage && onViewDetailedReport && (
          <Button variant="outline" onClick={onViewDetailedReport}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Detail
          </Button>
        )}
      </div>

      {isMossLoading ? (
        <div className="p-6 text-center border rounded-lg bg-purple-50">
          <div className="flex items-center justify-center space-x-3">
            <div>
              <Spinner className="w-5 h-5 text-appPrimary" loading={isMossLoading} />
              <div className="font-medium text-appPrimary">Analyzing for Plagiarism</div>
              <div className="text-sm text-appPrimary">
                Please wait while we check your submission for similarities. This may take a few moments.
              </div>
            </div>
          </div>
        </div>
      ) : mossResults && mossResults.length > 0 ? (
        <MOSSResultComponent
          mossResults={mossResults}
          programmingLanguage={language}
          onViewFullReport={handleViewMossReport}
        />
      ) : (
        <div className="p-6 border rounded-lg border-appEasy bg-green-50">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-appEasy" />
            <div className="font-medium text-appEasy">No Plagiarism Detected</div>
            <div className="text-sm text-appEasy/80">
              Your submission appears to be original. No similarities found.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
