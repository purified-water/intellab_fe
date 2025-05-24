import { ProblemWizardButtons } from "../../components/CreateProblem";
import { ProblemPreview } from "../../components/CreateProblem/ProblemPreview/ProblemPreview";
import { RootState } from "@/redux/rootReducer";
import { useSelector, useDispatch } from "react-redux";
import { useProblemWizardStep } from "../../hooks";
import { mapCreateProblemSchemaToProblemType } from "../../utils/mappers";
import { isSolutionStepValid } from "../../utils";
import { StepGuard } from "../../../course/components/StepGuard";
import { resetCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { useToast } from "@/hooks";
import { showToastError } from "@/utils";
import { adminProblemAPI } from "@/features/Admins/api";

export const ProblemPreviewPage = () => {
  const problemData = useSelector((state: RootState) => state.createProblem);
  const mappedProblemData = mapCreateProblemSchemaToProblemType(problemData);
  const { goToNextStep } = useProblemWizardStep();
  const dispatch = useDispatch();
  const toast = useToast();

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await adminProblemAPI.updateProblemCompletedStatus({
      query: { completedCreation: true },
      body: { problemId: problemData.problemId },
      onSuccess: async () => {
        setTimeout(() => dispatch(resetCreateProblem()), 1000);
        goToNextStep();
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  return (
    <StepGuard checkValid={isSolutionStepValid} redirectTo="/admin/problems/create/solution">
      <form onSubmit={onSubmit}>
        <ProblemPreview problemDetail={mappedProblemData} />
        <ProblemWizardButtons />
      </form>
    </StepGuard>
  );
};
