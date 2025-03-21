import { CertificatePage } from "./pages";
import { RouteObject } from "react-router-dom";

const CertificateRoute: RouteObject[] = [
  {
    path: "/certificate/:id",
    element: <CertificatePage />
  }
];

export default CertificateRoute;
