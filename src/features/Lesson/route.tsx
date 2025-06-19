import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/Navigation";
const LessonDetailPage = lazy(() => import("./pages").then((module) => ({ default: module.LessonDetailPage })));

const LessonRoute: RouteObject[] = [
  {
    path: "lesson/:id",
    element: (
      <ProtectedRoute>
        <LessonDetailPage />
      </ProtectedRoute>
    )
  }
];

export default LessonRoute;
