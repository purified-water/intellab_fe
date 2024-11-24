import { Course } from "../../../types/Course";
import React from "react";

export const CourseComponent: React.FC<Course> = ({
  id,
  title,
  reviews,
  rating,
  description,
  difficulty,
  lessons,
  price,
  imageSrc,
  onClick
}) => {
  return (
    <div className="w-[310px] h-[327px] bg-white rounded-xl border border-[#b3b3b3]">
      {/* Header section with background gradient and reviews */}
      <div className="w-[310px] h-40 bg-gradient-to-l from-[#6b60ca] via-[#31259d] to-[#231e55] rounded-tl-xl rounded-tr-xl flex flex-col">
        <div className="flex items-center justify-end px-4 pt-3 mb-5">
          <div className="text-sm font-normal text-white">{reviews}</div>
          <div className="mx-1 text-sm font-normal text-white">•</div>
          <div className="flex items-center justify-center bg-black rounded-[9px] w-[58px] h-[25px] opacity-60">
            <img className="w-4 h-4 mr-1" src="../../src/assets/rate.svg" alt="Rating" />
            <div className="text-white">{rating}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="ml-4 text-2xl font-bold text-white">{title}</h2>
          <img src={imageSrc} alt="Course" className="w-24 h-24 mr-4 opacity-70" />
        </div>
      </div>

      {/* Description section */}
      <div className="w-[276px] items-center px-4 py-1">
        <span className="text-sm font-bold text-black">You’ll learn about: </span>
        <span className="text-sm font-normal text-black">{description}</span>
      </div>

      {/* Difficulty and lessons section */}
      <div className="px-4 mb-3">
        <span className="w-[97.75px] text-[#01000f] text-sm font-bold">{difficulty}</span>
        <span className="mx-2 text-[#01000f] text-sm font-normal">•</span>
        <span className="w-[166.75px] text-[#01000f] text-sm font-normal">Include {lessons} lessons</span>
      </div>

      {/* Footer section with button and price */}
      <div className="flex items-center justify-between px-4">
        <button
          className="w-[108px] h-[35px] font-semibold bg-transparent rounded-[10px] border-[#5a3295] border-[1px] text-[#5a3295]"
          onClick={() => onClick(id)}
        >
          Study Now
        </button>
        <span className="text-lg font-semibold text-[#5a3295]">{price}</span>
      </div>
    </div>
  );
};
