import { NotificationPage } from "./pages/NotificationPage";
import { RouteObject } from "react-router-dom";

const NotificationRoute: RouteObject[] = [
  {
    path: "notification",
    element: <NotificationPage />
  }
];

export default NotificationRoute;
