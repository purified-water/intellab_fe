import { AlertTriangle, CheckCircle, Clock, ExternalLink, Shield, Users } from "lucide-react";
import { MOSSResult, MOSSMatch } from "../../types/SubmissionType";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface MOSSResultProps {
  mossResult: MOSSResult;
  onViewFullReport?: () => void;
}

interface MOSSMatchCardProps {
  match: MOSSMatch;
  onViewDetails?: () => void;
}

const MOSSMatchCard = ({ match, onViewDetails }: MOSSMatchCardProps) => {
  const getSimilarityColor = (percentage: number) => {
    if (percentage >= 80) return "text-appHard";
    if (percentage >= 50) return "text-appMedium";
    return "text-appEasy";
  };

  const getSimilarityBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-50 border-red-200";
    if (percentage >= 50) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <div className={`p-4 rounded-lg border ${getSimilarityBgColor(match.similarityPercentage)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium">{match.studentName}</div>
            <div className="text-xs text-gray-500">ID: {match.studentId}</div>
          </div>
        </div>
        <div className={`text-right ${getSimilarityColor(match.similarityPercentage)}`}>
          <div className="text-lg font-bold">{match.similarityPercentage}%</div>
          <div className="text-xs">similarity</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
        <span>
          {match.matchedLines} / {match.totalLines} lines matched
        </span>
        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={onViewDetails} className="text-xs">
            View Details
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>

      {match.codeSnippet && (
        <div className="mt-2">
          <div className="mb-1 text-xs text-gray-500">Similar code snippet:</div>
          <div className="p-2 overflow-x-auto font-mono text-xs bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">{match.codeSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export const MOSSResultComponent = ({ mossResult, onViewFullReport }: MOSSResultProps) => {
  const [showAllMatches, setShowAllMatches] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "analyzed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "flagged":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "failed":
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      default:
        return <Shield className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Analysis in progress...";
      case "analyzed":
        return "Analysis complete";
      case "flagged":
        return "Potential plagiarism detected";
      case "failed":
        return "Analysis failed";
      default:
        return "Unknown status";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "analyzed":
        return "bg-green-50 border-green-200";
      case "flagged":
        return "bg-red-50 border-red-200";
      case "failed":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const displayedMatches = showAllMatches ? mossResult.matches || [] : (mossResult.matches || []).slice(0, 3);

  if (mossResult.status === "pending") {
    return (
      <div className={`p-4 rounded-lg border ${getStatusBgColor(mossResult.status)}`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon(mossResult.status)}
          <div>
            <div className="font-medium">Plagiarism Analysis</div>
            <div className="text-sm text-gray-600">{getStatusText(mossResult.status)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className={`p-4 rounded-lg border ${getStatusBgColor(mossResult.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(mossResult.status)}
            <div>
              <div className="font-medium">Plagiarism Analysis</div>
              <div className="text-sm text-gray-600">{getStatusText(mossResult.status)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{mossResult.similarityScore.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">overall similarity</div>
          </div>
        </div>

        {mossResult.analyzedAt && (
          <div className="mt-2 text-xs text-gray-500">
            Analyzed on {new Date(mossResult.analyzedAt).toLocaleString()}
          </div>
        )}

        {mossResult.reportUrl && onViewFullReport && (
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={onViewFullReport} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full MOSS Report
            </Button>
          </div>
        )}
      </div>

      {/* Matches */}
      {mossResult.matches && mossResult.matches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Similar Submissions Found</h4>
            <span className="text-sm text-gray-500">
              {mossResult.matches.length} match{mossResult.matches.length !== 1 ? "es" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {displayedMatches.map((match) => (
              <MOSSMatchCard key={match.matchId} match={match} />
            ))}
          </div>

          {mossResult.matches.length > 3 && (
            <div className="mt-3 text-center">
              <Button variant="ghost" size="sm" onClick={() => setShowAllMatches(!showAllMatches)}>
                {showAllMatches ? "Show Less" : `Show All ${mossResult.matches.length} Matches`}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* No matches found */}
      {mossResult.status === "analyzed" && (!mossResult.matches || mossResult.matches.length === 0) && (
        <div className="p-6 text-center border border-green-200 rounded-lg bg-green-50">
          <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="font-medium text-green-700">No plagiarism detected</div>
          <div className="text-sm text-green-600">This submission appears to be original</div>
        </div>
      )}
    </div>
  );
};
