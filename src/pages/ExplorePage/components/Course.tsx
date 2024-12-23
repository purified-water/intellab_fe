import { useState, useEffect } from "react";
import { ICourse } from "@/features/Course/types";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { amountTransformer } from "@/utils";
import { DEFAULT_COURSE } from "@/constants/defaultData";

interface CourseProps {
  course: ICourse;
}

export default function Course(props: CourseProps) {
  const { course } = props;

  const { courseName, description, level, lessonNumber, price, unitPrice, reviews, rating, userEnrolled, courseLogo } =
    course;

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
    const token = Cookies.get("accessToken");
    if (userId == null || userId === "" || token == null) {
      alert("Please login to see the detail of this course");
    } else {
      if (userEnrolled) {
        // handle continue or view certificate
      } else {
        navigate(`/course/${id}`);
      }
    }
  };

  return (
    <div className="flex flex-col bg-white border w-80 rounded-xl border-gray4 h-80">
      {/* Header section with background gradient and reviews */}
      <div className="w-80 h-40 bg-gradient-to-l from-[#6b60ca] via-appSecondary to-[#231e55] rounded-tl-xl rounded-tr-xl flex flex-col p-2">
        <div className="flex items-center justify-end px-4 pt-3 mb-5">
          <div className="text-sm font-normal text-white">
            {reviews != undefined ? amountTransformer(reviews) : amountTransformer(DEFAULT_COURSE.reviews)}
          </div>
          <div className="mx-1 text-sm font-normal text-white">•</div>
          <div className="flex items-center justify-center bg-slate-800 rounded-[9px] w-[58px] h-[25px]">
            <img className="w-4 h-4 mr-1" src="../../src/assets/rate.svg" alt="Rating" />
            <div className="text-white">{rating ?? DEFAULT_COURSE.rating}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <h2 className="ml-4 text-2xl font-bold text-white">{courseName}</h2>
          <img src={courseLogo ?? DEFAULT_COURSE.courseLogo} alt="" className="w-24 h-24" />
        </div>
      </div>

      {/* Description section */}
      <div className="items-center flex-grow px-4 py-1 mt-1 w-72">
        <span className="text-sm font-normal text-black line-clamp-2">{description ?? DEFAULT_COURSE.description}</span>
      </div>

      {/* Difficulty and lessons section */}
      <div className="flex-grow px-4 mb-3">
        <span className="w-36 text-[#01000f] text-sm font-bold">{level ?? DEFAULT_COURSE.level}</span>
        <span className="mx-2 text-[#01000f] text-sm font-normal">•</span>
        <span className="w-52 text-[#01000f] text-sm font-normal">
          Include {lessonNumber ?? DEFAULT_COURSE.lessonNumber} lessons
        </span>
      </div>

      {/* Footer section */}
      <div className="flex items-baseline justify-between p-4 mt-auto bg-">
        <button
          className="self-end w-36 h-[35px] font-semibold bg-transparent rounded-xl border-appPrimary border text-appPrimary"
          onClick={() => handleCourseClick(course.courseId)}
        >
          {userEnrolled ? "Continue" : "Study Now"}
        </button>
        <span className="text-lg font-bold text-appPrimary">{`${price} ${unitPrice}`}</span>
      </div>
    </div>
  );
}
