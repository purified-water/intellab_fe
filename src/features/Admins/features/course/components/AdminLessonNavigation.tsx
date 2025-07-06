import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { CreateLessonSchema } from "../schemas";

interface AdminLessonNavigationProps {
  lesson: CreateLessonSchema;
  nextLesson: CreateLessonSchema | null;
  courseData: string | null;
}

export const AdminLessonNavigation = ({ lesson, nextLesson, courseData }: AdminLessonNavigationProps) => {
  const handleNextLesson = () => {
    if (nextLesson && courseData) {
      const newUrl = `/admin/lesson/${nextLesson.lessonId}?courseData=${courseData}`;
      window.open(newUrl, "_blank");
    }
    console.log("Next lesson clicked:", nextLesson?.lessonId);
  };

  const handleQuizClick = () => {
    // Placeholder for quiz navigation - to be implemented later
    console.log("Quiz clicked for lesson:", lesson.lessonId);
  };

  const handleProblemClick = () => {
    // Placeholder for problem navigation - to be implemented later
    console.log("Problem clicked for lesson:", lesson.lessonId);
  };

  const renderQuizButton = () => {
    if (!lesson.hasQuiz) return null;

    return (
      <div className="flex-col items-center justify-center">
        <div className="mb-6 text-2xl font-bold">Continue to quiz to complete this theory lesson</div>
        <Button
          type="button"
          className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80"
          onClick={handleQuizClick}
        >
          Continue to quiz page
        </Button>
      </div>
    );
  };

  const renderProblemButton = () => {
    if (!lesson.hasProblem || !lesson.lessonProblemId) return null;

    return (
      <div
        className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
        onClick={handleProblemClick}
      >
        <p>Solve this lesson&apos;s problem</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const renderNextLessonButton = () => {
    if (!nextLesson) return null;

    return (
      <div
        className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
        onClick={handleNextLesson}
      >
        <p>Continue to next Lesson:</p>
        <p className="font-bold">{nextLesson.lessonName}</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const renderFinishMessage = () => {
    if (nextLesson) return null;

    return (
      <div className="flex-col items-center justify-center">
        <div className="mb-2 text-2xl font-bold">This is the last lesson in the course!</div>
        <div className="mb-6 text-xl font-semi">Course preview completed</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderQuizButton()}
      {nextLesson && <div className="text-2xl font-bold">What&apos;s next?</div>}
      {renderProblemButton()}
      {renderNextLessonButton()}
      {renderFinishMessage()}
    </div>
  );
};
