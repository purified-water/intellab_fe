import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";
import { CourseWizardLayout } from "./components/CreateCourse";

const CourseListPage = lazy(() => import("./pages").then((module) => ({ default: module.CourseListPage })));
const CourseGeneralPage = lazy(() =>
  import("./pages/CreateCourse").then((module) => ({ default: module.CourseGeneralPage }))
);
const CourseLessonsPage = lazy(() =>
  import("./pages/CreateCourse").then((module) => ({ default: module.CourseLessonsPage }))
);
const CourseFinalStepsPage = lazy(() =>
  import("./pages/CreateCourse").then((module) => ({ default: module.CourseFinalStepsPage }))
);
const CoursePreviewPage = lazy(() =>
  import("./pages/CreateCourse").then((module) => ({ default: module.CoursePreviewPage }))
);

const AdminQuizPreview = lazy(() =>
  import("./components/AdminQuizPreview").then((module) => ({ default: module.AdminQuizPreview }))
);
const AdminProblemPreview = lazy(() =>
  import("./components/AdminProblemPreview").then((module) => ({ default: module.AdminProblemPreview }))
);

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
  },
  {
    path: "quiz-preview/:lessonId",
    element: <AdminQuizPreview />
  },
  {
    path: "problem-preview/:problemId",
    element: <AdminProblemPreview />
  }
];

export default CourseRoute;
