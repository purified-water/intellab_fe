import { MyPurchasesPage, PaymentResultPage, PricingPage, ReceiptPage } from "./pages";
import { RouteObject } from "react-router-dom";

const PaymentRoute: RouteObject[] = [
  {
    path: "/pricing",
    element: <PricingPage />
  },
  {
    path: "/payment-result",
    element: <PaymentResultPage />
  },
  {
    path: "/my-purchases",
    element: <MyPurchasesPage />
  },
  {
    path: "/my-purchases/receipt/:id",
    element: <ReceiptPage />
  }
];

export default PaymentRoute;
