import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { shortenDate } from "@/utils";

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
        <td className="px-4 py-3">
          <Skeleton className="h-4" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="w-3/4 h-4" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="w-1/2 h-4" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="w-1/4 h-4" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="w-1/4 h-4" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="w-1/2 h-4" />
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    return (
      <tr className={`${isOdd && "bg-gray5"} cursor-pointer`} onClick={handleSubmissionClick}>
        <td className="px-4 py-3">{shortenDate(submission?.submitDate ?? null)}</td>
        <td className="px-4 py-3 font-bold hover:text-appPrimary">{submission?.problem.problemName}</td>
        <td className={`py-3 px-4 font-bold ${submission?.isSolved ? "text-appEasy" : "text-appHard"}`}>
          {submission?.isSolved ? "Accepted" : "Wrong Answer"}
        </td>
        <td className="px-4 py-3">{`${submission?.runTime ? submission?.runTime.toFixed(1) : 0} ms`}</td>
        <td className="px-4 py-3">{`${submission?.usedMemory ? submission.usedMemory.toFixed(1) : 0} KB`}</td>
        <td className="px-4 py-3">{submission?.programmingLanguage}</td>
      </tr>
    );
  };

  return loading ? renderSkeleton() : renderContent();
}
