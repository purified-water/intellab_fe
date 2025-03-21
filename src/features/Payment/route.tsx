import { PaymentResultPage, PricingPage } from "./pages";
import { RouteObject } from "react-router-dom";

const PaymentRoute: RouteObject[] = [
  {
    path: "/pricing",
    element: <PricingPage />
  },
  {
    path: "/payment-result",
    element: <PaymentResultPage />
  }
];

export default PaymentRoute;
