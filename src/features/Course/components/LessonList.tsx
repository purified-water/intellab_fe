import { ILesson, IEnrolledLesson, ICourse } from "../types";
import LessonListItem from "./LessonListItem";

interface LessonListProps {
  lessons: ILesson[] | IEnrolledLesson[];
  isEnrolled: boolean;
  lastViewedLessonId?: string;
  course: ICourse;
}

export const LessonList = (props: LessonListProps) => {
  const { lessons, isEnrolled, lastViewedLessonId, course } = props;

  // const renderHeader = () => {
  //   return (
  //     <div className="flex flex-row">
  //       <div className="flex w-6/12 flex-3" />
  //       <div className="flex flex-1 overflow-hidden max-w-[500px]">
  //         <div>
  //           <text className="ml-5 text-2xl text-gray4">Lessons</text>
  //         </div>
  //         <div>
  //           <text className="ml-5 text-2xl text-gray4">Practice</text>
  //         </div>

  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="overflow-hidden mx-14">
      {/* NOTE: No equivalent information from API so show */}
      {/* {isEnrolled && renderHeader()} */}
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
