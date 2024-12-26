//import { SmCourseCardType } from "@/pages/HomePage/types/SmCourseCardType";
import { useState, useEffect } from "react";
import { courseAPI } from "@/lib/api";
import { ICourse } from "@/features/Course/types";
import Spinner from "@/components/ui/Spinner";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useNavigate } from "react-router-dom";

interface YourCourseCardProps {
  courseId: string;
  userId: string;
  progress: number;
}

export const YourCourseCard = (props: YourCourseCardProps) => {
  const navigation = useNavigate();

  const { courseId, userId, progress } = props;

  const isFinished = progress === 100;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(false);

  const getCourseDetail = async () => {
    setLoading(true);
    const response = await courseAPI.getCourseDetail(courseId, userId);
    setCourse(response.result);
    setLoading(false);
  };

  useEffect(() => {
    getCourseDetail();
  }, []);

  const handleCourseClicked = () => {
    if (isFinished) {
      // View certificate
    } else {
      navigation(`/course/${courseId}`);
    }
  };

  const renderLoading = () => {
    return <Spinner loading={loading} />;
  };

  const renderContent = () => {
    return (
      <>
        <div>
          <h3 className="text-xl font-bold line-clamp-2">{course?.courseName}</h3>
          <p className={`text-sm mb-2 ${course?.courseName && course.courseName.length > 20 ? 'line-clamp-1' : 'line-clamp-2'}`}>{course?.description}</p>
          <ProgressBar progress={progress} showText={false} height={5} />
        </div>

        <div className="flex justify-between mt-2">
          <button
            className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
            onClick={handleCourseClicked}
          >
            {isFinished ? "View certificate" : "Continue"}
          </button>
          <p className="self-end mt-2 font-bold">{course?.price ? `${course?.price} VND` : "Free"}</p>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
      {loading ? renderLoading() : renderContent()}
    </div>
  );
};
