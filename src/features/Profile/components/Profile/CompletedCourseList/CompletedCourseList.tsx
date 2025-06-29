import { useEffect, useState, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { courseAPI } from "@/lib/api";
import { CompletedCourseItem } from "./CompletedCourseItem";
import { ICompletedCourse } from "@/types";
import { API_RESPONSE_CODE } from "@/constants";
import { EmptyList, Separator } from "@/components/ui";

type CompletedCourseListProps = {
  userId: string;
  isPublic: boolean;
  profileLoading: boolean;
};

export const CompletedCourseList = memo(function CompletedCourseList(props: CompletedCourseListProps) {
  const { userId, isPublic, profileLoading } = props;

  const toast = useToast();

  const [courses, setCourses] = useState<ICompletedCourse[]>([]);
  const [loading, setLoading] = useState(false);

  const getCompletedCourseListMeAPI = async () => {
    setLoading(true);
    try {
      const response = await courseAPI.getCompletedCourseListMe(userId);
      const { code, message, result } = response;

      if (code == API_RESPONSE_CODE.SUCCESS) {
        setCourses(result);
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error getting completed course list" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting completed course list" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPublic) {
      getCompletedCourseListMeAPI();
    }
  }, [userId, isPublic]);

  const renderSkeleton = () => {
    const placeholder = [1, 2, 3];

    return (
      <div className="flex flex-col overflow-auto max-h-[400px]">
        {placeholder.map((_, index) => (
          <CompletedCourseItem key={index} course={null} isEven={index % 2 === 0} loading={loading} />
        ))}
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="flex flex-col overflow-auto max-h-[400px]">
        {courses.map((course, index) => (
          <CompletedCourseItem key={index} course={course} isEven={index % 2 === 0} loading={loading} />
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
    content = renderEmpty("This is a private profile. Completed courses are only visible to the user.");
  } else if (isPublic && courses.length > 0) {
    content = renderList();
  } else {
    content = renderEmpty("Finish courses to see them here!");
  }

  return (
    <div className="w-full bg-white rounded-[10px] flex flex-col p-6 space-y-3">
      <p className="text-xl font-bold text-appPrimary">Completed Courses</p>
      <Separator className="my-2" />
      {content}
    </div>
  );
});
