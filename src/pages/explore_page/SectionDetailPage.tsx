import React from "react";
import { useParams } from "react-router-dom";
import { CourseComponent } from "./components/CourseComponent";
import FilterButton from "./components/FilterButton";
import SearchBar from "./components/SearchBar";

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
    imageSrc: "../src/assets/hierarchy.png"
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
    imageSrc: "../src/assets/hierarchy.png"
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
    imageSrc: "../src/assets/hierarchy.png"
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
    imageSrc: "../src/assets/hierarchy.png"
  },
  {
    id: "course5",
    title: "Advanced TypeScript",
    reviews: "8k reviews",
    rating: 4.8,
    description: "Deep dive into TypeScript with advanced concepts and patterns",
    difficulty: "Hard",
    lessons: 25,
    price: "đ300,000",
    imageSrc: "../src/assets/hierarchy.png"
  },
  {
    id: "course6",
    title: "Advanced TypeScript",
    reviews: "8k reviews",
    rating: 4.8,
    description: "Deep dive into TypeScript with advanced concepts and patterns",
    difficulty: "Hard",
    lessons: 25,
    price: "đ300,000",
    imageSrc: "../src/assets/hierarchy.png"
  }
];

const SectionDetailPage: React.FC = () => {
  const { section } = useParams<{ section: string }>();

  const getSectionCourses = (section: string) => {
    // Fetch or filter courses based on the section
    if (section === "fundamentals") {
      return courses;
    }
    // Add more sections as needed
    return [];
  };

  const sectionCourses = getSectionCourses(section || "");

  return (
    <div className="ml-[101px]">
      {/* Header section with filter button and search bar */}
      <div className="flex items-center py-10">
        <FilterButton onClick={() => {}} />
        <SearchBar />
      </div>

      {/* Section title */}
      <h1 className="mb-8 text-4xl font-bold">{section!.charAt(0).toUpperCase() + section!.slice(1)} Courses</h1>

      {/* Courses grid */}
      <div className="grid grid-cols-1 pr-56 gap-[62px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {sectionCourses.map((course) => (
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
            onClick={() => console.log(`Course clicked: ${course.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionDetailPage;
