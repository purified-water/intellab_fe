import { RouteObject } from "react-router-dom";
import { TransactionManagementPage } from "./pages";

const TransactionRoute: RouteObject[] = [
  {
    path: "/admin/transactions",
    element: <TransactionManagementPage />
  }
];

export default TransactionRoute;
