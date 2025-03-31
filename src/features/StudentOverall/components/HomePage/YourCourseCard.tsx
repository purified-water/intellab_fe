import { useState, useEffect } from "react";
import { courseAPI } from "@/lib/api";
import { ICourse } from "@/types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { ProgressBar } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

interface YourCourseCardProps {
  courseId: string;
  userId: string;
  progress: number;
  skeletonLoading?: boolean;
}

export const YourCourseCard = (props: YourCourseCardProps) => {
  const navigate = useNavigate();
  const toast = useToast();

  const { courseId, userId, progress, skeletonLoading } = props;

  const isFinished = progress === 100;

  const [courseDetail, setCourseDetail] = useState<ICourse | null>(null);
  const [apiLoading, setAPILoading] = useState(false);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const getCourseDetail = async () => {
    setAPILoading(true);
    const response = await courseAPI.getCourseDetail(courseId);
    setCourseDetail(response.result);
    setAPILoading(false);
  };

  useEffect(() => {
    if (!skeletonLoading) {
      getCourseDetail();
    }
  }, [skeletonLoading]);

  const handleContinueCourse = () => {
    if (isAuthenticated && userId) {
      if (isFinished) {
        navigate(`/certificate/${courseDetail?.certificateId}`);
      } else {
        if (courseDetail?.latestLessonId) {
          navigate(`/lesson/${courseDetail.latestLessonId}?courseId=${courseDetail.courseId}`);
        } else {
          navigate(`/course/${courseId}`);
        }
      }
    } else {
      showToastError({ toast: toast.toast, title: "Login required", message: "Please login to continue" });
    }
  };

  const handleViewCourseDetail = () => {
    navigate(`/course/${courseId}`);
  };

  const renderContent = () => {
    return (
      <>
        <div>
          <h3 className="text-xl font-bold cursor-pointer line-clamp-2" onClick={handleViewCourseDetail}>
            {courseDetail?.courseName}
          </h3>
          <p
            className={`text-sm mb-2 ${courseDetail?.courseName && courseDetail.courseName.length > 20 ? "line-clamp-1" : "line-clamp-2"}`}
          >
            {courseDetail?.description}
          </p>
        </div>
        <div>
          {courseDetail && <ProgressBar progress={courseDetail.progressPercent} showText={false} height={5} />}
          <div className="flex justify-between mt-2">
            <button
              className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
              onClick={handleContinueCourse}
            >
              {isFinished ? "View Certificate" : "Continue"}
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderSkeleton = () => {
    return (
      <div>
        <Skeleton className="h-6 mb-2 bg-gray5" />
        <Skeleton className="h-4 mb-2 bg-gray5" />
        <Skeleton className="h-4 mb-2 bg-gray5" />
        <Skeleton className="w-24 h-8 mt-5 bg-gray5" />
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col justify-between w-64 h-40 p-4 text-white transition-shadow duration-200 ease-in-out rounded-lg ${skeletonLoading || apiLoading ? "bg-gray6" : "bg-gradient-to-tr from-appSecondary to-appFadedPrimary"}  shrink-0 hover:shadow-lg`}
    >
      {skeletonLoading || apiLoading ? renderSkeleton() : renderContent()}
    </div>
  );
};
