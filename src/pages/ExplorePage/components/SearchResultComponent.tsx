import React from "react";
import { CourseComponent } from "@/pages/ExplorePage/components/CourseComponent";
import { Course } from "@/types/Course";

interface CourseProps {
  courses: Course[];
  query: string;
  loading: boolean;
}

// SearchResultComponent displays the search results or a loading message
export const SearchResultComponent: React.FC<CourseProps> = ({ loading, courses, query }) => {
  // Return null if courses is not an array
  if (!courses || !Array.isArray(courses)) return null;

  // Display loading message if loading is true
  if (loading) {
    return <div className="pl-10 mb-6 text-4xl font-bold text-black sm:text-4xl sm:mb-11">Loading...</div>;
  }

  return (
    <div className="sm:pl-10">
      {/* Display the search results title or "Not found" if no courses match the query */}
      <div className="mb-6 text-4xl font-bold text-black sm:text-4xl sm:mb-11">
        {query && courses.length === 0 ? "Not found" : "Search results"}
      </div>
      {/* Courses grid */}
      <div className="flex flex-wrap gap-7">
        {courses.map((course) => (
          <CourseComponent
            key={course.id}
            id={course.id}
            title={course.title}
            reviews={course.reviews}
            rating={course.rating}
            description={course.description}
            difficulty={course.difficulty}
            lessons={course.lessons}
            price={course.price}
            imageSrc={course.imageSrc}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResultComponent;
