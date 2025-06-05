import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ProblemWizardStepperHeader } from ".";
import { useEditingProblem } from "../../hooks";
import { adminProblemAPI } from "@/features/Admins/api";
import { useDispatch, useSelector } from "react-redux";
import { setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { RootState } from "@/redux/rootReducer";

export const ProblemWizardLayout = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const createProblem = useSelector((state: RootState) => state.createProblem);
  const { isEditingProblem } = useEditingProblem();

  const getTestcaseListAPI = async () => {
    await adminProblemAPI.getTestcasesOfProblem({
      query: { problemId: createProblem.problemId },
      onSuccess: async (testcases) => {
        dispatch(
          setCreateProblem({
            problemTestcases: testcases.map((testcase, index) => {
              return {
                testcaseId: testcase.testcaseId,
                testcaseInput: testcase.input,
                expectedOutput: testcase.output,
                testcaseOrder: index
              };
            })
          })
        );
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  useEffect(() => {
    if (isEditingProblem) {
      getTestcaseListAPI();
    }
  }, []);

  return (
    <div className="h-full p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-center">
        <ProblemWizardStepperHeader />
      </div>

      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};
