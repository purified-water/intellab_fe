import { YourCourseCard } from "./YourCourseCard";
import { getUserIdFromLocalStorage } from "@/utils";
import { IUserCourse } from "../../types";
import { ScrollableList } from "@/components/ui/HorizontallyListScrollButtons";

interface YourCourseSectionProps {
  userEnrollCourses: IUserCourse[];
  loading: boolean;
}

export const YourCourseSection = ({ userEnrollCourses, loading }: YourCourseSectionProps) => {
  const userId = getUserIdFromLocalStorage();

  const renderSkeletonList = () => {
    const skeletonCount = 2;
    return (
      <section>
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <div className="flex flex-wrap gap-4">
          {[...Array(skeletonCount)].map((_, index) => (
            <YourCourseCard key={index} courseId="" userId="" progress={0} skeletonLoading={true} />
          ))}
        </div>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <section className="relative">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <div className="relative w-full">
          <ScrollableList>
            {userEnrollCourses.map((course: IUserCourse, index: number) => (
              <YourCourseCard
                key={index}
                courseId={course.enrollId.courseId}
                userId={userId!}
                progress={course.progressPercent}
                skeletonLoading={loading}
              />
            ))}
          </ScrollableList>
        </div>
      </section>
    );
  };

  return (
    <section className="mb-8">
      {loading ? renderSkeletonList() : userId && userEnrollCourses.length > 0 && renderContent()}
    </section>
  );
};
