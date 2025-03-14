import { useState, useEffect } from "react";
import { courseAPI } from "@/lib/api";
import { ICourse } from "@/features/Course/types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { ProgressBar } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

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

  const accessToken = getAccessToken();

  const getCourseDetail = async () => {
    setAPILoading(true);
    const response = await courseAPI.getCourseDetail(courseId, userId);
    setCourseDetail(response.result);
    setAPILoading(false);
  };

  useEffect(() => {
    if (!skeletonLoading) {
      getCourseDetail();
    }
  }, [skeletonLoading]);

  const handleContinueCourse = () => {
    if (accessToken && userId) {
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
        <div onClick={handleViewCourseDetail} className="cursor-pointer">
          <h3 className="text-xl font-bold line-clamp-2">{courseDetail?.courseName}</h3>
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
            <p className="self-end mt-2 font-bold">{courseDetail?.price ? `${courseDetail?.price} VND` : "Free"}</p>
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
    <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg hover:shadow-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
      {skeletonLoading || apiLoading ? renderSkeleton() : renderContent()}
    </div>
  );
};
