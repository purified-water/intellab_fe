import { Lesson } from "@/types";
import { BookOpenText, Code } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

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
      <div className="flex flex-row flex-1 gap-16 text-gray3">
        {lesson.isCompletedTheory ? (
          <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" />
        ) : (
          <BookOpenText className="w-10 h-10 cursor-pointer" />
        )}
        {lesson.isCompletedPractice ? (
          <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" />
        ) : (
          <Code className="w-10 h-10 cursor-pointer" />
        )}
      </div>
    );
  };

  return (
    <li key={lesson.id} className="flex-wrap w-full overflow-hidden border-b border-gray-200">
      <button className="flex flex-row items-center w-full gap-10 py-2 overflow-hidden px-9" onClick={handleClick}>
        <h2 className="text-3xl font-bold">{index + 1}</h2>
        <div className="text-left flex-1 overflow-hidden min-w-[200px]">
          <h4 className="flex-wrap m-0 overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap">
            {lesson.title}
          </h4>
          <p className="mt-2 overflow-hidden text-gray3 text-ellipsis whitespace-nowrap">{lesson.description}</p>
        </div>
        {renderIcons(lesson)}
      </button>
    </li>
  );
}
