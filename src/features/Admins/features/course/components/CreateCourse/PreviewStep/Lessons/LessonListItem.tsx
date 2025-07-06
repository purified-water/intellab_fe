import { BookOpenText, Code } from "lucide-react";
import { CreateLessonSchema, CreateCourseSchema } from "../../../../schemas";

interface LessonListItemProps {
  lesson: CreateLessonSchema;
  courseData?: CreateCourseSchema;
  onLessonClick?: (lesson: CreateLessonSchema) => void;
}

export default function LessonListItem({ lesson, onLessonClick }: LessonListItemProps) {
  const handleExerciseClick = () => {
    // navigateToLesson();
    console.log("Exercise clicked");
  };

  const handleProblemClick = () => {
    console.log("Problem clicked");
  };

  const handleLessonClick = () => {
    if (onLessonClick) {
      onLessonClick(lesson);
    } else {
      console.log("Lesson clicked", lesson);
    }
  };

  const renderIcons = () => {
    const unfinishedTheoryIcon = (
      <div className="w-11 h-11 rounded-[10px] bg-gray5 inline-flex items-center justify-center border-[0.5px] border-gray4">
        <BookOpenText className="w-5 h-5 cursor-pointer text-gray3" onClick={handleExerciseClick} />
      </div>
    );

    const unfinishedProblemIcon = (
      <div className="w-11 h-11 rounded-[10px] bg-gray5 inline-flex items-center justify-center border-[0.5px] border-gray4">
        <Code className="w-5 h-5 cursor-pointer text-gray3" onClick={handleProblemClick} />
      </div>
    );

    // Check if lesson has content to show theory icon
    const hasContent = lesson.lessonContent && lesson.lessonContent.trim() !== "";

    // Check if lesson has problem to show problem icon
    const hasProblem = lesson.hasProblem && lesson.lessonProblemId;

    return (
      <div className="flex flex-row items-start justify-start flex-1 gap-5 text-gray3">
        {hasContent && unfinishedTheoryIcon}
        {hasProblem && unfinishedProblemIcon}
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
