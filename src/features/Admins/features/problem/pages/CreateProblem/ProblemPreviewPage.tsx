import { ProblemWizardButtons } from "../../components/CreateProblem";
import { ProblemPreview } from "../../components/CreateProblem/ProblemPreview/ProblemPreview";
import { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";
import { useProblemWizardStep } from "../../hooks";
import { mapCreateProblemSchemaToProblemType } from "../../utils/mappers";
import { isSolutionStepValid } from "../../utils";
import { StepGuard } from "../../../course/components/StepGuard";

export const ProblemPreviewPage = () => {
  const problemData = useSelector((state: RootState) => state.createProblem);
  const mappedProblemData = mapCreateProblemSchemaToProblemType(problemData);
  const { goToNextStep } = useProblemWizardStep();

  const onSubmit = () => {
    console.log(problemData);
    goToNextStep();
  };

  return (
    <StepGuard checkValid={isSolutionStepValid} redirectTo="/admin/problems/create/solution">
      <form onSubmit={onSubmit}>
        <ProblemPreview problemDetail={mappedProblemData} />
        <ProblemWizardButtons ignoreSubmit={true} />
      </form>
    </StepGuard>
  );
};
