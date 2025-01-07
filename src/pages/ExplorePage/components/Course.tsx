import { useState, useEffect } from "react";
import { ICourse } from "@/features/Course/types";
import { useNavigate } from "react-router-dom";
import { amountTransformer } from "@/utils";
import { DEFAULT_COURSE } from "@/constants/defaultData";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { getUserIdFromLocalStorage } from "@/utils";
import { courseAPI } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

interface CourseProps {
  course: ICourse;
  skeletonLoading?: boolean;
}

export default function Course(props: CourseProps) {
  const { course, skeletonLoading } = props;

  const [detailCourse, setCourseDetail] = useState<ICourse>();
  const [internalLoading, setInternalLoading] = useState(false);

  const navigate = useNavigate();

  const userId = getUserIdFromLocalStorage();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const isFinished = detailCourse?.progressPercent === 100;

  const getCourseDetail = async () => {
    setInternalLoading(true);
    const response = await courseAPI.getCourseDetail(course.courseId, userId ?? "∫");
    setCourseDetail(response.result);
    setInternalLoading(false);
  };

  useEffect(() => {
    if (!skeletonLoading) {
      getCourseDetail();
    }
  }, [skeletonLoading]);

  const handleTitleClick = () => {
    navigate(`/course/${detailCourse?.courseId}`);
  };

  const handleButtonClick = (id: string) => {
    if (isAuthenticated && detailCourse?.userEnrolled && detailCourse?.latestLessonId) {
      if (isFinished) {
        // TODO: Implement certificate page
        alert("Upcoming feature");
      } else {
        navigate(`/lesson/${detailCourse.latestLessonId}`);
      }
    } else {
      navigate(`/course/${id}`);
    }
  };

  const priceText = (price: number, unitPrice: string) => {
    let result;
    if (price == 0) {
      result = "Free";
    } else {
      result = `${price} ${unitPrice}`;
    }
    return result;
  };

  const buttonText = () => {
    let text;
    if (detailCourse?.userEnrolled) {
      if (isFinished) {
        text = "View Certificate";
      } else {
        text = "Continue";
      }
    } else {
      text = "Study Now";
    }
    return text;
  };

  const renderContent = () => (
    <div className="flex flex-col bg-white border w-80 rounded-xl border-gray4 h-80">
      {/* Header section with background gradient and reviews */}
      <div className="w-80 h-40 bg-gradient-to-l from-[#6b60ca] via-appSecondary to-[#231e55] rounded-tl-xl rounded-tr-xl flex items-center justify-between p-2">
        <h2 className="ml-4 text-2xl font-bold text-white cursor-pointer" onClick={handleTitleClick}>
          {detailCourse?.courseName ?? DEFAULT_COURSE.courseName}
        </h2>
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center justify-end px-4 pt-3 mb-5">
            <div className="mx-1 text-sm font-normal text-white">•</div>
            <div className="text-sm font-normal text-white">
              {detailCourse?.reviewCount
                ? amountTransformer(detailCourse.reviewCount)
                : amountTransformer(DEFAULT_COURSE.reviewCount)}
            </div>
            <div className="flex items-center justify-center bg-slate-800 rounded-[9px] w-[58px] h-[25px] ml-2">
              <img className="w-4 h-4 mr-1" src="../../src/assets/rate.svg" alt="Rating" />
              <div className="text-white">{detailCourse?.averageRating ?? DEFAULT_COURSE.averageRating}</div>
            </div>
          </div>
          <img src={detailCourse?.courseLogo ?? DEFAULT_COURSE.courseLogo} alt="" className="w-24 h-24" />
        </div>
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
          onClick={() => handleButtonClick(detailCourse?.courseId ?? course.courseId)}
        >
          {buttonText()}
        </button>
        <span className="text-lg font-bold text-appPrimary">
          {priceText(detailCourse?.price ?? DEFAULT_COURSE.price, detailCourse?.unitPrice ?? DEFAULT_COURSE.unitPrice)}
        </span>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="flex flex-col bg-white border w-80 rounded-xl border-gray4 h-80">
      <div className="w-80 h-40 bg-gradient-to-l from-[#6b60ca] via-appSecondary to-[#231e55] rounded-tl-xl rounded-tr-xl flex flex-col p-2">
        <Skeleton className="self-end w-40 h-10 mb-9 bg-gray5" />
        <Skeleton className="h-10 mb-5 w-50 bg-gray5" />
        <Skeleton className="self-end w-20 h-20 bg-gray5" />
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
