import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const CourseDetailPage = lazy(() => import("./pages").then((module) => ({ default: module.CourseDetailPage })));

const CourseRoute: RouteObject[] = [
  {
    path: "course/:id",
    element: <CourseDetailPage />
  }
];

export default CourseRoute;
