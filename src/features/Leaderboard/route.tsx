import { LeaderboardPage } from "./pages";
import { RouteObject } from "react-router-dom";

const LeaderboardRoute: RouteObject[] = [
  {
    path: "leaderboard",
    element: <LeaderboardPage />
  }
];

export default LeaderboardRoute;
