import { useEffect, useState, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { problemAPI } from "@/lib/api";
import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { SubmissionItem } from "./SubmissionItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { EmptyList, Separator } from "@/components/ui";

type SubmissionListProps = {
  userId: string;
  isPublic: boolean;
  profileLoading: boolean;
};

export const SubmissionList = memo(function SubmissionList(props: SubmissionListProps) {
  const { userId, isPublic, profileLoading } = props;

  const toast = useToast();
  const navigate = useNavigate();
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isMe = userId === reduxUser?.userId;

  const [submissions, setSubmissions] = useState<SendSubmissionType[]>([]);
  const [loading, setLoading] = useState(false);

  const getSubmissionListMeAPI = async () => {
    setLoading(true);
    try {
      const response = await problemAPI.getSubmissionListMe(userId, 0, 30);
      const { content } = response;
      setSubmissions(content);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting submission list" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPublic) {
      getSubmissionListMeAPI();
    }
  }, [userId, isPublic]);

  const handleViewAllSubmissionsClick = () => {
    navigate("/profile/submissions");
  };

  const renderSkeleton = () => {
    const placeholder = [1, 2, 3];

    return (
      <div className="flex flex-col overflow-auto max-h-[400px]">
        {placeholder.map((_, index) => (
          <SubmissionItem key={index} submission={null} isEven={index % 2 === 0} loading={loading} />
        ))}
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="flex flex-col overflow-auto max-h-[400px]">
        {submissions.map((submission, index) => (
          <SubmissionItem key={index} submission={submission} isEven={index % 2 === 0} loading={loading} />
        ))}
      </div>
    );
  };

  const renderEmpty = (message: string) => {
    return <EmptyList message={message} size="sm" />;
  };

  let content = null;
  if (loading || profileLoading) {
    content = renderSkeleton();
  } else if (!isPublic && !loading) {
    content = renderEmpty("This is a private profile. Submissions are only visible to the user.");
  } else if (isPublic && submissions.length > 0) {
    content = renderList();
  } else {
    content = renderEmpty("No submissions found. Try solving some problems!");
  }

  const renderViewAllSubmissions = () => {
    return (
      <p className="text-sm font-medium cursor-pointer" onClick={handleViewAllSubmissionsClick}>
        {"View all submissions >"}
      </p>
    );
  };

  return (
    <div className="w-full bg-white rounded-[10px] flex flex-col p-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-appPrimary">All Submissions</p>
        {isMe && submissions.length > 0 && renderViewAllSubmissions()}
      </div>
      <Separator className="my-2" />
      {content}
    </div>
  );
});
