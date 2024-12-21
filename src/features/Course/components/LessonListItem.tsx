import { ILesson } from "../types";
import { BookOpenText, Code } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { DEFAULT_LESSON } from "@/constants/defaultData";

interface LessonListItemProps {
  lesson: ILesson;
  index: number;
  isEnrolled: boolean;
}

export default function LessonListItem(props: LessonListItemProps) {
  const { lesson, index, isEnrolled } = props;

  const navigate = useNavigate();

  const handleClick = () => {
    if (isEnrolled) {
      navigate(`/lesson/${lesson.lessonId}`);
    } else {
      alert("Please enroll the course to access this lesson");
    }
  };

  // NOTE: No property defined for isCompletedTheory and isCompletedPractice in API so temporarily commenting out this code
  const renderIcons = (lesson: ILesson) => {
    const finishedIcon = <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" color="#27AE60" />;
    const unfinishedTheoryIcon = <BookOpenText className="w-10 h-10 cursor-pointer" />;
    const unfinishedExerciseIcon = <Code className="w-10 h-10 cursor-pointer" />;

    if (!isEnrolled) return null;
    return (
      <div className="flex flex-row flex-1 gap-16 text-gray3">
        {(lesson.finishTheory ?? DEFAULT_LESSON.finishTheory) ? finishedIcon : unfinishedTheoryIcon}
        {(lesson.finishExercise ?? DEFAULT_LESSON.finishExercise) ? finishedIcon : unfinishedExerciseIcon}
      </div>
    );
  };

  return (
    <li key={lesson.lessonId} className="border-b border-gray4 w-full flex-wrap overflow-hidden">
      <button className="flex flex-row items-center w-full px-9 py-2 gap-10 overflow-hidden" onClick={handleClick}>
        <h2 className="text-3xl font-bold">{index + 1}</h2>
        <div className="text-left flex-1 overflow-hidden min-w-[200px]">
          <h4 className="m-0 font-bold text-xl flex-wrap overflow-hidden text-ellipsis whitespace-nowrap">
            {lesson.lessonName}
          </h4>
          <p className="mt-2 text-gray3 overflow-hidden text-ellipsis whitespace-nowrap">{lesson.description}</p>
        </div>
        {renderIcons(lesson)}
      </button>
    </li>
  );
}
