import { Navigate, RouteObject } from "react-router-dom";
import { DashboardPage } from "./pages";

const DashboardRoute: RouteObject[] = [
  {
    index: true,
    path: "/admin/dashboard",
    element: <DashboardPage />
  },
  {
    path: "/admin",
    element: <Navigate to="/admin/dashboard" replace />
  }
];

export default DashboardRoute;
