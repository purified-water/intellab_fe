import { ICompletedCourse } from "@/types";
import { shortenDate } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type CompletedCourseItemProps = {
  course: ICompletedCourse | null;
  isEven: boolean;
  loading: boolean;
};

export function CompletedCourseItem(props: CompletedCourseItemProps) {
  const { course, isEven = false, loading } = props;

  const navigate = useNavigate();

  const renderSkeleton = () => {
    const categoriesPlaceHolder = [1, 2, 3];

    return (
      <div
        className={`flex items-center justify-between py-4 px-7 rounded-xl ${isEven ? "bg-gray6/50" : "bg-white"} cursor-pointer`}
      >
        <div className="space-y-3">
          <Skeleton className="w-48 h-6" />
          <div className="flex space-x-2">
            {categoriesPlaceHolder.map((_, index) => (
              <Skeleton key={index} className="w-20 h-6 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="w-24 h-6" />
      </div>
    );
  };

  const renderCourse = () => {
    const renderCourseInformation = () => {
      const handleCourseClick = () => {
        navigate(`/course/${course?.course.courseId}`);
      };

      return (
        <div className="space-y-2 cursor-pointer" onClick={handleCourseClick}>
          <p className="text-base font-bold">{course?.course.courseName}</p>
          <div className="flex space-x-2">
            {course?.course.categories.map((category, index) => (
              <div key={index} className="px-2 py-1 text-xs font-bold rounded-full line-clamp-1 text-gray2 bg-gray5">
                {category.name}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray3">Completed on {shortenDate(course!.completedDate)}</p>
        </div>
      );
    };

    const renderViewCertificate = () => {
      const handleViewCertificateClick = () => {
        navigate(`/certificate/${course?.certificateId}`);
      };

      return (
        <p
          className="text-base font-bold cursor-pointer text-appPrimary hover:text-opacity-80"
          onClick={handleViewCertificateClick}
        >
          View Certificate
        </p>
      );
    };

    return (
      <div
        className={`flex items-center justify-between py-4 px-7 rounded-xl ${isEven ? "bg-gray6/50" : "bg-white"} hover:opacity-80`}
      >
        {renderCourseInformation()}
        {renderViewCertificate()}
      </div>
    );
  };

  return loading || !course ? renderSkeleton() : renderCourse();
}
