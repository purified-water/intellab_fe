import { LoginPage, SignUpPage, ForgetPasswordPage } from "./pages";
import { RouteObject } from "react-router-dom";

const AuthRoute: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignUpPage />
  },
  {
    path: "/forgot-password",
    element: <ForgetPasswordPage />
  }
];

export default AuthRoute;
