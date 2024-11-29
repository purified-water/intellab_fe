import React, { useState } from "react";
import { Lesson } from "@/types";
import { BookOpenText, Code, CircleCheck } from "lucide-react";

interface LessonListItemProps {
  lesson: Lesson;
  index: number;
  isEnrolled: boolean;
}

export default function LessonListItem(props: LessonListItemProps) {
  const { lesson, index, isEnrolled } = props;

  const handleClick = () => {
    console.log("Lesson clicked:", lesson.title);
  };

  const renderIcons = (lesson: Lesson) => {
    if (!isEnrolled) return null;
    return (
      <div className="flex gap-8 text-gray-500 mr-5">
        {lesson.isCompletedTheory ? (
          <CircleCheck className="w-6 h-6 cursor-pointer" />
        ) : (
          <BookOpenText className="w-6 h-6 cursor-pointer" />
        )}
        {lesson.isCompletedPractice ? (
          <CircleCheck className="w-6 h-6 cursor-pointer" />
        ) : (
          <Code className="w-6 h-6 cursor-pointer" />
        )}
      </div>
    );
  };

  return (
    <li key={lesson.id} className="border-b border-gray-200">
      <button className={`flex items-center justify-between w-full px-5 py-2 text-left`} onClick={handleClick}>
        <h2 className="p-2.5 text-3xl font-bold">{index + 1}</h2>
        <div className="flex-1 pl-7">
          <h4 className="m-0 font-bold text-xl">{lesson.title}</h4>
          <p className="mt-2 text-gray-500">{lesson.description}</p>
        </div>
        {renderIcons(lesson)}
      </button>
    </li>
  );
}
