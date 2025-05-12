import { Navigate, RouteObject } from "react-router-dom";
import { CourseWizardLayout } from "./components/CreateCourse";
import { CourseWizardLayout as ViewCourseWizardLayout } from "./components/ViewCourse";
import { CourseFinalStepsPage, CourseGeneralPage, CourseLessonsPage, CoursePreviewPage } from "./pages/CreateCourse";
import {
  ViewCourseFinalStepsPage,
  ViewCourseGeneralPage,
  ViewCourseLessonsPage,
  ViewCoursePreviewPage
} from "./pages/ViewCourse";
import { CourseListPage } from "./pages";

const CourseRoute: RouteObject[] = [
  {
    path: "courses",
    children: [
      {
        index: true, // /courses
        element: <CourseListPage />
      },
      {
        path: "create",
        element: <CourseWizardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />
          },
          { path: "general", element: <CourseGeneralPage /> },
          { path: "lessons", element: <CourseLessonsPage /> },
          { path: "final-steps", element: <CourseFinalStepsPage /> },
          { path: "preview", element: <CoursePreviewPage /> }
        ]
      },
      {
        path: "view",
        element: <ViewCourseWizardLayout type="view" />,
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />
          },
          { path: "general", element: <ViewCourseGeneralPage /> },
          { path: "lessons", element: <ViewCourseLessonsPage /> },
          { path: "final-steps", element: <ViewCourseFinalStepsPage /> },
          { path: "preview", element: <ViewCoursePreviewPage /> }
        ]
      }
    ]
  }
];

export default CourseRoute;
