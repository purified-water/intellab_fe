import { HomePage, ExplorePage, SectionDetailPage } from "./pages";
import { RouteObject } from "react-router-dom";

const StudentOverallRoute: RouteObject[] = [
  {
    index: true,
    element: <HomePage />
  },
  {
    path: "/explore",
    element: <ExplorePage />
  },
  {
    path: "explore/:section",
    element: <SectionDetailPage />
  }
];

export default StudentOverallRoute;
