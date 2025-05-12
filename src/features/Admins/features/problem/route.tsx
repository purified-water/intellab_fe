import { RouteObject } from "react-router-dom";
import { ProblemListPage } from "./pages";

const ProblemRoute: RouteObject[] = [
  {
    path: "problems",
    element: <ProblemListPage />
  }
];

export default ProblemRoute;
