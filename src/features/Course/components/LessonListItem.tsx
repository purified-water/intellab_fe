import { ICourse, IEnrolledLesson, ILesson } from "../types";
import { BookOpenText, Code } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EMPTY_SPACE = <div className="w-8" />;
const FINISHED_ICON = <FontAwesomeIcon icon={faCircleCheck} className="w-8 h-8" color="#27AE60" />;

interface LessonListItemProps {
  lesson: ILesson | IEnrolledLesson;
  index: number;
  isEnrolled: boolean;
  lastViewedLessonId?: string;
  course: ICourse;
}

export default function LessonListItem(props: LessonListItemProps) {
  const { lesson, isEnrolled, lastViewedLessonId, course } = props;

  const navigate = useNavigate();

  const navigateToLesson = () => {
    navigate(`/lesson/${lesson.lessonId}?courseId=${lesson.courseId}&learningId=${lesson.learningId}`);
  };

  const handleLessonClick = () => {
    if (isEnrolled) {
      navigateToLesson();
    } else {
      alert("Please enroll the course to access this lesson");
    }
  };

  const handleExerciseClick = () => {
    navigateToLesson();
  };

  const handleProblemClick = () => {
    navigate(
      `/problems/${lesson.problemId}?lessonId=${lesson.lessonId}&lessonName=${lesson.lessonName}&courseId=${course.courseId}&courseName=${course.courseName}&learningId=${lesson.learningId}`
    );
  };

  const renderIcons = (lesson: ILesson | IEnrolledLesson) => {
    const unfinishedTheoryIcon = <BookOpenText className="w-8 h-8 cursor-pointer" onClick={handleExerciseClick} />;
    const unfinishedProblemIcon = <Code className="w-8 h-8 cursor-pointer" onClick={handleProblemClick} />;

    const renderFinishedIcon = (onClick: React.MouseEventHandler) => {
      return (
        <div className="cursor-pointer" onClick={onClick}>
          {FINISHED_ICON}
        </div>
      );
    };

    if (!isEnrolled) return null;

    let theoryIcon = EMPTY_SPACE;
    let problemIcon = EMPTY_SPACE;

    if (lesson.content && lesson.content !== "") {
      if (lesson.isDoneTheory) {
        theoryIcon = renderFinishedIcon(handleExerciseClick);
      } else {
        theoryIcon = unfinishedTheoryIcon;
      }
    }

    if (lesson.problemId && lesson.problemId !== "") {
      if (lesson.isDonePractice) {
        problemIcon = renderFinishedIcon(handleProblemClick);
      } else {
        problemIcon = unfinishedProblemIcon;
      }
    }

    return (
      <div className="flex flex-row flex-1 gap-12 text-gray3">
        {theoryIcon}
        {problemIcon}
      </div>
    );
  };

  return (
    <li
      key={lesson.lessonId}
      className={`px-8 py-4 flex-wrap overflow-hidden border-b border-gray4 ${lastViewedLessonId === lesson.lessonId ? "bg-gray5" : ""} hover:bg-gray6/80`}
    >
      <div className="flex flex-row items-center justify-center overflow-hidden max-w-screen-2xl">
        <h2 className="text-3xl font-bold">{lesson.lessonOrder}</h2>
        <div className="ml-8 text-left flex-col min-w-[200px] w-full cursor-pointer " onClick={handleLessonClick}>
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
