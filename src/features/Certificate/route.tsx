import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const CertificatePage = lazy(() => import("./pages").then((module) => ({ default: module.CertificatePage })));

const CertificateRoute: RouteObject[] = [
  {
    path: "certificate/:id",
    element: <CertificatePage />
  }
];

export default CertificateRoute;
