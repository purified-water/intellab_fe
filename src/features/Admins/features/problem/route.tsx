import { Navigate, RouteObject } from "react-router-dom";
import { ProblemListPage } from "./pages";
import { ProblemWizardLayout } from "./components/CreateProblem";
import {
  ProblemBoilerplatePage,
  ProblemDescriptionPage,
  ProblemGeneralPage,
  ProblemPreviewPage,
  ProblemSolutionPage,
  ProblemTestcasePage
} from "./pages/CreateProblem";
import { steps } from "./constants";

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
