import { ICompletedCourse } from "@/types";
import { formatDate } from "@/utils";
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
        className={`flex items-center justify-between py-4 px-7 rounded-xl ${isEven ? "bg-gray6" : "bg-white"} cursor-pointer`}
      >
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <div className="flex space-x-2">
            {categoriesPlaceHolder.map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="h-6 w-24" />
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
          <p className="font-bold text-xl">{course?.course.courseName}</p>
          <div className="flex space-x-2">
            {course?.course.categories.map((category, index) => (
              <div key={index} className="text-gray2 bg-gray5 py-1 px-3 rounded-full font-bold">
                {category.name}
              </div>
            ))}
          </div>
          <p className="text-gray2">Completed on {formatDate(course?.completedDate)}</p>
        </div>
      );
    };

    const renderViewCertificate = () => {
      const handleViewCertificateClick = () => {
        navigate(`/certificate/${course?.certificateId}`);
      };

      return (
        <p className="font-bold text-xl text-appPrimary cursor-pointer" onClick={handleViewCertificateClick}>
          View Certificate
        </p>
      );
    };

    return (
      <div
        className={`flex items-center justify-between py-4 px-7 rounded-xl ${isEven ? "bg-gray6" : "bg-white"} hover:opacity-80`}
      >
        {renderCourseInformation()}
        {renderViewCertificate()}
      </div>
    );
  };

  return loading || !course ? renderSkeleton() : renderCourse();
}
