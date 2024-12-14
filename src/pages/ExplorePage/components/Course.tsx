import { useState, useEffect } from "react";
import { ICourse } from "@/features/Course/types";
import hierarchy from "@/assets/hierarchy.png";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE = hierarchy;

interface CourseProps {
  course: ICourse;
}

export default function Course(props: CourseProps) {
  const { course } = props;

  const navigate = useNavigate();

  const [userId, setUserId] = useState<string>("");

  const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(userId);
    } else {
      setUserId("");
    }
  };

  useEffect(() => {
    getUserIdFromLocalStorage();
  }, []);

  const handleCourseClick = (id: string) => {
    if (userId == null || userId === "") {
      alert("Please login to see the detail of this course");
    } else {
      navigate(`/course/${id}`);
    }
  };

  return (
    <div className="w-80 bg-white rounded-xl border border-[#b3b3b3]">
      {/* Header section with background gradient and reviews */}
      <div className="w-80 h-40 bg-gradient-to-l from-[#6b60ca] via-appSecondary to-[#231e55] rounded-tl-xl rounded-tr-xl flex flex-col p-2">
        {/* NOTE: No equivalent information from API so show */}
        {/* <div className="flex items-center justify-end px-4 pt-3 mb-5">
          <div className="text-sm font-normal text-white">{reviews}</div>
          <div className="mx-1 text-sm font-normal text-white">•</div>
          <div className="flex items-center justify-center bg-slate-800 rounded-[9px] w-[58px] h-[25px]">
            <img className="w-4 h-4 mr-1" src="../../src/assets/rate.svg" alt="Rating" />
            <div className="text-white">{rating}</div>
          </div>
        </div> */}
        <div className="flex justify-between">
          <h2 className="ml-4 text-2xl font-bold text-white">{course.name}</h2>
          <img src={DEFAULT_IMAGE} alt="" className="w-24 h-24" />
        </div>
      </div>

      {/* Description section */}
      <div className="items-center px-4 py-1 w-72">
        <span className="text-sm font-bold text-black">You’ll learn about: </span>
        <span className="text-sm font-normal text-black">{course.description}</span>
      </div>

      {/* Difficulty and lessons section */}
      <div className="px-4 mb-3">
        <span className="w-36 text-[#01000f] text-sm font-bold">{course.level}</span>
        {/* NOTE: No equivalent information from API so show */}
        {/* <span className="mx-2 text-[#01000f] text-sm font-normal">•</span> */}
        {/* <span className="w-52 text-[#01000f] text-sm font-normal">Include {lessons} lessons</span> */}
      </div>

      {/* Footer section with button and price */}
      <div className="flex items-center self-end justify-between p-4">
        <button
          className="self-end w-36 h-[35px] font-semibold bg-transparent rounded-[10px] border-appPrimary border-[1px] text-appPrimary"
          onClick={() => handleCourseClick(course.id)}
        >
          {course.userEnrolled ? "Continue" : "Study Now"}
        </button>
        {/* NOTE: No equivalent information from API so show */}
        {/* <span className="text-lg font-bold text-appPrimary">{price}</span> */}
      </div>
    </div>
  );
}
