import { ICourse } from "@/features/Course/types";
import { useNavigate } from "react-router-dom";

interface CourseSectionCard {
  course: ICourse;
}

export function CourseSectionCard(prop: CourseSectionCard) {
  const navigation = useNavigate();

  const { course } = prop;

  const handleCourseClicked = () => {
    navigation(`/course/${course.courseId}`);
  };

  return (
    <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg bg-gradient-to-tr from-appSecondary to-appFadedPrimary shrink-0">
      <div>
        <h3 className="text-xl font-bold line-clamp-2">{course?.courseName}</h3>
        <p className={`text-sm mb-2 ${course?.courseName && course.courseName.length > 10 ? 'line-clamp-1' : 'line-clamp-2'}`}>{course?.description}</p>
      </div>

      <div className="flex justify-between mt-2">
        <button
          className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
          onClick={handleCourseClicked}
        >
          {"Study now"}
        </button>
        <p className="self-end mt-2 font-bold">{course?.price ? `${course?.price} VND` : "Free"}</p>
      </div>
    </div>
  );
}
