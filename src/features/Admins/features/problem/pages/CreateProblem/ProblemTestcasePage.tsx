import { Spinner } from "@/components/ui";
import { useState } from "react";
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

export const ProblemTestcasePage = () => {
  const [isLoading] = useState(false); // This will be replaced with the isLoading from useQuery function to get testcases
  const [testcaseAction, setTestcaseAction] = useState<TestcaseAction>({
    type: "default"
  });
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.createProblem);
  const testcaseList = formData.problemTestcases || [];
  const toast = useToast();

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

  return (
    <StepGuard checkValid={isBoilerplateStepValid} redirectTo="/admin/problems/create/boilerplate">
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
