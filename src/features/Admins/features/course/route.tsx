import { RouteObject } from "react-router-dom";
import { CourseListPage } from "./pages";

const CourseRoute: RouteObject[] = [
  {
    path: "courses",
    element: <CourseListPage />
  }
];

export default CourseRoute;
