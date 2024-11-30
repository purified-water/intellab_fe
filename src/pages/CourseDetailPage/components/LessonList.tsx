import React from "react";
import { BookOpenText, Code, CircleCheck } from "lucide-react";
import { Lesson } from "@/types";

interface LessonListProps {
  lessons: Lesson[];
  isEnrolled: boolean;
}

export const LessonList: React.FC<LessonListProps> = ({ lessons, isEnrolled }) => {
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
    <ul className="list-none">
      {lessons.map((lesson, index) => (
        <li key={lesson.id} className="flex items-center justify-between px-5 py-2 border-b border-gray-200">
          <h1 className="p-2.5">{index + 1}</h1>
          <div className="flex-1 pl-10 text-left">
            <h4 className="m-0 font-bold text-xl">{lesson.title}</h4>
            <p className="mt-2 text-gray-500">{lesson.description}</p>
          </div>
          {renderIcons(lesson)}
        </li>
      ))}
    </ul>
  );
};
