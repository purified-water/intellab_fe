import { Navigate, RouteObject } from "react-router-dom";
import { CourseWizardLayout } from "./components/CreateCourse";
import { CourseFinalStepsPage, CourseGeneralPage, CourseLessonsPage, CoursePreviewPage } from "./pages/CreateCourse";
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
      }
    ]
  }
];

export default CourseRoute;
