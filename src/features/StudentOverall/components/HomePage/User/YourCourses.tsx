import { Card, CardContent, CardHeader, CardTitle, Progress, Skeleton } from "@/components/ui/shadcn";
import { Button, EmptyMessage } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { ICourse } from "@/types";

interface YourCoursesProps {
  userEnrollCourses: ICourse[];
  isLoading?: boolean;
  className?: string;
}

export const YourCourseCard = (courseDetail: ICourse) => {
  if (!courseDetail) return null;
  const navigate = useNavigate();
  const isFinished = courseDetail?.progressPercent === 100;

  return (
    <div
      onClick={() => navigate(`/course/${courseDetail?.courseId}`)}
      className="flex items-stretch w-full overflow-hidden border rounded-lg cursor-pointer"
    >
      {/* Left: Image */}
      <div className="w-2/5 max-w-[300px] h-full overflow-hidden border-r border-muted">
        <img
          src={courseDetail?.courseImage}
          alt={courseDetail?.courseName}
          className="object-cover w-full h-full"
          onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
        />
      </div>

      {/* Right: Course Content */}
      <div className="flex-1 p-4 bg-white">
        <h3 className="text-lg font-semibold">{courseDetail?.courseName}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{courseDetail?.description}</p>

        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span>{courseDetail?.progressPercent.toFixed(0)}%</span>
          </div>
          <Progress value={courseDetail?.progressPercent} className="h-2" />
        </div>

        <div className="flex items-center justify-end mt-4">
          {isFinished ? (
            <Button type="button" onClick={() => navigate(`/certificate/${courseDetail?.certificateId}`)}>
              View Certificate
            </Button>
          ) : (
            <Button type="button" onClick={() => navigate(`/course/${courseDetail?.courseId}`)}>
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonCourseCard = () => (
  <div className="flex items-stretch w-full overflow-hidden border rounded-lg">
    <Skeleton className="w-2/5 max-w-[300px] h-[200px]" />
    <div className="flex-1 p-4 space-y-3 bg-white">
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-4" />
      <div className="pt-4 space-y-2">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-full h-2" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="w-24 h-8" />
      </div>
    </div>
  </div>
);

export function YourCourses({ userEnrollCourses, isLoading, className }: YourCoursesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Your Courses</CardTitle>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="space-y-4">
          <div className="overflow-hidden bg-white rounded-lg">
            {isLoading ? (
              <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <SkeletonCourseCard key={idx} />
                ))}
              </div>
            ) : userEnrollCourses.length === 0 ? (
              <EmptyMessage message="Enroll in a course to see it here" />
            ) : (
              <div className="flex flex-col flex-wrap gap-4 sm:flex-row max-h-[400px] overflow-y-auto scrollbar-hide">
                {userEnrollCourses.map((course, index) => (
                  <YourCourseCard key={index} {...course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
