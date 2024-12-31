import { useState, useEffect } from "react";
import { YourCourseCard } from "./YourCourseCard";
import { courseAPI } from "@/lib/api";
import { getUserIdFromLocalStorage, getAccessToken } from "@/utils";
import { IUserCourse } from "@/pages/HomePage/types/responseTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

export const YourCourseSection = () => {
  const [userEnrollCourses, setUserEnrollCourses] = useState<IUserCourse[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = getUserIdFromLocalStorage();
  const accessToken = getAccessToken();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const getUserEnrolledCourseIds = async () => {
    if (accessToken && userId) {
      setLoading(true);
      try {
        const response = await courseAPI.getUserEnrolledCourses(userId!);
        const userEnrolledCourses = response.result.content;
        setUserEnrollCourses(userEnrolledCourses);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getUserEnrolledCourseIds();
  }, [isAuthenticated]);

  const renderSkeletonList = () => {
    const skeletonCount = 5;
    return (
      <section>
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <div className="flex flex-wrap gap-4">
          {[...Array(skeletonCount)].map((_, index) => (
            <YourCourseCard key={index} courseId="" userId="" progress={0} skeletonLoading={true} />
          ))}
        </div>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <section>
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <div className="relative w-full mt-4 overflow-x-scroll scroll-smooth scrollbar-hide">
          <div className="flex space-x-4 flex-nowrap">
            {userEnrollCourses.map((course: IUserCourse, index: number) => (
              <YourCourseCard
                key={index}
                courseId={course.enrollId.courseId}
                userId={userId!}
                progress={course.progressPercent}
                skeletonLoading={loading}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <section className="mb-8">
      {loading ? renderSkeletonList() : userId && userEnrollCourses.length > 0 && renderContent()}
    </section>
  );
};
