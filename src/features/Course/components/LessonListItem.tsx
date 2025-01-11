import { IEnrolledLesson, ILesson } from "../types";
import { BookOpenText, Code } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { DEFAULT_LESSON } from "@/constants/defaultData";

interface LessonListItemProps {
  lesson: ILesson | IEnrolledLesson;
  index: number;
  isEnrolled: boolean;
  lastViewedLessonId?: string;
}

export default function LessonListItem(props: LessonListItemProps) {
  const { lesson, isEnrolled, lastViewedLessonId } = props;

  const navigate = useNavigate();

  const handleClick = () => {
    if (isEnrolled) {
      navigate(`/lesson/${lesson.lessonId}?courseId=${lesson.courseId}&learningId=${lesson.learningId}`);
    } else {
      alert("Please enroll the course to access this lesson");
    }
  };

  const handleProblemClick = () => {
    if (isEnrolled) {
      navigate(
        `/problems/${lesson.problemId}?lessonId=${lesson.lessonId}&lessonName=${lesson.lessonName}&courseId=${lesson.courseId}&courseName=${"FAKE_COURSE_NAME"}`
      );
    } else {
      alert("Please enroll the course to access this lesson");
    }
  };

  // NOTE: No property defined for isCompletedTheory and isCompletedPractice in API so temporarily commenting out this code
  const renderIcons = (lesson: ILesson | IEnrolledLesson) => {
    const finishedIcon = <FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10" color="#27AE60" />;
    const unfinishedTheoryIcon = <BookOpenText className="w-10 h-10 cursor-pointer" />;
    const unfinishedProblemIcon = <Code className="w-10 h-10 cursor-pointer" onClick={handleProblemClick} />;

    if (!isEnrolled) return null;
    return (
      <div className="flex flex-row flex-1 gap-16 text-gray3">
        {(lesson.isDoneTheory ?? DEFAULT_LESSON.isDoneTheory) ? finishedIcon : unfinishedTheoryIcon}
        {
          //lesson.problemId ?
          lesson.isDonePractice ? finishedIcon : unfinishedProblemIcon
          //: <div></div>
        }
      </div>
    );
  };

  return (
    <li
      key={lesson.lessonId}
      className={`pl-8 py-4 flex-wrap overflow-hidden border-b border-gray4 ${lastViewedLessonId === lesson.lessonId ? "bg-gray5" : ""}`}
    >
      <div className="flex flex-row max-w-screen-2xl  justify-center items-center overflow-hidden">
        <h2 className="text-3xl font-bold">{lesson.lessonOrder}</h2>
        <div className="ml-8 text-left flex-col min-w-[200px] w-full cursor-pointer " onClick={handleClick}>
          <h4 className="flex-wrap overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap">
            {lesson.lessonName}{" "}
            <span className="text-base font-normal">{lastViewedLessonId === lesson.lessonId && " • Last viewed"}</span>
          </h4>
          {lesson.description && (
            <p className="overflow-hidden text-gray3 text-ellipsis whitespace-nowrap">{lesson.description}</p>
          )}
        </div>
        {renderIcons(lesson)}
      </div>
    </li>
  );
}
