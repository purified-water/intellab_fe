import { ILesson } from "../types";
import { BookOpenText, Code } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
      navigate(`/lesson/${lesson.id}`);
    } else {
      alert("Please enroll the course to access this lesson");
    }
  };

  // NOTE: No property defined for isCompletedTheory and isCompletedPractice in API so temporarily commenting out this code
  // const renderIcons = (lesson: ILesson) => {
  //   if (!isEnrolled) return null;
  //   return (
  //     <div className="flex flex-row flex-1 gap-16 text-gray3">
  //       {lesson.isCompletedTheory ? (
  //         <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" />
  //       ) : (
  //         <BookOpenText className="w-10 h-10 cursor-pointer" />
  //       )}
  //       {lesson.isCompletedPractice ? (
  //         <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" />
  //       ) : (
  //         <Code className="w-10 h-10 cursor-pointer" />
  //       )}
  //     </div>
  //   );
  // };

  return (
    <li key={lesson.id} className="border-b border-gray4 w-full flex-wrap overflow-hidden">
      <button className="flex flex-row items-center w-full px-9 py-2 gap-10 overflow-hidden" onClick={handleClick}>
        <h2 className="text-3xl font-bold">{index + 1}</h2>
        <div className="text-left flex-1 overflow-hidden min-w-[200px]">
          <h4 className="m-0 font-bold text-xl flex-wrap overflow-hidden text-ellipsis whitespace-nowrap">
            {lesson.name}
          </h4>
          <p className="mt-2 text-gray3 overflow-hidden text-ellipsis whitespace-nowrap">{lesson.description}</p>
        </div>
        {/* {renderIcons(lesson)} */}
      </button>
    </li>
  );
}
