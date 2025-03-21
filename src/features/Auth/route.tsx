import { LoginPage, SignUpPage } from "./pages";
import { RouteObject } from "react-router-dom";

const AuthRoute: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignUpPage />
  }
];

export default AuthRoute;
