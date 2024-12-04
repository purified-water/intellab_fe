import React, { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CourseComponent } from "@/pages/ExplorePage/components/CourseComponent";
import FilterButton from "@/pages/ExplorePage/components/FilterButton";
import SearchBar from "@/pages/ExplorePage/components/SearchBar";
import { Course } from "@/types/Course";
import { courseAPI } from "@/lib/api/courseApi";
import _ from "lodash";
import SearchResultComponent from "@/pages/ExplorePage/components/SearchResultComponent";

const SectionDetailPage: React.FC = () => {
  const location = useLocation();
  const { courses } = location.state as { courses: Course[] };
  const [searchedCourses, setSearchedCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();

  const getSectionCourses = (section: string) => {
    if (section === "fundamentals") {
      return courses;
    }
    if (section === "popular") {
      return courses;
    }
    return [];
  };

  const debouncedSearch = useRef(
    _.debounce(async (inputQuery: string) => {
      if (inputQuery === "") {
        setSearchedCourses([]);
        return;
      }
      try {
        setLoading(true);
        const response = await courseAPI.search(inputQuery);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        setSearchedCourses(response.data.result);
      } catch (error) {
        console.error("Failed to search courses:", error);
        setSearchedCourses([]);
      }
    }, 300)
  ).current;

  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      debouncedSearch(inputQuery);
    },
    [debouncedSearch]
  );

  const handleCourseClick = useCallback(
    (id: string) => {
      navigate(`/course/${id}`);
    },
    [navigate]
  );

  const sectionCourses = getSectionCourses(section || "");
  const displayedCourses = query ? searchedCourses : sectionCourses;
  return (
    <div className="sm:pl-10">
      {/* Header section with filter button and search bar */}
      <div className="flex items-center py-4 sm:py-10">
        <FilterButton onClick={() => {}} />
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Section title */}
      {query ? (
        <SearchResultComponent loading={loading} courses={displayedCourses} query={query}></SearchResultComponent>
      ) : (
        <div>
          <div className="mb-6 text-4xl font-bold tracking-wide sm:text-4xl sm:mb-11 text-appPrimary">
            {section && section.charAt(0).toUpperCase() + section.slice(1)} Courses
          </div>
          {/* Courses grid */}
          <div className="flex flex-wrap gap-7">
            {displayedCourses.map((course) => (
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
                onClick={handleCourseClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionDetailPage;
