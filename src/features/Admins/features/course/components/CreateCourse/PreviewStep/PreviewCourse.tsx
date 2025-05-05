import { PreviewCourseBody } from "./PreviewCourseBody";
import { PreviewCourseHeader } from "./PreviewCourseHeader";
import { useState } from "react";
import { ICreateCourse } from "../../../types";
import { DEFAULT_CREATE_COURSE } from "../../../constants";

export const PreviewCourse = () => {
  const [course] = useState<ICreateCourse>(DEFAULT_CREATE_COURSE);

  return (
    <div>
      <PreviewCourseHeader course={course} />
      <PreviewCourseBody course={course} />
    </div>
  );
};
