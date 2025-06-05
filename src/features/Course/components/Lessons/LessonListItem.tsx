import { ICourse, ILesson } from "@/types";
import { IEnrolledLesson } from "../../types";
import { BookOpenText, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils";
import { MdCheckCircleOutline } from "rocketicons/md";

const EMPTY_SPACE = <div className="w-11" />;
const FINISHED_ICON = <MdCheckCircleOutline className="w-6 h-6 icon-appEasy" />;

interface LessonListItemProps {
  lesson: ILesson | IEnrolledLesson;
  index: number;
  isEnrolled: boolean;
  lastViewedLessonId?: string;
  course: ICourse;
}

export default function LessonListItem(props: LessonListItemProps) {
  const { lesson, isEnrolled, lastViewedLessonId, course } = props;
  const toast = useToast();
  const hasBothRequirements =
    lesson.problemId &&
    lesson.problemId !== "" &&
    lesson.isDonePractice &&
    lesson.content &&
    lesson.content !== "" &&
    lesson.isDoneTheory;
  const hasOnceRequirement =
    (lesson.problemId && lesson.problemId !== "" && lesson.isDonePractice) ||
    (lesson.content && lesson.content !== "" && lesson.isDoneTheory);

  const navigate = useNavigate();

  const navigateToLesson = () => {
    navigate(`/lesson/${lesson.lessonId}?courseId=${lesson.courseId}&learningId=${lesson.learningId}`);
  };

  const handleLessonClick = () => {
    if (isEnrolled) {
      navigateToLesson();
    } else {
      showToastError({
        toast: toast.toast,
        title: "Enrollment required",
        message: "You need to enroll in the course to access this lesson"
      });
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
    const unfinishedTheoryIcon = (
      <div className="w-11 h-11 ml-2 rounded-[10px] bg-gray6/50 inline-flex items-center justify-center border-[0.5px] border-gray4">
        <BookOpenText className="w-5 h-5 cursor-pointer text-gray3" onClick={handleExerciseClick} />
      </div>
    );

    const finishedTheoryIcon = (onClick: React.MouseEventHandler) => {
      return (
        <div
          className="w-11 h-11 rounded-[10px] bg-green-100 inline-flex items-center justify-center border-[0.5px] border-appEasy"
          onClick={onClick}
        >
          <BookOpenText className="w-5 h-5 cursor-pointer text-appEasy" onClick={handleExerciseClick} />
        </div>
      );
    };

    const unfinishedProblemIcon = (
      <div className="w-11 h-11 rounded-[10px] bg-gray6/50 inline-flex items-center justify-center border-[0.5px] border-gray4">
        <Code className="w-5 h-5 cursor-pointer text-gray3" onClick={handleProblemClick} />
      </div>
    );

    const finishedProblemIcon = (onClick: React.MouseEventHandler) => {
      return (
        <div
          className="w-11 h-11 rounded-[10px] bg-green-100 inline-flex items-center justify-center border-[0.5px] border-appEasy"
          onClick={onClick}
        >
          <Code className="w-5 h-5 cursor-pointer text-appEasy" onClick={handleProblemClick} />
        </div>
      );
    };

    if (!isEnrolled) return null;

    let theoryIcon = EMPTY_SPACE;
    let problemIcon = EMPTY_SPACE;

    if (lesson.content && lesson.content !== "") {
      if (lesson.isDoneTheory) {
        theoryIcon = finishedTheoryIcon(handleExerciseClick);
      } else {
        theoryIcon = unfinishedTheoryIcon;
      }
    }

    if (lesson.problemId && lesson.problemId !== "") {
      if (lesson.isDonePractice) {
        problemIcon = finishedProblemIcon(handleProblemClick);
      } else {
        problemIcon = unfinishedProblemIcon;
      }
    }

    return (
      <div className="flex flex-row items-start justify-start flex-1 gap-5 text-gray3">
        {theoryIcon}
        {problemIcon}
      </div>
    );
  };

  return (
    <li
      key={lesson.lessonId}
      className={`px-8 py-4 flex-wrap overflow-hidden border-b border-gray6 ${lastViewedLessonId === lesson.lessonId ? "bg-appPrimary/10" : ""} hover:bg-gray6/50 min-h-[80px]`}
    >
      <div className="flex flex-row items-center justify-center h-full overflow-hidden max-w-screen-2xl">
        <h2 className="text-3xl font-bold">{lesson.lessonOrder}</h2>
        <div className="ml-8 text-left flex-col min-w-[200px] w-full cursor-pointer " onClick={handleLessonClick}>
          <h4 className="flex items-center overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap">
            {lesson.lessonName}{" "}
            <span className="ml-2 text-base font-normal">
              {lastViewedLessonId === lesson.lessonId && (
                <span className="text-sm font-medium text-appPrimary">• Last viewed</span>
              )}
            </span>
            {(hasOnceRequirement || hasBothRequirements) && <div>{FINISHED_ICON}</div>}
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
