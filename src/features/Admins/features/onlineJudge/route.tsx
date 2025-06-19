import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const JudgeManagementPage = lazy(() =>
  import("./pages/JudgeManagementPage").then((module) => ({ default: module.JudgeManagementPage }))
);

const JudgeManagementRoute: RouteObject[] = [
  {
    index: true,
    path: "judge-management",
    element: <JudgeManagementPage />
  }
];

export default JudgeManagementRoute;
