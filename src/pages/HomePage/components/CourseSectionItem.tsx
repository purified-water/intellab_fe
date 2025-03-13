import { useState, useEffect } from "react";
import { ICourse } from "@/features/Course/types";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { getUserIdFromLocalStorage, getAccessToken } from "@/utils";
import { courseAPI, paymentAPI } from "@/lib/api";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { showToastError } from "@/utils/toastUtils";
import { useToast } from "@/hooks/use-toast";
import { API_RESPONSE_CODE } from "@/constants";

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
  const toast = useToast();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const getCourseDetail = async () => {
    setInternalLoading(true);
    if (userId) {
      const response = await courseAPI.getCourseDetail(course.courseId, userId);
      setCourse(response.result);
    }
    setInternalLoading(false);
  };

  const createCoursePaymentAPI = async () => {
    try {
      const response = await paymentAPI.createCoursePayment(course.courseId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS && result) {
        window.location.href = result.paymentUrl!;
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error creating payment" });
      }
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error creating payment" });
    }
  };

  const handleTitleClick = () => {
    navigate(`/course/${detailCourse?.courseId}`);
  };

  const handleCourseClicked = async () => {
    if (isAuthenticated) {
      if (detailCourse)
        if (detailCourse.userEnrolled) {
          navigate(`/lesson/${detailCourse?.latestLessonId}`);
        } else if (detailCourse.price > 0) {
          await createCoursePaymentAPI();
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
    } else if (courseObject.price > 0) {
      buttonText = "Buy";
    } else {
      buttonText = "Enroll";
    }
    return buttonText;
  };

  const renderCourseDetail = () => {
    return (
      <div className="flex flex-col justify-between w-64 h-40 p-4 text-white transition-shadow duration-200 ease-in-out rounded-lg hover:shadow-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
        <div>
          <h3 className="text-xl font-bold line-clamp-2 cursor-pointer" onClick={handleTitleClick}>
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
            <p className="self-end mt-2 font-bold">{detailCourse?.price ? `đ${detailCourse?.price}` : "Free"}</p>
          </div>
        )}
      </div>
    );
  };

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
          {buttonText(course)}
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
