import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { ICourse, ILesson } from "@/types";
import { useNavigate } from "react-router-dom";

interface LessonNavigationProps {
  lesson: ILesson | null;
  course: ICourse | null;
  navigateToNextLesson: () => void;
  navigateToCourse: () => void;
  navigateToProblem: () => void;
}

export const LessonNavigation = ({
  lesson,
  course,
  navigateToNextLesson,
  navigateToCourse,
  navigateToProblem
}: LessonNavigationProps) => {
  const navigate = useNavigate();

  if (!lesson || !course) return null;

  const renderReturnToCourse = () => {
    if (course) {
      return (
        <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToCourse}>
          <ChevronLeft className="text-appPrimary" size={22} />
          <p className="text-xl font-bold text-appPrimary">{course.courseName}</p>
        </div>
      );
    }
    return null;
  };

  const renderProblem = () => {
    if (!lesson?.problemId) return null;

    return (
      <div
        className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
        onClick={navigateToProblem}
      >
        <p>Solve this lesson's problem</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const renderNextLesson = () => {
    if (!lesson?.nextLessonId) return null;

    return (
      <div
        className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
        onClick={navigateToNextLesson}
      >
        <p>Continue to next Lesson:</p>
        <p className="font-bold">{lesson.nextLessonName}</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const renderFinishLesson = () => {
    if (lesson?.nextLessonId) return null;

    return (
      <div className="flex-col items-center justify-center">
        <div className="mb-2 text-2xl font-bold">Congratulation! You have finished the course</div>
        <div className="mb-6 text-xl font-semi">Return to course page to view you certificate</div>
        <Button
          className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
          onClick={navigateToCourse}
        >
          Return to course
        </Button>
      </div>
    );
  };

  const renderContinueToQuiz = () => {
    if (!lesson?.exerciseId) return null;

    return (
      <div className="flex-col items-center justify-center">
        <div className="mb-6 text-2xl font-bold">Pass the quiz to complete this theory lesson</div>
        <Button
          className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
          onClick={() =>
            navigate(
              `quiz/${lesson?.exerciseId}?learningId=${lesson?.learningId}&courseId=${lesson?.courseId}&isDone=${lesson?.isDoneTheory}`
            )
          }
        >
          {lesson.isDoneTheory ? <p>View your quiz result</p> : <p>Continue to quiz page</p>}
        </Button>
      </div>
    );
  };

  return {
    renderReturnToCourse,
    renderProblem,
    renderNextLesson,
    renderFinishLesson,
    renderContinueToQuiz
  };
};
