import { useState, useEffect } from "react";
import { ICourse } from "@/types";
import { useNavigate } from "react-router-dom";
import { amountTransformer } from "@/utils";
import { DEFAULT_COURSE, NA_VALUE } from "@/constants/defaultData";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { courseAPI } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";

interface CourseProps {
  course: ICourse | null;
  skeletonLoading?: boolean;
}

export function Course(props: CourseProps) {
  const { course, skeletonLoading } = props;

  const [detailCourse, setCourseDetail] = useState<ICourse>();
  const [internalLoading, setInternalLoading] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const isFinished = detailCourse?.progressPercent === 100;

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status == PREMIUM_STATUS.ACTIVE;
  const includedInPremiumPlan =
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.COURSE ||
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.PREMIUM;

  const getCourseDetail = async () => {
    setInternalLoading(true);
    try {
      const response = await courseAPI.getCourseDetail(course!.courseId);
      setCourseDetail(response.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("--> Get course detail error: ", error);
      }
    } finally {
      setInternalLoading(false);
    }
  };

  const handleTitleClick = () => {
    navigate(`/course/${detailCourse?.courseId}`);
  };

  const handleButtonClick = async (id: string) => {
    if (isAuthenticated) {
      if (detailCourse?.userEnrolled) {
        if (isFinished) {
          navigate(`/certificate/${detailCourse.certificateId}`);
        } else {
          if (detailCourse?.latestLessonId) {
            navigate(`/lesson/${detailCourse.latestLessonId}`);
          } else {
            navigate(`/course/${id}`);
          }
        }
      } else {
        navigate(`/course/${id}`);
      }
    } else {
      navigate(`/course/${id}`);
    }
  };

  useEffect(() => {
    if (course) {
      getCourseDetail();
    }
  }, []);

  const priceText = (price: number, unitPrice: string) => {
    let result;
    if (price == 0 || (includedInPremiumPlan && isCurrentPlanActive)) {
      result = "Free";
    } else {
      result = `${price.toLocaleString()} ${unitPrice}`;
    }
    return result;
  };

  const buttonText = (courseObject: ICourse) => {
    let text;
    if (courseObject?.userEnrolled) {
      if (courseObject.progressPercent === 100) {
        text = "View Certificate";
      } else {
        text = "Continue";
      }
    } else {
      if (courseObject?.price == 0 || (includedInPremiumPlan && isCurrentPlanActive)) {
        text = "Enroll";
      } else {
        text = "Purchase";
      }
    }
    return text;
  };

  const renderContent = () => (
    <div className="flex flex-col transition-shadow duration-200 ease-in-out bg-white border w-80 rounded-xl border-gray4 h-80 hover:shadow-lg">
      {/* Header section with background gradient and reviews */}
      <div className="flex flex-col items-end justify-between h-40 p-2 w-80 bg-gradient-to-tr from-appSecondary to-appFadedPrimary rounded-tl-xl rounded-tr-xl">
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center justify-end px-2 pt-2 mb-5">
            <div className="text-sm font-medium text-white">
              {`${amountTransformer(detailCourse?.reviewCount ?? 0)} reviews`}
            </div>
            <div className="ml-1 text-sm font-normal text-white">•</div>
            <div className="flex items-center px-2 justify-center bg-black/60 rounded-[9px] w-[58px] h-[25px] ml-2">
              <img className="w-3 h-3 mr-[6px]" src="../../src/assets/rate.svg" alt="Rating" />
              <div className="text-sm text-white">
                {detailCourse?.averageRating != 0 ? detailCourse?.averageRating : NA_VALUE}
              </div>
            </div>
          </div>
        </div>
        <h2 className="w-full pl-2 mb-10 text-2xl font-bold text-white cursor-pointer" onClick={handleTitleClick}>
          {detailCourse?.courseName ?? DEFAULT_COURSE.courseName}
        </h2>
      </div>

      {/* Description section */}
      <div className="items-center flex-grow px-4 py-1 mt-1 w-72">
        <span className="text-sm font-normal text-black line-clamp-2">
          {detailCourse?.description ?? DEFAULT_COURSE.description}
        </span>
      </div>

      {/* Difficulty and lessons section */}
      <div className="flex-grow px-4 mb-3">
        <span className="w-36 text-[#01000f] text-sm font-bold">{detailCourse?.level ?? DEFAULT_COURSE.level}</span>
        <span className="mx-2 text-[#01000f] text-sm font-normal">•</span>
        <span className="w-52 text-[#01000f] text-sm font-normal">
          Include {detailCourse?.lessonCount ?? DEFAULT_COURSE.lessonCount} lessons
        </span>
      </div>

      {/* Footer section */}
      <div className="flex items-baseline justify-between p-4 mt-auto bg-">
        <button
          className="self-end w-36 h-[35px] font-semibold bg-transparent rounded-xl border-appPrimary border text-appPrimary"
          onClick={() => handleButtonClick(detailCourse?.courseId ?? course!.courseId)}
        >
          {buttonText(detailCourse!)}
        </button>
        <span className="text-lg font-bold text-appPrimary">
          {priceText(detailCourse?.price ?? DEFAULT_COURSE.price, detailCourse?.unitPrice ?? DEFAULT_COURSE.unitPrice)}
        </span>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="flex flex-col bg-white border w-80 rounded-xl border-gray4 h-80">
      <div className="flex flex-col h-40 p-2 w-80 bg-gray5 rounded-tl-xl rounded-tr-xl">
        <Skeleton className="self-end w-40 h-10 mb-9 bg-gray5" />
        <Skeleton className="h-10 mb-5 w-50 bg-gray5" />
      </div>
      <div className="items-center flex-grow px-4 py-1 mt-1 w-72">
        <Skeleton className="h-4 mb-2 bg-gray5" />
      </div>
      <div className="flex-grow px-4 mb-3">
        <Skeleton className="h-4 mb-2 bg-gray5" />
      </div>
      <div className="flex items-baseline justify-between p-4 mt-auto bg-">
        <Skeleton className="w-24 h-8 mt-5 bg-gray5" />
      </div>
    </div>
  );

  return skeletonLoading || internalLoading ? renderSkeleton() : renderContent();
}
