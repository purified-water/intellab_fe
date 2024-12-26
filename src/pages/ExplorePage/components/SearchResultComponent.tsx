import React from "react";
import Spinner from "@/components/ui/Spinner";
import { ICourse } from "@/features/Course/types";
import Course from "./Course";

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
    //return <div className="pl-10 mb-6 text-4xl font-bold text-black sm:text-4xl sm:mb-11">Loading...</div>;
    return <Spinner loading={loading} />;
  }

  return (
    <div className="sm:pl-10">
      {/* Display the search results title or "Not found" if no courses match the query */}
      <div className="mb-6 text-4xl font-bold text-black sm:text-4xl sm:mb-11">
        {query && courses.length === 0 ? "Not found" : "Search results"}
      </div>
      {/* Courses grid */}
      <div className="flex flex-wrap gap-7">
        {courses.map((course, index) => (
          <Course key={index} course={course} skeletonLoading={loading} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultComponent;
