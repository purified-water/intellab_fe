import { useEffect, useState, useRef, useCallback } from "react";
import SearchBar from "@/pages/ExplorePage/components/SearchBar";
import { Link, useNavigate } from "react-router-dom";
import FilterButton from "@/pages/ExplorePage/components/FilterButton";
import { CourseComponent } from "@/pages/ExplorePage/components/CourseComponent";
import { courseAPI } from "@/lib/api/courseApi"; // Adjust the import path as necessary
import { Course } from "@/types/Course"; // Adjust the import path as necessary
import _ from "lodash";
import SearchResultComponent from "./components/SearchResultComponent"; // Adjust the import path as necessary

export const ExplorePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchedCourses, setSearchedCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses();
        setCourses(response.data.result);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    _.debounce(async (query: string) => {
      if (query === "") {
        setSearchedCourses([]);
        setLoading(false);
        return;
      }
      try {
        const response = await courseAPI.search(query);
        setSearchedCourses(response.data.result);
      } catch (error) {
        console.error("Failed to search courses:", error);
        setSearchedCourses([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Handle search input
  const handleSearch = useCallback(
    (inputQuery: string) => {
      setQuery(inputQuery);
      setLoading(true);
      debouncedSearch(inputQuery);
    },
    [debouncedSearch]
  );

  // Handle course click
  const handleCourseClick = useCallback(
    (id: string) => {
      navigate(`/course/${id}`);
    },
    [navigate]
  );

  // Determine which courses to display
  const displayedCourses = query ? searchedCourses : courses;

  return (
    <div className="flex flex-col">
      {/* Header section with filter button and search bar */}
      <div className="flex items-center py-10 pl-10">
        <FilterButton onClick={() => {}} />
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Display search results if a query is present */}
      {query ? (
        <SearchResultComponent loading={loading} courses={displayedCourses} query={query} />
      ) : (
        <div>
          {/* Welcome message */}
          <div className="w-full h-[106px] flex flex-col pl-10">
            <div className="mb-2 text-5xl font-bold tracking-wide text-appPrimary">Welcome to Intellab explore!</div>
            <div>Find new and exciting courses here!</div>
          </div>

          {/* Section for Fundamentals For Beginner */}
          <div className="flex flex-col mb-[78px]">
            <div className="flex items-center justify-between w-full mb-[44px] pl-10">
              <div className="text-4xl font-bold text-black">Fundamentals For Beginner</div>
              <Link to="/explore/fundamentals" state={{ courses: displayedCourses }}>
                <button className="mr-20 text-lg underline text-black-50">View all &gt;</button>
              </Link>
            </div>
            <div className="flex px-10 overflow-x-auto gap-7 scrollbar-hide">
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
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          </div>

          {/* Section for Popular Courses */}
          <div className="flex flex-col mb-[78px]">
            <div className="flex items-center justify-between w-full mb-[44px] pl-10">
              <div className="text-4xl font-bold text-black">Popular Courses</div>
              <Link to="/explore/popular" state={{ courses: displayedCourses }}>
                <button className="mr-20 text-lg underline text-black-50">View all &gt;</button>
              </Link>
            </div>
            <div className="flex px-10 overflow-x-auto gap-7 scrollbar-hide">
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
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
