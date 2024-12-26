import { useState, useEffect } from "react";
import { YourCourseCard } from "./YourCourseCard";
import { courseAPI } from "@/lib/api";
import { getUserIdFromLocalStorage } from "@/utils";
import { IUserCourse } from "@/lib/api/responseTypes";
import Spinner from "@/components/ui/Spinner";

export const YourCourseSection = () => {
  const [userEnrollCourses, setUserEnrollCourses] = useState<IUserCourse[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = getUserIdFromLocalStorage();

  const getUserEnrolledCourseIds = async () => {
    if (userId) {
      setLoading(true);
      const response = await courseAPI.getUserEnrolledCourses(userId);
      const userEnrolledCourses = response.result;
      setUserEnrollCourses(userEnrolledCourses);
      setLoading(false);
    }

    console.log("userEnrollCourses", userEnrollCourses);  
  };

  useEffect(() => {
    getUserEnrolledCourseIds();
  }, []);

  const renderLoading = () => {
    return <Spinner loading={loading} />;
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
              />
            ))}
          </div>
        </div>
        {renderLoading()}
      </section>
    );
  };

  return <section className="mb-8">{userId && userEnrollCourses.length > 0 && renderContent()}</section>;
};
