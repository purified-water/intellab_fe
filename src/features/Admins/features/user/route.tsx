import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const UserListPage = lazy(() => import("./pages").then((module) => ({ default: module.UserListPage })));

const UserRoute: RouteObject[] = [
  {
    path: "users",
    element: <UserListPage />
  }
];

export default UserRoute;
