import { Spinner } from "@/components/ui";
import { useState, useEffect } from "react";
import { ProblemTestcaseForm, ProblemTestcaseList, ProblemWizardButtons } from "../../components/CreateProblem";
import { CreateTestcaseSchema } from "../../schemas";
import { useDispatch, useSelector } from "react-redux";
import { setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { TestcaseAction } from "../../types";
import { RootState } from "@/redux/rootReducer";
import { StepGuard } from "../../../course/components/StepGuard";
import { isBoilerplateStepValid } from "../../utils";
import { adminProblemAPI } from "@/features/Admins/api";
import { useToast } from "@/hooks";
import { showToastError } from "@/utils";
import { useEditingProblem } from "../../hooks";
import { CREATE_PROBLEM_STEP_NUMBERS } from "../../constants";

export const ProblemTestcasePage = () => {
  const [isLoading] = useState(false); // This will be replaced with the isLoading from useQuery function to get testcases
  const [testcaseAction, setTestcaseAction] = useState<TestcaseAction>({
    type: "default"
  });
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.createProblem);
  const testcaseList = formData.problemTestcases || [];
  const toast = useToast();
  const { isEditingProblem } = useEditingProblem();

  useEffect(() => {
    if (formData.currentCreationStep < CREATE_PROBLEM_STEP_NUMBERS.TESTCASE) {
      dispatch(setCreateProblem({ currentCreationStep: CREATE_PROBLEM_STEP_NUMBERS.TESTCASE }));
    }
  }, []);

  const handleUpdateTestcases = async (newTestcase: CreateTestcaseSchema) => {
    await adminProblemAPI.createProblemTestCaseStepSingle({
      body: {
        problemId: formData.problemId,
        input: newTestcase.testcaseInput,
        output: newTestcase.expectedOutput
      },
      onSuccess: async (testcase) => {
        dispatch(
          setCreateProblem({ problemTestcases: [...testcaseList, { ...newTestcase, testcaseId: testcase.testcaseId }] })
        );
        setTestcaseAction({ type: "default" });
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  const renderPageContent = () => {
    switch (testcaseAction.type) {
      case "create":
        return <ProblemTestcaseForm onSave={handleUpdateTestcases} />;
      case "edit":
        return (
          <ProblemTestcaseForm
            onSave={handleUpdateTestcases}
            testcaseId={testcaseAction.testcaseId}
            testcaseActionType="edit"
          />
        );
      case "view":
        return (
          <ProblemTestcaseForm
            onSave={handleUpdateTestcases}
            testcaseId={testcaseAction.testcaseId}
            testcaseActionType="view"
          />
        );
    }
  };

  let redirectUrl = "/admin/problems/create/boilerplate";
  if (isEditingProblem) {
    redirectUrl += "?editProblem=true";
  }

  return (
    <StepGuard checkValid={isBoilerplateStepValid} redirectTo={redirectUrl}>
      <div className="flex w-full">
        {isLoading ? (
          <div className="flex items-center justify-center w-24">
            <Spinner loading={isLoading} />
          </div>
        ) : (
          <ProblemTestcaseList testcases={testcaseList} onSelectTestcase={setTestcaseAction} />
        )}

        <div className="flex-1 p-4">
          {renderPageContent()}
          <ProblemWizardButtons ignoreSubmit={true} />
        </div>
      </div>
    </StepGuard>
  );
};
