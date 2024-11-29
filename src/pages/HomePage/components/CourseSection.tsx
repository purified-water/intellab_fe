import { SmallCourseCard } from "./SmallCourseCard";

export const CourseSection = ({ title, courses }: any) => {
  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="relative w-full mt-4 overflow-x-scroll scroll-smooth">
        <div className="flex space-x-4 flex-nowrap">
          {courses.map((course: any, index: number) => (
            <SmallCourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};
