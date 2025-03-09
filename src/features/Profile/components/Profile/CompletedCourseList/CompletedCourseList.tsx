import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { courseAPI } from "@/lib/api";
import { CompletedCourseItem } from "./CompletedCourseItem";
import { ICompletedCourse } from "@/types";
import { API_RESPONSE_CODE } from "@/constants";

type CompletedCourseListProps = {
  userId: string;
};

export const CompletedCourseList = (props: CompletedCourseListProps) => {
  const { userId } = props;

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
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error getting completed course list" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompletedCourseListMeAPI();
  }, [userId]);

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

  const renderEmpty = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray3">No completed courses yet</p>
      </div>
    );
  };

  let content = null;
  if (loading) {
    content = renderSkeleton();
  } else if (courses.length > 0) {
    content = renderList();
  } else {
    content = renderEmpty();
  }

  return (
    <div className="w-full bg-white rounded-[10px] flex flex-col p-6 space-y-3">
      <p className="text-2xl font-bold text-appPrimary">Completed Courses</p>
      <div className="border-t-2 border-gray" />
      {content}
    </div>
  );
};
