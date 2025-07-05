import { AlertTriangle, CheckCircle, Clock, ExternalLink, Shield } from "lucide-react";
import { MOSSResult } from "../../types/SubmissionType";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import {
  PLAGIARISM_THRESHOLDS,
  getPlagiarismStatus,
  getPlagiarismStatusColor,
  getPlagiarismStatusBgColor,
  getPlagiarismStatusText
} from "@/constants/plagiarismThresholds";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";

interface MOSSResultProps {
  mossResults?: MOSSResult[];
  programmingLanguage?: string;
  isLoading?: boolean;
  onViewFullReport?: () => void;
}

interface MOSSMatchCardProps {
  match: MOSSResult;
  onViewDetails?: () => void;
}

const MOSSMatchCard = ({ match, onViewDetails }: MOSSMatchCardProps) => {
  const status = getPlagiarismStatus(match.percent);
  const colorClass = getPlagiarismStatusColor(status);
  const bgColorClass = getPlagiarismStatusBgColor(status);

  return (
    <div className={`p-4 rounded-lg border ${bgColorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full">
            <img src={DEFAULT_AVATAR} alt="User Avatar" className="object-cover w-full h-full rounded-full" />
          </div>
          <div>
            <div className="text-sm font-medium">{match.username2}</div>
            <div className="text-xs text-gray-500">ID: {match.userId2}</div>
          </div>
        </div>
        <div className={`text-right ${colorClass}`}>
          <div className="text-lg font-bold">{match.percent.toFixed(1)}%</div>
          <div className="text-xs">similarity</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 text-sm text-gray2">
        <span className={colorClass}>{getPlagiarismStatusText(status)}</span>
        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={onViewDetails} className="text-xs">
            View Details
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>

      <span className="text-sm">Match Code:</span>
      <div className="w-full px-4 py-2 mt-2 overflow-x-auto bg-white rounded-lg">
        <pre className="text-sm whitespace-pre-wrap">{match.matchCode}</pre>
      </div>
    </div>
  );
};

export const MOSSResultComponent = ({
  mossResults,
  programmingLanguage,
  isLoading,
  onViewFullReport
}: MOSSResultProps) => {
  const [showAllMatches, setShowAllMatches] = useState(false);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg border-appMedium bg-yellow-50">
        <div className="flex items-center space-x-3">
          <Clock className="size-5 text-appMedium" />
          <div>
            <div className="font-medium">Plagiarism Analysis</div>
            <div className="text-sm text-gray-600">Analysis in progress...</div>
          </div>
        </div>
      </div>
    );
  }

  // Determine which data to use
  const resultsToDisplay = mossResults || [];

  // If no results
  if (resultsToDisplay.length === 0) {
    return (
      <div className="p-6 text-center border border-green-200 rounded-lg bg-green-50">
        <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <div className="font-medium text-green-700">No plagiarism detected</div>
        <div className="text-sm text-green-600">This submission appears to be original</div>
      </div>
    );
  }

  // Calculate overall statistics
  const maxSimilarity = Math.max(...resultsToDisplay.map((r) => r.percent));
  const overallStatus = getPlagiarismStatus(maxSimilarity);
  const statusColorClass = getPlagiarismStatusColor(overallStatus);
  const statusBgColorClass = getPlagiarismStatusBgColor(overallStatus);

  const getStatusIcon = () => {
    if (maxSimilarity < PLAGIARISM_THRESHOLDS.SUSPICIOUS) {
      return <CheckCircle className="size-5 text-appEasy" />;
    } else if (maxSimilarity < PLAGIARISM_THRESHOLDS.HIGH_RISK) {
      return <AlertTriangle className="size-5 text-appMedium" />;
    } else {
      return <AlertTriangle className="size-5 text-appHard" />;
    }
  };

  const displayedMatches = showAllMatches ? resultsToDisplay : resultsToDisplay.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className={`p-4 rounded-lg border ${statusBgColorClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <div className="font-medium">Plagiarism Analysis</div>
              <div className="text-sm text-gray2">
                {programmingLanguage && `Language: ${programmingLanguage} • `}
                {getPlagiarismStatusText(overallStatus)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${statusColorClass}`}>{maxSimilarity.toFixed(1)}%</div>
            <div className="text-xs text-gray2">max similarity</div>
          </div>
        </div>

        {onViewFullReport && (
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={onViewFullReport} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full MOSS Report
            </Button>
          </div>
        )}
      </div>

      {/* Matches */}
      {resultsToDisplay.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Similar Submissions Found</h4>
            <span className="text-sm text-gray2">
              {resultsToDisplay.length} match{resultsToDisplay.length !== 1 ? "es" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {displayedMatches.map((match, index) => (
              <MOSSMatchCard key={match.matchCode || index} match={match} />
            ))}
          </div>

          {resultsToDisplay.length > 3 && (
            <div className="mt-3 text-center">
              <Button variant="ghost" size="sm" onClick={() => setShowAllMatches(!showAllMatches)}>
                {showAllMatches ? "Show Less" : `Show All ${resultsToDisplay.length} Matches`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
