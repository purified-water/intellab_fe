import React from "react";
import { ProgressBar } from "./ProgressBar";

interface HeaderProps {
  title: string;
  description: string;
  isEnrolled: boolean;
  onEnroll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, description, isEnrolled, onEnroll }) => {
  const renderReview = () => {
    return (
      <div className="text-xs">
        <span className="px-2 py-1 text-white bg-black rounded-full">⭐ 4.5</span>
        <span> • 15k reviews</span>
      </div>
    );
  };

  return (
    <div className="p-4 text-white bg-gradient-to-r from-[#6b46c1] to-[#31259d] rounded-lg flex flex-col gap-2.5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-400">{description}</p>
      {isEnrolled ? <ProgressBar progress={36.4} /> : renderReview()}
      {!isEnrolled && (
        <button
          className="px-4 py-2 text-base font-bold text-black bg-white rounded-lg w-28 mt-7 hover:bg-gray-300"
          onClick={onEnroll}
        >
          Enroll
        </button>
      )}
      {isEnrolled && (
        <button className="px-4 py-2 text-base font-bold text-black bg-white rounded-lg w-28 mt-7 hover:bg-gray-300">
          Continue
        </button>
      )}
    </div>
  );
};
