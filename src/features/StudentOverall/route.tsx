import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const HomePage = lazy(() => import("./pages").then((module) => ({ default: module.HomePage })));
const ExplorePage = lazy(() => import("./pages").then((module) => ({ default: module.ExplorePage })));
const SectionDetailPage = lazy(() => import("./pages").then((module) => ({ default: module.SectionDetailPage })));

const StudentOverallRoute: RouteObject[] = [
  {
    index: true,
    element: <HomePage />
  },
  {
    path: "explore",
    element: <ExplorePage />
  },
  {
    path: "explore/:section",
    element: <SectionDetailPage />
  }
];

export default StudentOverallRoute;
