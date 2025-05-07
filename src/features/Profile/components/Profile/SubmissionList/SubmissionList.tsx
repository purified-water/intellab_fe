import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { problemAPI } from "@/lib/api";
import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";
import { SubmissionItem } from "./SubmissionItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

type SubmissionListProps = {
  userId: string;
};

export const SubmissionList = (props: SubmissionListProps) => {
  const { userId } = props;

  const toast = useToast();
  const navigate = useNavigate();
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isMe = userId === reduxUser?.userId;

  const [submissions, setSubmissions] = useState<SendSubmissionType[]>([]);
  const [loading, setLoading] = useState(false);

  const getSubmissionListMeAPI = async () => {
    setLoading(true);
    try {
      const response = await problemAPI.getSubmissionListMe(userId);
      setSubmissions(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting submission list" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubmissionListMeAPI();
  }, [userId]);

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

  const renderEmpty = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray3">No submissions yet!</p>
      </div>
    );
  };

  let content = null;
  if (loading) {
    content = renderSkeleton();
  } else if (submissions.length > 0) {
    content = renderList();
  } else {
    content = renderEmpty();
  }

  const renderViewAllSubmissions = () => {
    return (
      <p className="text-lg cursor-pointer text-gray3" onClick={handleViewAllSubmissionsClick}>
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
      <div className="border-t-2 border-gray" />
      {content}
    </div>
  );
};
