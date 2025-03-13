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
    navigate(`/problems/${submission?.problem.problemId}`);
  };

  const renderSkeleton = () => {
    const categoriesPlaceholder = [1, 2, 3];

    return (
      <div
        className={`flex items-center justify-between py-4 px-7 rounded-xl ${isEven ? "bg-gray6" : "bg-white"} cursor-pointer`}
      >
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <div className="flex space-x-2">
            {categoriesPlaceholder.map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
    );
  };

  const renderSubmission = () => {
    const renderSubmissionInformation = () => {
      return (
        <div className="space-y-2">
          <p className="font-bold text-xl">{submission?.problem.problemName}</p>
          <div className="flex space-x-2">
            {submission?.problem.categories.map((category, index) => (
              <div key={index} className="text-gray2 bg-gray5 py-1 px-3 rounded-full font-bold">
                {category.name}
              </div>
            ))}
          </div>
          <p className="text-gray2">Submitted on {shortenDate(submission?.submitDate)}</p>
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
          <p className={`font-bold text-xl ${textColor}`}>{status}</p>
        </div>
      );
    };

    return (
      <div
        className={`flex items-center justify-between py-4 px-7 rounded-xl ${isEven ? "bg-gray6" : "bg-white"} cursor-pointer hover:opacity-80`}
        onClick={handleClick}
      >
        {renderSubmissionInformation()}
        {renderStatus()}
      </div>
    );
  };

  return loading || !submission ? renderSkeleton() : renderSubmission();
}
