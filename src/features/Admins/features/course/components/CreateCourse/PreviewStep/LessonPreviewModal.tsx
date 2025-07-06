import { useState, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import { CreateLessonSchema, CreateCourseSchema } from "../../../schemas";
import { AdminRenderLessonContent } from "../../AdminRenderLessonContent";
import { Button } from "@/components/ui";
import { extractTOC, TOCItem } from "@/components/LessonContent/SharedLessonComponents";

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: CreateLessonSchema;
  courseData: CreateCourseSchema;
}

export const LessonPreviewModal = ({ isOpen, onClose, lesson, courseData }: LessonPreviewModalProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");

  // Generate TOC from lesson content using shared function
  useEffect(() => {
    if (lesson.lessonContent) {
      const headings = extractTOC(lesson.lessonContent);
      setTocItems(headings);
    }
  }, [lesson.lessonContent]);

  // Handle scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveHeading(id);
    }
  };

  // Get next lesson
  const getNextLesson = () => {
    const lessons = courseData.courseLessons || [];
    const currentIndex = lessons.findIndex((l) => l.lessonId === lesson.lessonId);

    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      return lessons[currentIndex + 1];
    }

    return null;
  };

  const handleQuizClick = () => {
    console.log("Quiz clicked for lesson:", lesson.lessonId);
  };

  const handleProblemClick = () => {
    console.log("Problem clicked for lesson:", lesson.lessonId);
  };

  const renderQuizButton = () => {
    if (!lesson.hasQuiz) return null;

    return (
      <div className="flex-col items-center justify-center mb-6">
        <div className="mb-4 text-xl font-bold">Continue to quiz to complete this theory lesson</div>
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
        className="flex items-center max-w-5xl gap-2 px-3 py-3 mb-4 cursor-pointer border-y border-gray4"
        onClick={handleProblemClick}
      >
        <p>Solve this lesson&apos;s problem</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const nextLesson = getNextLesson();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-7xl h-[90vh] bg-white rounded-lg shadow-xl flex">
        {/* Close button */}
        <Button type="button" onClick={onClose} className="absolute z-10 right-4 top-4" variant="ghost" size="icon">
          <X size={20} />
        </Button>

        {/* Content */}
        <div className="flex flex-1">
          {/* Main content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <div className="py-4 mb-6 space-y-2 border-b border-gray4">
              <p className="text-4xl font-bold">{lesson.lessonName}</p>
              <p className="text-gray3 line-clamp-4">{lesson.lessonDescription}</p>
            </div>

            {/* Lesson content */}
            <div className="mb-8">
              <AdminRenderLessonContent lesson={lesson} />
            </div>

            {/* Navigation buttons */}
            <div className="space-y-6">
              {renderQuizButton()}
              {nextLesson && <div className="text-xl font-bold">What&apos;s next?</div>}
              {renderProblemButton()}

              {nextLesson && (
                <div className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4">
                  <p>Continue to next Lesson:</p>
                  <p className="font-bold">{nextLesson.lessonName}</p>
                  <div className="ml-auto">
                    <ChevronRight style={{ color: "gray" }} size={22} />
                  </div>
                </div>
              )}

              {!nextLesson && (
                <div className="flex-col items-center justify-center">
                  <div className="mb-2 text-xl font-bold">This is the last lesson in the course!</div>
                  <div className="mb-4 text-lg">Course preview completed</div>
                </div>
              )}
            </div>
          </div>

          {/* Table of Contents */}
          {tocItems.length > 0 && (
            <div className="p-6 overflow-y-auto border-l border-gray-200 rounded-r-lg w-80 bg-gray-50">
              <h3 className="mb-4 text-lg font-bold">Table of Contents</h3>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      activeHeading === item.id
                        ? "border-l-appPrimary text-appPrimary font-semibold"
                        : "border-l-transparent hover:border-l-gray-300 text-gray2 hover:text-appPrimary"
                    }`}
                    style={{
                      paddingLeft: `${12 + (item.level - 1) * 16}px`
                    }}
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
