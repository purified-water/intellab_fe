import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const TransactionManagementPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.TransactionManagementPage }))
);

const TransactionRoute: RouteObject[] = [
  {
    path: "transactions",
    element: <TransactionManagementPage />
  }
];

export default TransactionRoute;
