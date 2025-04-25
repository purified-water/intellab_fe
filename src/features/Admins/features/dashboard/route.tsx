import { RouteObject } from "react-router-dom";
import { DashboardPage } from "./pages";

const DashboardRoute: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />
  }
];

export default DashboardRoute;
