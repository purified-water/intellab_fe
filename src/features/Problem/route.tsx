import { ProblemDetail, ProblemsPage } from "./pages";
import { RouteObject } from "react-router-dom";

const ProblemRoute: RouteObject[] = [
  {
    path: "problems",
    element: <ProblemsPage />
  },
  {
    path: "problems/:problemId",
    element: <ProblemDetail />
  }
];

export default ProblemRoute;
