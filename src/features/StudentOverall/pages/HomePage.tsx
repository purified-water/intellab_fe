import { useState, useEffect } from "react";
import { AppFooter } from "@/components/AppFooter";
import { Header, YourCourseSection, CourseSection, Sidebar } from "../components";
import { courseAPI } from "@/lib/api";
import { ICourse } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { getUserIdFromLocalStorage, showToastError } from "@/utils";
import { AIOrb } from "@/features/MainChatBot/components/AIOrb";
import { IUserCourse } from "../types";
import { toast } from "@/hooks/use-toast";

export const HomePage = () => {
  const [userEnrollCourses, setUserEnrollCourses] = useState<IUserCourse[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [freeCourses, setFreeCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState({
    featuredCourses: true,
    freeCourses: true,
    yourCourses: true
  });
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
    try {
      setLoading((prev) => ({ ...prev, featuredCourses: true }));
      const allCourses = await getCourses();
      setFeaturedCourses(allCourses);
    } catch (error) {
      console.log("Error getting featured courses", error);
    } finally {
      setLoading((prev) => ({ ...prev, featuredCourses: false }));
    }
  };

  const getFreeCourses = async () => {
    try {
      setLoading((prev) => ({ ...prev, freeCourses: true }));
      const allCourses = await getCourses();
      const freeCourses = allCourses.filter((course: ICourse) => course.price === 0);
      setFreeCourses(freeCourses);
    } catch (error) {
      console.log("Error getting free courses", error);
    } finally {
      setLoading((prev) => ({ ...prev, freeCourses: false }));
    }
  };

  const getUserEnrolledCourseIds = async () => {
    if (userUid) {
      setLoading((prev) => ({ ...prev, yourCourses: true }));
      try {
        const response = await courseAPI.getUserEnrolledCourses();
        const userEnrolledCourses = response.result.content;
        setUserEnrollCourses(userEnrolledCourses);
      } catch (e) {
        showToastError({ toast: toast.toast, message: e.message ?? "Error getting enrolled courses" });
      } finally {
        setLoading((prev) => ({ ...prev, yourCourses: false }));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getFeaturedCourses();
      await getFreeCourses();

      if (isAuthenticated) {
        await getUserEnrolledCourseIds();
      }
    };
    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-col flex-grow w-full px-4 pt-3 mx-auto md:max-w-5xl lg:max-w-[90rem] md:px-28">
        <Header />
        <div id="content" className="flex flex-col gap-4 mt-4 md:flex-row">
          <div id="courses" className="w-full px-4 py-4 border rounded-lg md:w-3/4 border-gray5">
            {isAuthenticated && (
              <YourCourseSection userEnrollCourses={userEnrollCourses} loading={loading.yourCourses} />
            )}
            <CourseSection title="Featured Courses" courses={featuredCourses} loading={loading.featuredCourses} />
            <CourseSection title="Free Courses" courses={freeCourses} loading={loading.freeCourses} />
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
