import { CourseSectionCard } from "./CourseSectionItem";
import { ICourse } from "@/features/Course/types";

interface CourseSectionProps {
  title: string;
  courses: ICourse[];
}

export const CourseSection = (props: CourseSectionProps) => {
  const { title, courses } = props;

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="relative w-full mt-4 overflow-x-scroll scroll-smooth scrollbar-hide">
        <div className="flex space-x-4 flex-nowrap">
          {courses.map((course: ICourse, index: number) => (
            <CourseSectionCard key={index} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};
