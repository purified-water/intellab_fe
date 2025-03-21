import { useState, useEffect } from "react";
import { YourCourseCard } from "./YourCourseCard";
import { courseAPI } from "@/lib/api";
import { getUserIdFromLocalStorage, getAccessToken } from "@/utils";
import { IUserCourse } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { ScrollableList } from "@/components/ui/HorizontallyListScrollButtons";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

export const YourCourseSection = () => {
  const [userEnrollCourses, setUserEnrollCourses] = useState<IUserCourse[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = getUserIdFromLocalStorage();
  const accessToken = getAccessToken();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const toast = useToast();

  const getUserEnrolledCourseIds = async () => {
    if (accessToken && userId) {
      setLoading(true);
      try {
        const response = await courseAPI.getUserEnrolledCourses();
        const userEnrolledCourses = response.result.content;
        setUserEnrollCourses(userEnrolledCourses);
      } catch (e) {
        showToastError({ toast: toast.toast, message: e.message ?? "Error getting enrolled courses" });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getUserEnrolledCourseIds();
  }, [isAuthenticated]);

  const renderSkeletonList = () => {
    const skeletonCount = 2;
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
      <section className="relative">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <div className="relative w-full">
          <ScrollableList>
            {userEnrollCourses.map((course: IUserCourse, index: number) => (
              <YourCourseCard
                key={index}
                courseId={course.enrollId.courseId}
                userId={userId!}
                progress={course.progressPercent}
                skeletonLoading={loading}
              />
            ))}
          </ScrollableList>
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
