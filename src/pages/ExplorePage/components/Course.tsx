import { useState, useEffect } from "react";
import { ICourse } from "@/features/Course/types";
import { useNavigate } from "react-router-dom";
import { amountTransformer } from "@/utils";
import { DEFAULT_COURSE } from "@/constants/defaultData";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserIdFromLocalStorage, getAccessToken } from "@/utils";
import { courseAPI } from "@/lib/api";

interface CourseProps {
  course: ICourse;
  skeletonLoading?: boolean;
}

export default function Course(props: CourseProps) {
  const { course, skeletonLoading } = props;

  const {
    courseName,
    description,
    level,
    lessonCount,
    price,
    unitPrice,
    reviewCount,
    averageRating,
    //userEnrolled,
    courseLogo
  } = course ?? DEFAULT_COURSE;

  const [detailCourse, setCourseDetail] = useState<ICourse | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  const navigate = useNavigate();

  const userId = getUserIdFromLocalStorage();
  const accessToken = getAccessToken();

  const getCourseDetail = async () => {
    setInternalLoading(true);
    const response = await courseAPI.getCourseDetail(course.courseId, userId!);
    setCourseDetail(response.result);
    setInternalLoading(false);
  };

  useEffect(() => {
    getCourseDetail();
  }, []);

  const handleCourseClick = (id: string) => {
    if (!userId && !accessToken) {
      alert("Please login to see the detail of this course");
    } else {
      if (detailCourse?.userEnrolled) {
        navigate(`/lesson/${detailCourse.latestLessonId}`);
      } else {
        navigate(`/course/${id}`);
      }
    }
  };

  const renderContent = () => (
    <div className="flex flex-col bg-white border w-80 rounded-xl border-gray4 h-80">
      {/* Header section with background gradient and reviews */}
      <div className="w-80 h-40 bg-gradient-to-l from-[#6b60ca] via-appSecondary to-[#231e55] rounded-tl-xl rounded-tr-xl flex flex-col p-2">
        <div className="flex items-center justify-end px-4 pt-3 mb-5">
          <div className="text-sm font-normal text-white">
            {reviewCount ? amountTransformer(reviewCount) : amountTransformer(DEFAULT_COURSE.reviewCount)}
          </div>
          <div className="mx-1 text-sm font-normal text-white">•</div>
          <div className="flex items-center justify-center bg-slate-800 rounded-[9px] w-[58px] h-[25px]">
            <img className="w-4 h-4 mr-1" src="../../src/assets/rate.svg" alt="Rating" />
            <div className="text-white">{averageRating ?? DEFAULT_COURSE.averageRating}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <h2 className="ml-4 text-2xl font-bold text-white">{courseName}</h2>
          <img src={courseLogo ?? DEFAULT_COURSE.courseLogo} alt="" className="w-24 h-24" />
        </div>
      </div>

      {/* Description section */}
      <div className="items-center flex-grow px-4 py-1 mt-1 w-72">
        <span className="text-sm font-normal text-black line-clamp-2">{description ?? DEFAULT_COURSE.description}</span>
      </div>

      {/* Difficulty and lessons section */}
      <div className="flex-grow px-4 mb-3">
        <span className="w-36 text-[#01000f] text-sm font-bold">{level ?? DEFAULT_COURSE.level}</span>
        <span className="mx-2 text-[#01000f] text-sm font-normal">•</span>
        <span className="w-52 text-[#01000f] text-sm font-normal">
          Include {lessonCount ?? DEFAULT_COURSE.lessonCount} lessons
        </span>
      </div>

      {/* Footer section */}
      <div className="flex items-baseline justify-between p-4 mt-auto bg-">
        <button
          className="self-end w-36 h-[35px] font-semibold bg-transparent rounded-xl border-appPrimary border text-appPrimary"
          onClick={() => handleCourseClick(course.courseId)}
        >
          {detailCourse?.userEnrolled ? "Continue" : "Study Now"}
        </button>
        <span className="text-lg font-bold text-appPrimary">{`${price} ${unitPrice}`}</span>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="flex flex-col bg-white border w-80 rounded-xl border-gray4 h-80">
      <div className="w-80 h-40 bg-gradient-to-l from-[#6b60ca] via-appSecondary to-[#231e55] rounded-tl-xl rounded-tr-xl flex flex-col p-2">
        <Skeleton className="h-10 w-40 mb-9 self-end bg-gray5" />
        <Skeleton className="h-10 w-50 mb-5 bg-gray5" />
        <Skeleton className="h-20 w-20 self-end bg-gray5" />
      </div>
      <div className="items-center flex-grow px-4 py-1 mt-1 w-72">
        <Skeleton className="h-4 mb-2 bg-gray5" />
      </div>
      <div className="flex-grow px-4 mb-3">
        <Skeleton className="h-4 mb-2 bg-gray5" />
      </div>
      <div className="flex items-baseline justify-between p-4 mt-auto bg-">
        <Skeleton className="h-8 mt-5 w-24 bg-gray5" />
      </div>
    </div>
  );

  return skeletonLoading || internalLoading ? renderSkeleton() : renderContent();
}
