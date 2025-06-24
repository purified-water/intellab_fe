import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { shortenDate } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type SubmissionItemProps = {
  submission: SendSubmissionType | null;
  isEven: boolean;
  loading: boolean;
};

export function SubmissionItem(props: SubmissionItemProps) {
  const { submission, isEven = false, loading } = props;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/submissions/${submission?.submissionId}`);
  };

  const renderSkeleton = () => {
    const categoriesPlaceholder = [1, 2, 3];

    return (
      <div
        className={`flex items-center justify-between py-4 px-7 rounded-xl ${isEven ? "bg-gray6/50" : "bg-white"} cursor-pointer`}
      >
        <div className="space-y-3">
          <Skeleton className="w-48 h-6" />
          <div className="flex space-x-2">
            {categoriesPlaceholder.map((_, index) => (
              <Skeleton key={index} className="w-20 h-6 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="w-24 h-6" />
      </div>
    );
  };

  const renderSubmission = () => {
    const renderSubmissionInformation = () => {
      return (
        <div className="space-y-2">
          <p className="text-base font-bold">{submission?.problem.problemName}</p>
          <div className="flex space-x-2">
            {submission &&
              submission?.problem.categories.map((category, index) => (
                <div key={index} className="px-2 py-1 text-xs font-bold rounded-full text-gray2 bg-gray5 line-clamp-1">
                  {category.name}
                </div>
              ))}
          </div>
          <p className="text-sm text-gray3">Submitted on {shortenDate(submission!.submitDate)}</p>
        </div>
      );
    };

    const renderStatus = () => {
      let status = "";
      let textColor = "";

      if (submission?.isSolved) {
        status = "Solved";
        textColor = "text-green-500";
      } else {
        status = "Wrong Answer";
        textColor = "text-red-500";
      }

      return (
        <div>
          <p className={`font-bold text-base ${textColor}`}>{status}</p>
        </div>
      );
    };

    return (
      <div
        className={`flex items-center justify-between py-3 px-6 rounded-xl ${isEven ? "bg-gray6/50" : "bg-white"} cursor-pointer hover:opacity-80`}
        onClick={handleClick}
      >
        {renderSubmissionInformation()}
        {renderStatus()}
      </div>
    );
  };

  return loading || !submission ? renderSkeleton() : renderSubmission();
}
