import { ProblemDetail, ProblemsPage, SubmissionDetailPage } from "./pages";
import { RouteObject } from "react-router-dom";

const ProblemRoute: RouteObject[] = [
  {
    path: "problems",
    element: <ProblemsPage />
  },
  {
    path: "problems/:problemId",
    element: <ProblemDetail />
  },
  {
    path: "submissions/:submissionId",
    element: <SubmissionDetailPage />
  }
];

export default ProblemRoute;
