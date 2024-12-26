import { useState, useEffect } from "react";
import { courseAPI } from "@/lib/api";
import { ICourse } from "@/features/Course/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/utils";
import { DEFAULT_COURSE } from "@/constants/defaultData";

interface YourCourseCardProps {
  courseId: string;
  userId: string;
  progress: number;
  skeletonLoading?: boolean;
}

export const YourCourseCard = (props: YourCourseCardProps) => {
  const navigate = useNavigate();

  const { courseId, userId, progress, skeletonLoading } = props;

  const isFinished = progress === 100;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [apiLoading, setAPILoading] = useState(false);

  const accessToken = getAccessToken();

  const getCourseDetail = async () => {
    setAPILoading(true);
    const response = await courseAPI.getCourseDetail(courseId, userId);
    setCourse(response.result);
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
        // View certificate
      } else {
        navigate(`/lesson/${course?.latestLessonId}`);
      }
    } else {
      alert("Please login to continue");
    }
  };

  const handleViewCourseDetail = () => {
    navigate(`/course/${courseId}`);
  }

  const renderContent = () => {
    return (
      <>
        <div onClick={handleViewCourseDetail} className="cursor-pointer">
          <h3 className="text-xl font-bold line-clamp-2">{course?.courseName}</h3>
          <p className={`text-sm mb-2 ${course?.courseName && course.courseName.length > 20 ? 'line-clamp-1' : 'line-clamp-2'}`}>{course?.description}</p>
          <ProgressBar progress={course ? course.progressPercent : DEFAULT_COURSE.progressPercent} showText={false} height={5} />
        </div>

        <div className="flex justify-between mt-2">
          <button
            className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
            onClick={handleContinueCourse}
          >
            {isFinished ? "View certificate" : "Continue"}
          </button>
          <p className="self-end mt-2 font-bold">{course?.price ? `${course?.price} VND` : "Free"}</p>
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
    <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
      {skeletonLoading || apiLoading ? renderSkeleton() : renderContent()}
    </div>
  );
};
