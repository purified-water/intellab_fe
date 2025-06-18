import { useEffect } from "react";
import { ProblemWizardButtons } from "../../components/CreateProblem";
import { ProblemPreview } from "../../components/CreateProblem/ProblemPreview/ProblemPreview";
import { RootState } from "@/redux/rootReducer";
import { useSelector, useDispatch } from "react-redux";
import { useProblemWizardStep, useEditingProblem } from "../../hooks";
import { mapCreateProblemSchemaToProblemType } from "../../utils/mappers";
import { isSolutionStepValid } from "../../utils";
import { StepGuard } from "../../../course/components/StepGuard";
import { resetCreateProblem, setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { useToast } from "@/hooks";
import { showToastError } from "@/utils";
import { adminProblemAPI } from "@/features/Admins/api";
import { CREATE_PROBLEM_STEP_NUMBERS } from "../../constants";
import { SEO } from "@/components/SEO";

export const ProblemPreviewPage = () => {
  const problemData = useSelector((state: RootState) => state.createProblem);
  const mappedProblemData = mapCreateProblemSchemaToProblemType(problemData);
  const { goToNextStep } = useProblemWizardStep();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isEditingProblem } = useEditingProblem();

  useEffect(() => {
    if (problemData.currentCreationStep < CREATE_PROBLEM_STEP_NUMBERS.PREVIEW) {
      dispatch(setCreateProblem({ currentCreationStep: CREATE_PROBLEM_STEP_NUMBERS.PREVIEW }));
    }
  }, []);

  const handleEditProblem = async () => {
    if (problemData.isCompletedCreation) {
      goToNextStep();
    } else {
      await handleCreateProblem();
    }
  };

  const handleCreateProblem = async () => {
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

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const editingProblem =
      (isEditingProblem && problemData.currentCreationStep >= CREATE_PROBLEM_STEP_NUMBERS.PREVIEW) ||
      problemData.currentCreationStep > CREATE_PROBLEM_STEP_NUMBERS.PREVIEW;
    //console.log("--> Editing in Problem Preview Page:", editingProblem);

    if (editingProblem) {
      await handleEditProblem();
    } else {
      await handleCreateProblem();
    }
  };

  let redirectUrl = "/admin/problems/create/solution";
  if (isEditingProblem) {
    redirectUrl += "?editProblem=true";
  }

  return (
    <StepGuard checkValid={isSolutionStepValid} redirectTo={redirectUrl}>
      <SEO title="Problem Preview | Intellab" />

      <form onSubmit={onSubmit}>
        <ProblemPreview problemDetail={mappedProblemData} />
        <ProblemWizardButtons />
      </form>
    </StepGuard>
  );
};
