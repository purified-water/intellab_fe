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
import { showToastError, showToastSuccess } from "@/utils";
import { useEditingProblem } from "../../hooks";
import { CREATE_PROBLEM_STEP_NUMBERS } from "../../constants";
import { SEO } from "@/components/SEO";

export const ProblemTestcasePage = () => {
  const [testcaseAction, setTestcaseAction] = useState<TestcaseAction>({
    type: "default"
  });
  const dispatch = useDispatch();
  const createProblem = useSelector((state: RootState) => state.createProblem);
  const toast = useToast();
  const { isEditingProblem } = useEditingProblem();

  useEffect(() => {
    if (createProblem.currentCreationStep < CREATE_PROBLEM_STEP_NUMBERS.TESTCASE) {
      dispatch(setCreateProblem({ currentCreationStep: CREATE_PROBLEM_STEP_NUMBERS.TESTCASE }));
    }
  }, []);

  const deleteTestcaseAPI = async (testcaseId: string) => {
    await adminProblemAPI.deleteTestCase({
      query: { testcaseId },
      onSuccess: async () => {
        const updatedTestcases = createProblem.problemTestcases.filter(
          (testcase) => testcase.testcaseId !== testcaseAction.testcaseId
        );
        dispatch(setCreateProblem({ problemTestcases: updatedTestcases }));
        setTestcaseAction({ type: "default" });
        showToastSuccess({
          toast: toast.toast,
          message: "The test case has been successfully deleted."
        });
      },
      onFail: async (error) => {
        showToastError({ toast: toast.toast, message: error });
      }
    });
  };

  useEffect(() => {
    if (testcaseAction.type === "delete" && testcaseAction.testcaseId) {
      if (createProblem.problemTestcases.length > 1) {
        deleteTestcaseAPI(testcaseAction.testcaseId);
      } else {
        showToastError({
          toast: toast.toast,
          title: "Cannot delete the last test case",
          message: "A problem must have at least one test case."
        });
      }
    }
  }, [testcaseAction]);

  const handleUpdateTestcases = async (newTestcase: CreateTestcaseSchema) => {
    let _isUpdate: boolean | undefined;
    let _testcaseId: string | undefined;
    let _problemId: string | undefined;
    let _isCreate: boolean | undefined;

    if (testcaseAction.type === "create") {
      _isUpdate = false;
      _testcaseId = undefined;
      _problemId = createProblem.problemId;
      _isCreate = isEditingProblem ? false : true;
    } else if (testcaseAction.type === "edit") {
      _isUpdate = true;
      _testcaseId = testcaseAction.testcaseId;
      _problemId = undefined;
      _isCreate = undefined;
    }

    if (_isUpdate !== undefined)
      await adminProblemAPI.createProblemTestCaseStepSingle({
        query: { isUpdate: _isUpdate, testCaseId: _testcaseId, isCreate: _isCreate },
        body: {
          problemId: _problemId,
          input: newTestcase.testcaseInput,
          output: newTestcase.expectedOutput,
          order: newTestcase.testcaseOrder
        },
        onSuccess: async (testcase) => {
          if (testcaseAction.type === "create") {
            dispatch(
              setCreateProblem({
                problemTestcases: [
                  ...createProblem.problemTestcases,
                  { ...newTestcase, testcaseId: testcase.testcaseId }
                ]
              })
            );
            showToastSuccess({
              toast: toast.toast,
              message: "The test case has been successfully created."
            });
          }
          if (testcaseAction.type === "edit") {
            const updatedTestcases = createProblem.problemTestcases.map((t) =>
              t.testcaseId === testcase.testcaseId ? { ...newTestcase, testcaseId: t.testcaseId } : t
            );
            dispatch(setCreateProblem({ problemTestcases: updatedTestcases }));
            showToastSuccess({
              toast: toast.toast,
              message: "The test case has been successfully updated."
            });
          }
          setTestcaseAction({
            type: "view",
            testcaseId: testcase.testcaseId
          });
        },
        onFail: async (error) => showToastError({ toast: toast.toast, message: error })
      });
  };

  const handleCancelTestcaseForm = () => {
    setTestcaseAction({ type: "default" });
  };

  const renderPageContent = () => {
    switch (testcaseAction.type) {
      case "create":
        return <ProblemTestcaseForm onSave={handleUpdateTestcases} onCancel={handleCancelTestcaseForm} />;
      case "edit":
        return (
          <ProblemTestcaseForm
            onSave={handleUpdateTestcases}
            testcaseId={testcaseAction.testcaseId}
            testcaseActionType="edit"
            onCancel={handleCancelTestcaseForm}
          />
        );
      case "view":
        return (
          <ProblemTestcaseForm
            onSave={handleUpdateTestcases}
            testcaseId={testcaseAction.testcaseId}
            testcaseActionType="view"
            onCancel={handleCancelTestcaseForm}
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
      <SEO title="Problem Testcase | Intellab" />

      <div className="flex w-full">
        <ProblemTestcaseList
          testcases={createProblem.problemTestcases}
          onSelectTestcase={setTestcaseAction}
          selectedTestcaseId={testcaseAction.testcaseId}
        />
        <div className="flex-1 p-4">
          {renderPageContent()}
          <ProblemWizardButtons ignoreSubmit={true} />
        </div>
      </div>
    </StepGuard>
  );
};
