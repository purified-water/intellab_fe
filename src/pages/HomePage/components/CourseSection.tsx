import { DEFAULT_COURSE } from "@/constants/defaultData";
import { CourseSectionCard } from "./CourseSectionItem";
import { ICourse } from "@/features/Course/types";
import { ScrollableList } from "@/components/ui/HorizontallyListScrollButtons";

interface CourseSectionProps {
  title: string;
  courses: ICourse[];
  loading?: boolean;
}

export const CourseSection = (props: CourseSectionProps) => {
  const { title, courses, loading } = props;

  const renderSkeletonList = () => {
    const skeletonCount = 5;
    return (
      <div className="flex space-x-4 flex-nowrap">
        {[...Array(skeletonCount)].map((_, index) => (
          <CourseSectionCard key={index} course={DEFAULT_COURSE} skeletonLoading={true} />
        ))}
      </div>
    );
  };

  return (
    <section className="mb-8">
      {courses.length > 0 && <h2 className="text-3xl font-bold">{title}</h2>}
      <div className="relative w-full overflow-x-scroll scroll-smooth scrollbar-hide">
        {loading ? (
          renderSkeletonList()
        ) : (
          <ScrollableList>
            {courses.map((course: ICourse, index: number) => (
              <CourseSectionCard key={index} course={course} skeletonLoading={loading} />
            ))}
          </ScrollableList>
        )}
      </div>
    </section>
  );
};
