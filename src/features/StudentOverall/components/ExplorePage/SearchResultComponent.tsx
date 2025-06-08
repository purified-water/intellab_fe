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
    <div className="flex flex-col items-center px-4">
      {query !== "" && (
        <div className="self-start mb-4 text-lg text-black sm:text-xl sm:mb-6">
          {query && courses.length === 0 ? "Course not found!" : "Search results"}
        </div>
      )}

      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] w-full">
          {courses.map((course) => (
            <Course key={course.courseId} course={course} skeletonLoading={loading} />
          ))}
        </div>
      </div>
    </div>
  );
};
