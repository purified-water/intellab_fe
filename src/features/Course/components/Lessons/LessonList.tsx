import { ICourse, ILesson } from "@/types";
import { IEnrolledLesson } from "../../types";
import LessonListItem from "./LessonListItem";

interface LessonListProps {
  lessons: ILesson[] | IEnrolledLesson[];
  isEnrolled: boolean;
  lastViewedLessonId?: string;
  course: ICourse;
}

export const LessonList = (props: LessonListProps) => {
  const { lessons, isEnrolled, lastViewedLessonId, course } = props;
  return (
    <div className="overflow-hidden">
      <ul className="list-none">
        {lessons.map((lesson, index) => (
          <LessonListItem
            key={lesson.lessonId}
            lesson={lesson}
            index={index}
            isEnrolled={isEnrolled}
            lastViewedLessonId={lastViewedLessonId}
            course={course}
          />
        ))}
      </ul>
    </div>
  );
};
