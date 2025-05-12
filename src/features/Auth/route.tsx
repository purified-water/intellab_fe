import { LoginPage, SignUpPage, ForgetPasswordPage, ResetPasswordPage } from "./pages";
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
  },
  {
    path: "/profile/reset-password",
    element: <ResetPasswordPage />
  }
];

export default AuthRoute;
