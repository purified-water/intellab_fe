import { Course } from "@/types/Course";
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
    <div className="w-80 h-[327px] bg-white rounded-xl border border-[#b3b3b3]">
      {/* Header section with background gradient and reviews */}
      <div className="w-80 h-40 bg-gradient-to-l from-[#6b60ca] via-appSecondary to-[#231e55] rounded-tl-xl rounded-tr-xl flex flex-col">
        <div className="flex items-center justify-end px-4 pt-3 mb-5">
          <div className="text-sm font-normal text-white">{reviews}</div>
          <div className="mx-1 text-sm font-normal text-white">•</div>
          <div className="flex items-center justify-center bg-slate-800 rounded-[9px] w-[58px] h-[25px]">
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
      <div className="items-center px-4 py-1 w-72">
        <span className="text-sm font-bold text-black">You’ll learn about: </span>
        <span className="text-sm font-normal text-black">{description}</span>
      </div>

      {/* Difficulty and lessons section */}
      <div className="px-4 mb-3">
        <span className="w-36 text-[#01000f] text-sm font-bold">{difficulty}</span>
        <span className="mx-2 text-[#01000f] text-sm font-normal">•</span>
        <span className="w-52 text-[#01000f] text-sm font-normal">Include {lessons} lessons</span>
      </div>

      {/* Footer section with button and price */}
      <div className="flex items-center self-end justify-between px-4">
        <button
          className="self-end w-36 h-[35px] font-semibold bg-transparent rounded-[10px] border-appPrimary border-[1px] text-appPrimary"
          onClick={() => onClick(id)}
        >
          Study Now
        </button>
        <span className="text-lg font-bold text-appPrimary">{price}</span>
      </div>
    </div>
  );
};
