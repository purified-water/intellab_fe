import React from "react";
import { Spinner } from "@/components/ui";
import { ICourse } from "@/types";
import { Course } from "./Course";

interface CourseProps {
  courses: ICourse[];
  query: string;
  loading: boolean;
}

// SearchResultComponent displays the search results or a loading message
export const SearchResultComponent: React.FC<CourseProps> = ({ loading, courses, query }) => {
  // Return null if courses is not an array
  if (!courses || !Array.isArray(courses)) return null;

  // Display loading message if loading is true
  if (loading) {
    return <Spinner loading={loading} />;
  }

  return (
    <div className="flex flex-col items-center">
      {query !== "" && (
        <div className="self-start mb-6 text-lg text-black sm:text-xl sm:mb-8">
          {query && courses.length === 0 ? "Course not found!" : "Search results"}
        </div>
      )}

      <div className="flex justify-center w-full">
        <div className="flex flex-wrap gap-4 justify-start max-w-[1000px]">
          {courses.map((course) => (
            <Course key={course.courseId} course={course} skeletonLoading={loading} />
          ))}
        </div>
      </div>
    </div>
  );
};
