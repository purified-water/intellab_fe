import { LessonDetailPage } from "./pages";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/Navigation";

const LessonRoute: RouteObject[] = [
  {
    path: "/lesson/:id",
    element: (
      <ProtectedRoute>
        <LessonDetailPage />
      </ProtectedRoute>
    )
  }
];

export default LessonRoute;
