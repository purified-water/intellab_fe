import { useState, useEffect } from "react";
import { ICourse } from "@/types";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { getUserIdFromLocalStorage } from "@/utils";
import { courseAPI } from "@/lib/api";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";

interface CourseSectionCardProps {
  course: ICourse;
  skeletonLoading?: boolean;
}

export function CourseSectionCard(props: CourseSectionCardProps) {
  const navigate = useNavigate();
  const { skeletonLoading, course } = props;

  const [internalLoading, setInternalLoading] = useState(false);
  const [detailCourse, setCourse] = useState<ICourse | null>(null);

  const userId = getUserIdFromLocalStorage();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status == PREMIUM_STATUS.ACTIVE;
  const includedInPremiumPlan =
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.COURSE ||
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.PREMIUM;

  const getCourseDetail = async () => {
    setInternalLoading(true);
    if (userId) {
      const response = await courseAPI.getCourseDetail(course.courseId);
      setCourse(response.result);
    }
    setInternalLoading(false);
  };

  const handleTitleClick = () => {
    navigate(`/course/${detailCourse?.courseId}`);
  };

  const handleCourseClicked = async () => {
    if (isAuthenticated) {
      if (detailCourse) {
        if (detailCourse.userEnrolled) {
          navigate(`/lesson/${detailCourse?.latestLessonId}`);
        } else {
          navigate(`/course/${course.courseId}`);
        }
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

  const buttonText = (courseObject: ICourse) => {
    let buttonText = null;
    if (courseObject?.userEnrolled) {
      buttonText = "Continue";
    } else if (courseObject.price == 0 || (includedInPremiumPlan && isCurrentPlanActive)) {
      buttonText = "Enroll";
    } else {
      buttonText = "Purchase";
    }
    return buttonText;
  };

  const renderCourseDetail = () => {
    let displayPrice = `${detailCourse?.price.toLocaleString()} VND`;
    if (detailCourse?.price === 0 || includedInPremiumPlan) {
      displayPrice = "Free";
    }

    return (
      <div className="flex flex-col justify-between w-64 h-40 p-4 text-white transition-shadow duration-200 ease-in-out rounded-lg hover:shadow-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
        <div>
          <h3 className="text-xl font-bold cursor-pointer line-clamp-2" onClick={handleTitleClick}>
            {detailCourse?.courseName}
          </h3>
          <p
            className={`text-sm mb-2 ${detailCourse?.courseName && detailCourse.courseName.length > 20 ? "line-clamp-1" : "line-clamp-2"}`}
          >
            {detailCourse?.description}
          </p>
          {detailCourse?.userEnrolled && (
            <ProgressBar progress={detailCourse!.progressPercent} showText={false} height={5} />
          )}
        </div>
        {detailCourse && (
          <div className="flex justify-between mt-2">
            <button
              className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
              onClick={handleCourseClicked}
            >
              {buttonText(detailCourse!)}
            </button>
            <p className="self-end mt-2 font-bold">{displayPrice}</p>
          </div>
        )}
      </div>
    );
  };

  const renderDetail = () => {
    let displayPrice = `${course?.price.toLocaleString()} VND`;
    if (course?.price === 0 || (includedInPremiumPlan && isCurrentPlanActive)) {
      displayPrice = "Free";
    }

    return (
      <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
        <div>
          <h3 className="text-xl font-bold cursor-pointer line-clamp-2" onClick={handleCourseClicked}>
            {course?.courseName}
          </h3>
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
            {buttonText(course)}
          </button>
          <p className="self-end mt-2 font-bold">{displayPrice}</p>
        </div>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="flex flex-col justify-between w-64 h-40 p-4 mt-2 rounded-lg bg-gray6 shrink-0">
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
    if (userId && isAuthenticated) {
      content = renderCourseDetail();
    } else {
      content = renderDetail();
    }
  }

  return content;
}
