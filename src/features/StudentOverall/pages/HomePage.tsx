import { useState, useEffect } from "react";
import { AppFooter } from "@/components/AppFooter";
import { Header, YourCourseSection, CourseSection, Sidebar } from "../components";
import { courseAPI } from "@/lib/api";
import { ICourse } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { getUserIdFromLocalStorage } from "@/utils";
import { AIOrb } from "@/features/MainChatBot/components/AIOrb";

export const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [freeCourses, setFreeCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userUid = getUserIdFromLocalStorage();

  useEffect(() => {
    document.title = "Home | Intellab";
  }, []);

  const getCourses = async () => {
    const response = userUid ? await courseAPI.getUnEnrollCourses(userUid) : await courseAPI.getCourses();
    const result: ICourse[] = response ? response.result.content : [];
    return result;
  };

  const getFeaturedCourses = async () => {
    const allCourses = await getCourses();
    setFeaturedCourses(allCourses);
  };

  const getFreeCourses = async () => {
    const allCourses = await getCourses();
    const freeCourses = allCourses.filter((course: ICourse) => course.price === 0);
    setFreeCourses(freeCourses);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getFeaturedCourses();
      await getFreeCourses();
      setLoading(false);
    };
    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-col flex-grow w-full px-4 pt-3 mx-auto md:max-w-5xl lg:max-w-[90rem] md:px-28">
        <Header />
        <div id="content" className="flex flex-col gap-4 mt-4 md:flex-row">
          <div id="courses" className="w-full px-4 py-4 border rounded-lg md:w-3/4 border-gray5">
            <YourCourseSection />
            <CourseSection title="Featured Courses" courses={featuredCourses} loading={loading} />
            <CourseSection title="Free Courses" courses={freeCourses} loading={loading} />
          </div>

          <div id="sidebar" className="w-full md:w-1/4">
            <Sidebar />
          </div>
        </div>
      </main>
      <AppFooter />

      <AIOrb />
    </div>
  );
};
