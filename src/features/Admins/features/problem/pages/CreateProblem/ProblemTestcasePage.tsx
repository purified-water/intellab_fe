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
    let _isUpdate: boolean | undefined;
    let _testcaseId: string | undefined;
    let _problemId: string | undefined;

    if (testcaseAction.type === "create") {
      _isUpdate = false;
      _testcaseId = undefined;
      _problemId = formData.problemId;
    } else if (testcaseAction.type === "edit") {
      _isUpdate = true;
      _testcaseId = testcaseAction.testcaseId;
      _problemId = undefined;
    }

    if (_isUpdate != undefined) {
      await adminProblemAPI.createProblemTestCaseStepSingle({
        query: { isUpdate: _isUpdate, testCaseId: _testcaseId },
        body: {
          problemId: _problemId,
          input: newTestcase.testcaseInput,
          output: newTestcase.expectedOutput
        },
        onSuccess: async (testcase) => {
          if (testcaseAction.type === "create") {
            dispatch(
              setCreateProblem({
                problemTestcases: [...testcaseList, { ...newTestcase, testcaseId: testcase.testcaseId }]
              })
            );
          }
          if (testcaseAction.type === "edit") {
            const updatedTestcases = testcaseList.map((t) =>
              t.testcaseId === testcase.testcaseId ? { ...newTestcase, testcaseId: t.testcaseId } : t
            );
            dispatch(setCreateProblem({ problemTestcases: updatedTestcases }));
          }
        },
        onFail: async (error) => showToastError({ toast: toast.toast, message: error })
      });
    }
    setTestcaseAction({ type: "default" });
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
        <ProblemTestcaseList testcases={testcaseList} onSelectTestcase={setTestcaseAction} />
        <div className="flex-1 p-4">
          {renderPageContent()}
          <ProblemWizardButtons ignoreSubmit={true} />
        </div>
      </div>
    </StepGuard>
  );
};
