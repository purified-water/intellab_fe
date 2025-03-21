import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/redux/rootReducer";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { children } = props;

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
