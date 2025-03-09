import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { formatDate } from "@/utils";

type ViewSubmissionItemProps = {
  submission: SendSubmissionType | null;
  loading: boolean;
  isOdd: boolean;
};

export function ViewAllSubmissionItem(props: ViewSubmissionItemProps) {
  const { submission, loading, isOdd } = props;

  const navigate = useNavigate();

  const handleSubmissionClick = () => {
    navigate(`/problems/${submission?.problem.problemId}`);
  };

  const renderSkeleton = () => {
    return (
      <tr>
        <td className="py-3 px-4">
          <Skeleton className="h-4" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-4 w-3/4" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-4 w-1/2" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-4 w-1/4" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-4 w-1/4" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-4 w-1/2" />
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    return (
      <tr className={`${isOdd && "bg-gray5"} cursor-pointer hover:opacity-80`} onClick={handleSubmissionClick}>
        <td className="py-3 px-4">{formatDate(submission?.submitDate ?? "")}</td>
        <td className="py-3 px-4 text-appPrimary font-bold">{submission?.problem.problemName}</td>
        <td className={`py-3 px-4 font-bold ${submission?.isSolved ? "text-appEasy" : "text-appHard"}`}>
          {submission?.isSolved ? "Accepted" : "Wrong Answer"}
        </td>
        <td className="py-3 px-4">{`${submission?.runTime ? submission?.runTime.toFixed(1) : 0} ms`}</td>
        <td className="py-3 px-4">{`${submission?.usedMemory ? submission.usedMemory.toFixed(1) : 0} KB`}</td>
        <td className="py-3 px-4">{submission?.programmingLanguage}</td>
      </tr>
    );
  };

  return loading ? renderSkeleton() : renderContent();
}
