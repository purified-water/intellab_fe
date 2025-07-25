import { useState, useEffect } from "react";
import { ICourse } from "@/types";
import { useNavigate } from "react-router-dom";
import { amountTransformer } from "@/utils";
import { DEFAULT_COURSE, NA_VALUE } from "@/constants/defaultData";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/shadcn";
import { LevelCard } from "@/components/LevelCard";
import { courseAPI } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils";
import { Button } from "@/components/ui/Button";
import { BookOpenText } from "lucide-react";
import { rateIcon } from "@/assets";

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
  const toast = useToast();

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
        showToastError({ toast: toast.toast, message: error.message });
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
    if (course && !detailCourse) {
      getCourseDetail();
    }
  }, [course?.courseId]); // Only re-run if courseId changes

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
    <Card
      className="flex min-w-[350px] w-[380px] max-w-[380px] min-h-[445px] max-h-[445px] flex-col overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg"
      onClick={handleTitleClick}
    >
      <div className="relative h-48">
        <img
          src={
            detailCourse?.courseImage
              ? `${detailCourse.courseImage}?timestamp=${new Date().getTime()}`
              : "/src/assets/unavailable_image.jpg"
          }
          alt={detailCourse?.courseName || DEFAULT_COURSE.courseName}
          onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 max-w-[330px]">
          <div className="flex items-center px-2 py-1 mb-5 overflow-hidden text-xs text-white rounded-lg bg-black/40 backdrop-blur-md whitespace-nowrap text-ellipsis">
            {`${amountTransformer(detailCourse?.reviewCount ?? 0)} review${(detailCourse?.reviewCount ?? 0) !== 1 ? "s" : ""}`}{" "}
            • <img className="w-3 h-3 mx-[6px]" src={rateIcon} alt="Rating" />
            {detailCourse?.averageRating ? detailCourse.averageRating.toFixed(1) : 0}
          </div>
        </div>
      </div>

      <CardContent className="flex flex-col flex-grow px-4 pt-2 pb-0">
        <h3 className="text-lg font-bold line-clamp-1">{detailCourse?.courseName ?? DEFAULT_COURSE.courseName}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {detailCourse?.description ?? DEFAULT_COURSE.description}
        </p>
        <LevelCard level={detailCourse?.level ?? DEFAULT_COURSE.level} categories={detailCourse?.categories || []} />

        {/* Lessons count above the button */}
        <div className="flex items-center gap-1 py-2 mt-3 mb-3 ml-3 text-sm text-left text-gray3">
          <BookOpenText className="w-4 h-4" />
          {detailCourse?.lessonCount ?? DEFAULT_COURSE.lessonCount}{" "}
          {(detailCourse?.lessonCount ?? DEFAULT_COURSE.lessonCount) > 1 ? "lessons" : "lesson"}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-5 pt-0 pb-4 mt-auto">
        <Button
          className="h-10 px-6 pt-2 pb-[9px] bg-appPrimary rounded-lg text-white border border-appPrimary justify-center items-center inline-flex text-base hover:bg-appPrimary/80 hover:text-white transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick(detailCourse?.courseId ?? course!.courseId);
          }}
        >
          {buttonText(detailCourse!)}
        </Button>
        <div className="text-lg font-bold text-appPrimary">
          {detailCourse?.price != undefined ? priceText(detailCourse!.price, detailCourse.unitPrice) : NA_VALUE}
        </div>
      </CardFooter>
    </Card>
  );

  const renderSkeleton = () => (
    <Card className="flex min-w-[350px] w-[380px] max-w-[380px] min-h-[445px] max-h-[445px] flex-col overflow-hidden">
      <div className="relative h-48">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2 right-2">
          <Skeleton className="w-20 h-6 bg-black/30" />
        </div>
      </div>

      <CardContent className="flex-grow px-4 pt-2 pb-0">
        <Skeleton className="w-3/4 h-6 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-2/3 h-4 mb-4" />
        <Skeleton className="w-1/2 h-6 mb-2" />
        <Skeleton className="w-1/3 h-4 mb-2" />
        <Skeleton className="w-1/4 h-4" />
      </CardContent>

      <CardFooter className="flex items-center justify-between px-4 pt-0 pb-10">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-16 h-6" />
      </CardFooter>
    </Card>
  );

  return skeletonLoading || internalLoading ? renderSkeleton() : renderContent();
}
