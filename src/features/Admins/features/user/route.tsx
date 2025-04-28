import { RouteObject } from "react-router-dom";
import { UserListPage } from "./pages";

const UserRoute: RouteObject[] = [
  {
    path: "users",
    element: <UserListPage />
  }
];

export default UserRoute;
