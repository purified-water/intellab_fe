import { AppFooter } from "@/components/AppFooter";
import { Header } from "@/pages/HomePage/components/Header";
import { CourseSection } from "@/pages/HomePage/components/CourseSection";
import { Sidebar } from "@/pages/HomePage/components/Sidebar";

export const HomePage = () => {
  const yourCourses = [{ name: "Introduction to Array", description: "A fundamental course for Array Data type" }];
  const featuredCourses = [
    { name: "DSA 50", description: "50 core concepts in DSA", price: "140,000" },
    {
      name: "Introduction to Array II, YEAH",
      description: "A fundamental course for Array Data type",
      price: "140,000"
    },
    {
      name: "Introduction to Array",
      description: "A fundamental course for Array Data type",
      price: "140,000"
    },
    {
      name: "Introduction to Array",
      description: "A fundamental course for Array Data type",
      price: "140,000"
    }
  ];
  const freeCourses = [
    { name: "DSA 50", description: "50 core concepts in DSA" },
    { name: "DSA 50", description: "50 core concepts in DSA" }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-col flex-grow w-full px-4 pt-3 md:px-14">
        <Header />
        <div id="content" className="flex flex-col gap-4 mt-4 md:flex-row">
          <div id="courses" className="w-full px-4 py-4 border rounded-lg md:w-3/4 border-gray5">
            <CourseSection name="Your Courses" courses={yourCourses} />
            <CourseSection name="Featured Courses" courses={featuredCourses} />
            <CourseSection name="Free Courses" courses={freeCourses} />
          </div>

          <div id="sidebar" className="w-full md:w-1/4">
            <Sidebar />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};
