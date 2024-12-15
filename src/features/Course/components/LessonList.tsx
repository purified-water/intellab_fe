import { ILesson } from "../types";
import LessonListItem from "./LessonListItem";

interface LessonListProps {
  lessons: ILesson[];
  isEnrolled: boolean;
}

export const LessonList = (props: LessonListProps) => {
  const { lessons, isEnrolled } = props;

  // const renderHeader = () => {
  //   return (
  //     <div className="flex flex-row">
  //       <div className="flex flex-3 w-6/12" />
  //       <div className="flex flex-1 overflow-hidden max-w-[500px]">
  //         <div>
  //           <text className="text-2xl text-gray4 ml-5">Lessons</text>
  //         </div>
  //         <div>
  //           <text className="text-2xl text-gray4 ml-5">Practice</text>
  //         </div>

  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="mx-14 overflow-hidden">
      {/* NOTE: No equivalent information from API so show */}
      {/* {isEnrolled && renderHeader()} */}
      <ul className="list-none">
        {lessons.map((lesson, index) => (
          <LessonListItem key={lesson.id} lesson={lesson} index={index} isEnrolled={isEnrolled} />
        ))}
      </ul>
    </div>
  );
};
