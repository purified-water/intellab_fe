import { MyPurchasesPage, PaymentResultPage, PricingPage, ReceiptPage } from "./pages";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/Navigation";

const PaymentRoute: RouteObject[] = [
  {
    path: "/pricing",
    element: <PricingPage />
  },
  {
    path: "/payment-result",
    element: (
      <ProtectedRoute>
        <PaymentResultPage />
      </ProtectedRoute>
    )
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
