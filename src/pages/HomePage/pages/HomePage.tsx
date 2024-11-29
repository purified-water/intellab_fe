import { AppFooter } from "@/components/AppFooter";
import { Header } from "@/pages/HomePage/components/Header";
import { CourseSection } from "@/pages/HomePage/components/CourseSection";
import { Sidebar } from "@/pages/HomePage/components/Sidebar";

export const HomePage = () => {
  const yourCourses = [
    { title: "Introduction to Array", description: "A fundamental course for Array Data type", buttonText: "Continue" }
  ];
  const featuredCourses = [
    { title: "DSA 50", description: "50 core concepts in DSA", price: "₫140,000", buttonText: "Study now" },
    {
      title: "Introduction to Array II, YEAH",
      description: "A fundamental course for Array Data type",
      price: "₫140,000",
      buttonText: "Study now"
    },
    {
      title: "Introduction to Array",
      description: "A fundamental course for Array Data type",
      price: "₫140,000",
      buttonText: "Study now"
    },
    {
      title: "Introduction to Array",
      description: "A fundamental course for Array Data type",
      price: "₫140,000",
      buttonText: "Study now"
    },
  ];
  const freeCourses = [
    { title: "DSA 50", description: "50 core concepts in DSA", buttonText: "Study now" },
    { title: "DSA 50", description: "50 core concepts in DSA", buttonText: "Study now" }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-col flex-grow w-full pt-3 px-14">
        <Header />
        <div id="content" className="flex">
          <div id="courses" className="w-3/4 py-4 pl-4 border rounded-lg border-gray5">
            <CourseSection title="Your Courses" courses={yourCourses} />
            <CourseSection title="Featured Courses" courses={featuredCourses} />
            <CourseSection title="Free Courses" courses={freeCourses} />
          </div>

          <div className="w-[20px]" />
          <div id="sidebar" className="w-1/4">
            <Sidebar />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};
