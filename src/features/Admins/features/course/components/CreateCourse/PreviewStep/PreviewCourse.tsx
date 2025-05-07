import { PreviewCourseBody } from "./PreviewCourseBody";
import { PreviewCourseHeader } from "./PreviewCourseHeader";
import { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";

export const PreviewCourse = () => {
  const coursePreviewData = useSelector((state: RootState) => state.createCourse);

  return (
    <div>
      <PreviewCourseHeader course={coursePreviewData} />
      <PreviewCourseBody course={coursePreviewData} />
    </div>
  );
};
