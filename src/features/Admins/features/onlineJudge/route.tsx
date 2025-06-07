import { RouteObject } from "react-router-dom";
import { JudgeManagementPage } from "./pages/JudgeManagementPage";

const JudgeManagementRoute: RouteObject[] = [
  {
    index: true,
    path: "/admin/judge-management",
    element: <JudgeManagementPage />
  }
];

export default JudgeManagementRoute;
