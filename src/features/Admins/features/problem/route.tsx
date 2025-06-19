import { Navigate, RouteObject } from "react-router-dom";
import { ProblemWizardLayout } from "./components/CreateProblem";
import { lazy } from "react";
import { steps } from "./constants";

const ProblemListPage = lazy(() => import("./pages").then((module) => ({ default: module.ProblemListPage })));
const ProblemGeneralPage = lazy(() =>
  import("./pages/CreateProblem").then((module) => ({ default: module.ProblemGeneralPage }))
);
const ProblemDescriptionPage = lazy(() =>
  import("./pages/CreateProblem").then((module) => ({ default: module.ProblemDescriptionPage }))
);
const ProblemBoilerplatePage = lazy(() =>
  import("./pages/CreateProblem").then((module) => ({ default: module.ProblemBoilerplatePage }))
);
const ProblemTestcasePage = lazy(() =>
  import("./pages/CreateProblem").then((module) => ({ default: module.ProblemTestcasePage }))
);
const ProblemSolutionPage = lazy(() =>
  import("./pages/CreateProblem").then((module) => ({ default: module.ProblemSolutionPage }))
);
const ProblemPreviewPage = lazy(() =>
  import("./pages/CreateProblem").then((module) => ({ default: module.ProblemPreviewPage }))
);

const ProblemRoute: RouteObject[] = [
  {
    path: "problems",
    children: [
      {
        index: true, // /problems
        element: <ProblemListPage />
      },
      {
        path: "create",
        element: <ProblemWizardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />
          },
          { path: steps[0].label, element: <ProblemGeneralPage /> },
          { path: steps[1].label, element: <ProblemDescriptionPage /> },
          { path: steps[2].label, element: <ProblemBoilerplatePage /> },
          { path: steps[3].label, element: <ProblemTestcasePage /> },
          { path: steps[4].label, element: <ProblemSolutionPage /> },
          { path: steps[5].label, element: <ProblemPreviewPage /> }
        ]
      }
    ]
  }
];

export default ProblemRoute;
