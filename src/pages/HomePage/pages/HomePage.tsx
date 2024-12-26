import { useState, useEffect } from "react";
import { AppFooter } from "@/components/AppFooter";
import { Header } from "@/pages/HomePage/components/Header";
import { CourseSection } from "@/pages/HomePage/components/CourseSection";
import { Sidebar } from "@/pages/HomePage/components/Sidebar";
import { YourCourseSection } from "../components/YourCouseSection";
import { courseAPI } from "@/lib/api";
import { ICourse } from "@/features/Course/types";

export const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [freeCourses, setFreeCourses] = useState<ICourse[]>([]);

  const getCourses = async () => {
    const response = await courseAPI.getCourses();
    return response ? response.result.content : [];
  };

  const getFeaturedCourses = async () => {
    const allCourses = await getCourses();
    // NOTE: filter featured courses
    setFeaturedCourses(allCourses);
  };

  const getFreeCourses = async () => {
    const allCourses = await getCourses();
    const freeCourses = allCourses.filter((course) => course.price === 0);
    setFreeCourses(freeCourses);
  };

  useEffect(() => {
    getFeaturedCourses();
    getFreeCourses();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-col flex-grow w-full px-4 pt-3 md:px-14">
        <Header />
        <div id="content" className="flex flex-col gap-4 mt-4 md:flex-row">
          <div id="courses" className="w-full px-4 py-4 border rounded-lg md:w-3/4 border-gray5">
            <YourCourseSection />
            <CourseSection title="Featured Courses" courses={featuredCourses} />
            <CourseSection title="Free Courses" courses={freeCourses} />
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
