import { ILesson } from "../types";
import LessonListItem from "./LessonListItem";
// import { terminal } from "virtual:terminal"; // for debugging

interface LessonListProps {
  lessons: ILesson[];
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
