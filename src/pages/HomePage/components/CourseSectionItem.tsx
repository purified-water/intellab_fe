import { useState, useEffect } from "react";
import { ICourse } from "@/features/Course/types";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserIdFromLocalStorage, getAccessToken } from "@/utils";
import { courseAPI } from "@/lib/api";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

interface CourseSectionCardProps {
  course: ICourse;
  skeletonLoading?: boolean;
}

export function CourseSectionCard(props: CourseSectionCardProps) {
  const navigate = useNavigate();
  const { skeletonLoading, course } = props;

  const [internalLoading, setInternalLoading] = useState(false);
  const [detailCourse, setCourse] = useState<ICourse | null>(null);

  const accessToken = getAccessToken();
  const userId = getUserIdFromLocalStorage();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const getCourseDetail = async () => {
    setInternalLoading(true);
    if (userId) {
      const response = await courseAPI.getCourseDetail(course.courseId, userId);
      setCourse(response.result);
    }
    setInternalLoading(false);
  };

  const handleCourseClicked = () => {
    if (isAuthenticated) {
      if (detailCourse)
        if (detailCourse.userEnrolled) {
          navigate(`/lesson/${detailCourse?.latestLessonId}`);
        }
    } else {
      navigate(`/course/${course.courseId}`);
    }
  };

  useEffect(() => {
    if (!skeletonLoading) {
      getCourseDetail();
    }
  }, [skeletonLoading]);

  const renderCourseDetail = () => (
    <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
      <div>
        <h3 className="text-xl font-bold line-clamp-2">{detailCourse?.courseName}</h3>
        <p className="mb-2 text-sm line-clamp-1">{detailCourse?.description}</p>
        {detailCourse?.userEnrolled && (
          <ProgressBar progress={detailCourse!.progressPercent} showText={false} height={5} />
        )}
      </div>
      <div className="flex justify-between mt-2">
        <button
          className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
          onClick={handleCourseClicked}
        >
          {detailCourse?.userEnrolled ? "Continue" : "Study now"}
        </button>
        <p className="self-end mt-2 font-bold">{detailCourse?.price ? `đ${detailCourse?.price}` : "Free"}</p>
      </div>
    </div>
  );

  const renderDetail = () => (
    <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
      <div>
        <h3 className="text-xl font-bold line-clamp-2">{course?.courseName}</h3>
        <p
          className={`text-sm mb-2 ${course?.courseName && course.courseName.length > 10 ? "line-clamp-1" : "line-clamp-2"}`}
        >
          {course?.description}
        </p>
      </div>
      <div className="flex justify-between mt-2">
        <button
          className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
          onClick={handleCourseClicked}
        >
          {course?.userEnrolled ? "Continue" : "Study now"}
        </button>
        <p className="self-end mt-2 font-bold">{course?.price ? `${course?.price} VND` : "Free"}</p>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="flex flex-col justify-between w-64 h-40 p-4 rounded-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
      <Skeleton className="h-6 mb-2 bg-gray5" />
      <Skeleton className="h-4 mb-2 bg-gray5" />
      <Skeleton className="h-4 mb-2 bg-gray5" />
      <Skeleton className="w-24 h-8 mt-5 bg-gray5" />
    </div>
  );

  let content;

  if (skeletonLoading || internalLoading) {
    content = renderSkeleton();
  } else {
    if (userId && accessToken) {
      content = renderCourseDetail();
    } else {
      content = renderDetail();
    }
  }

  return content;
}
