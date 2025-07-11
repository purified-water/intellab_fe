import { useState } from "react";
import LessonListItem from "./LessonListItem";
import { CreateLessonSchema, CreateCourseSchema } from "../../../../schemas";
import { LessonPreviewModal } from "../LessonPreviewModal";

interface LessonListProps {
  lessons: CreateLessonSchema[];
  courseData?: CreateCourseSchema;
}

export const LessonList = ({ lessons, courseData }: LessonListProps) => {
  const [selectedLesson, setSelectedLesson] = useState<CreateLessonSchema | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLessonClick = (lesson: CreateLessonSchema) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const handleNextLessonClick = () => {
    if (selectedLesson && courseData) {
      const lessons = courseData.courseLessons || [];
      const nextLessonIndex = lessons.findIndex(
        (lessonItem) => lessonItem.lessonOrder === (selectedLesson.lessonOrder ?? 0) + 1
      );

      if (nextLessonIndex !== -1) {
        const nextLesson = lessons[nextLessonIndex];
        setSelectedLesson(nextLesson);
      } else {
        handleCloseModal();
      }
    }
  };

  return (
    <div className="overflow-hidden">
      <ul className="list-none">
        {lessons.map((lesson) => (
          <LessonListItem
            key={lesson.lessonId}
            lesson={lesson}
            courseData={courseData}
            onLessonClick={handleLessonClick}
          />
        ))}
      </ul>

      {selectedLesson && courseData && (
        <LessonPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          lesson={selectedLesson}
          courseData={courseData}
          onNextLessonClick={handleNextLessonClick}
        />
      )}
    </div>
  );
};
