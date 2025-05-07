import { PreviewCourseBody } from "./PreviewCourseBody";
import { PreviewCourseHeader } from "./PreviewCourseHeader";
import { ICourse } from "@/types";

interface PreviewCourseProps {
  course: ICourse;
}

export const PreviewCourse = (props: PreviewCourseProps) => {
  const { course } = props;

  return (
    <div>
      <PreviewCourseHeader course={course} />
      <PreviewCourseBody course={course} />
    </div>
  );
};
