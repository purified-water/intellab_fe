import { CourseDetailPage } from "./pages";
import { RouteObject } from "react-router-dom";

const CourseRoute: RouteObject[] = [
  {
    path: "/course/:id",
    element: <CourseDetailPage />
  }
];

export default CourseRoute;
