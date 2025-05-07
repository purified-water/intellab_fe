import LessonListItem from "./LessonListItem";
import { CreateLessonSchema } from "../../../../schemas";

interface LessonListProps {
  lessons: CreateLessonSchema[];
}

export const LessonList = ({ lessons }: LessonListProps) => {
  return (
    <div className="overflow-hidden">
      <ul className="list-none">
        {lessons.map((lesson) => (
          <LessonListItem key={lesson.lessonId} lesson={lesson} />
        ))}
      </ul>
    </div>
  );
};
