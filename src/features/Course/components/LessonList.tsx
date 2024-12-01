import { Lesson } from "@/types";
import LessonListItem from "./LessonListItem";

interface LessonListProps {
  lessons: Lesson[];
  isEnrolled: boolean;
}

export const LessonList = (props: LessonListProps) => {
  const { lessons, isEnrolled } = props;

  return (
    <ul className="list-none mx-14">
      {lessons.map((lesson, index) => (
        <LessonListItem key={lesson.id} lesson={lesson} index={index} isEnrolled={isEnrolled} />
      ))}
    </ul>
  );
};
