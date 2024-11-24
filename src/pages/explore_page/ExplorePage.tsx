import SearchBar from "@/pages/explore_page/components/SearchBar";
import { Link } from "react-router-dom";
import FilterButton from "./components/FilterButton";
import { CourseComponent } from "./components/CourseComponent";

// Array of course data
const courses = [
  {
    id: "course1",
    title: "DSA 50",
    reviews: "15k reviews",
    rating: 4.5,
    description: "50 core concepts in DSA via theory lessons and practice exercises",
    difficulty: "Easy",
    lessons: 20,
    price: "đ140,000",
    imageSrc: "./src/assets/hierarchy.png"
  },
  {
    id: "course2",
    title: "React Basics",
    reviews: "10k reviews",
    rating: 4.7,
    description: "Learn the basics of React, including components, state, and props",
    difficulty: "Medium",
    lessons: 15,
    price: "đ200,000",
    imageSrc: "./src/assets/hierarchy.png"
  },
  {
    id: "course3",
    title: "Advanced TypeScript",
    reviews: "8k reviews",
    rating: 4.8,
    description: "Deep dive into TypeScript with advanced concepts and patterns",
    difficulty: "Hard",
    lessons: 25,
    price: "đ300,000",
    imageSrc: "./src/assets/hierarchy.png"
  },
  {
    id: "course4",
    title: "Advanced TypeScript",
    reviews: "8k reviews",
    rating: 4.8,
    description: "Deep dive into TypeScript with advanced concepts and patterns",
    difficulty: "Hard",
    lessons: 25,
    price: "đ300,000",
    imageSrc: "./src/assets/hierarchy.png"
  }
];

export const ExplorePage = () => {
  const handleCourseClick = (id: string) => {
    console.log(`Course clicked: ${id}`);
    // Add your logic here to handle the course click
  };

  return (
    <div className="flex flex-col items-start justify-start ml-[101px]">
      {/* Header section with filter button and search bar */}
      <div className="flex items-center py-10">
        <FilterButton onClick={() => {}} />
        <SearchBar />
      </div>

      {/* Welcome message */}
      <div className="w-[693px] h-[106px] flex flex-col">
        <div className="text-[#5a3295] text-5xl font-bold tracking-wide mb-2">Welcome to Intellab explore!</div>
        <div>Find new and exciting courses here!</div>
      </div>

      {/* Section for Fundamentals For Beginner */}
      <div className="flex flex-col mb-[78px]">
        <div className="flex items-center justify-between w-full mb-[44px]">
          <div className="text-4xl font-bold text-black">Fundamentals For Beginner</div>
          <Link to="/explore/fundamentals">
            <button className="text-lg underline text-black-500">View all &gt;</button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-[27px]">
          {courses.slice(0, 3).map((course) => (
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

      {/* Section for Popular Courses */}
      <div className="flex flex-col mb-[78px]">
        <div className="text-4xl font-bold text-black mb-[44px]">Popular Courses</div>
        <div className="flex flex-wrap gap-[27px]">
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
              onClick={handleCourseClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
