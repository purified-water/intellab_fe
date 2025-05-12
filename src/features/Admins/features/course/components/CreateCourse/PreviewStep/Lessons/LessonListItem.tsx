import { BookOpenText, Code } from "lucide-react";
import { CreateLessonSchema } from "../../../../schemas";

interface LessonListItemProps {
  lesson: CreateLessonSchema;
}

export default function LessonListItem({ lesson }: LessonListItemProps) {
  const handleExerciseClick = () => {
    // navigateToLesson();
    console.log("Exercise clicked");
  };

  const handleProblemClick = () => {
    // navigate(
    //   `/problems/${lesson.problemId}?lessonId=${lesson.lessonId}&lessonName=${lesson.lessonName}&courseId=${course.courseId}&courseName=${course.courseName}&learningId=${lesson.learningId}`
    // );
    console.log("Problem clicked");
  };

  const handleLessonClick = () => {
    // navigate(
    //   `/lessons/${lesson.lessonId}?courseId=${course.courseId}&courseName=${course.courseName}&learningId=${lesson.learningId}`
    // );
    console.log("Lesson clicked", lesson);
  };

  const renderIcons = () => {
    return (
      <div className="flex flex-row flex-1 gap-12 text-gray3">
        <BookOpenText className="w-8 h-8 cursor-pointer" onClick={handleExerciseClick} />
        {lesson.lessonProblemId && <Code className="w-8 h-8 cursor-pointer" onClick={handleProblemClick} />}
      </div>
    );
  };

  return (
    <li key={lesson.lessonId} className={`px-8 py-4 flex-wrap overflow-hidden border-b border-gray4 hover:bg-gray6/80`}>
      <div className="flex flex-row items-center justify-center overflow-hidden max-w-screen-2xl">
        <h2 className="text-3xl font-bold">{lesson.lessonOrder}</h2>
        <div className="ml-8 text-left flex-col min-w-[200px] w-full cursor-pointer" onClick={handleLessonClick}>
          <h4 className="flex-wrap overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap">
            {lesson.lessonName}{" "}
          </h4>
          {lesson.lessonDescription && (
            <p className="overflow-hidden text-gray3 text-ellipsis whitespace-nowrap">{lesson.lessonDescription}</p>
          )}
        </div>
        {renderIcons()}
      </div>
    </li>
  );
}
