import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const LoginPage = lazy(() => import("./pages").then((module) => ({ default: module.LoginPage })));
const SignUpPage = lazy(() => import("./pages").then((module) => ({ default: module.SignUpPage })));
const ForgetPasswordPage = lazy(() => import("./pages").then((module) => ({ default: module.ForgetPasswordPage })));
const ResetPasswordPage = lazy(() => import("./pages").then((module) => ({ default: module.ResetPasswordPage })));

const AuthRoute: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage />
  },
  {
    path: "signup",
    element: <SignUpPage />
  },
  {
    path: "forgot-password",
    element: <ForgetPasswordPage />
  },
  {
    path: "profile/reset-password",
    element: <ResetPasswordPage />
  }
];

export default AuthRoute;
