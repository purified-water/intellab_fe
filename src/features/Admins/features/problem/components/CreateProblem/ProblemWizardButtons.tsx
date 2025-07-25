import { AlertDialog, Button } from "@/components/ui";
import { steps } from "../../constants";
import { useLocation } from "react-router-dom";
import { useProblemWizardStep } from "../../hooks";
import { useDispatch } from "react-redux";
import { resetCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { useEditingProblem } from "../../hooks";

type ProblemWizardButtonsProps = {
  isSubmitting?: boolean;
  showPrev?: boolean;
  disabledNext?: boolean;
  ignoreSubmit?: boolean;
};

export const ProblemWizardButtons = ({
  isSubmitting = false,
  showPrev = true,
  disabledNext = false,
  ignoreSubmit
}: ProblemWizardButtonsProps) => {
  const location = useLocation();
  const { goToPrevStep, goToNextStep, escapeForm } = useProblemWizardStep();
  const dispatch = useDispatch();
  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const isLastStep = currentStepIndex === steps.length - 1;
  const { isEditingProblem } = useEditingProblem();

  const handleCancelCreateProblem = () => {
    dispatch(resetCreateProblem());
    escapeForm();
  };

  const handleContinueWithoutSubmit = () => {
    if (isLastStep) {
      return;
    }
    goToNextStep();
  };

  return (
    <div className="flex justify-end mt-6 space-x-8">
      {!isEditingProblem && (
        <AlertDialog
          title={"Cancel Problem Creation"}
          message={"Are you sure you want to cancel problem creation? All progress will be lost."}
          onConfirm={handleCancelCreateProblem}
        >
          <div className="px-4 py-2 text-sm text-gray3">Cancel</div>
        </AlertDialog>
      )}

      {showPrev && (
        <Button
          type="button"
          variant="outline"
          onClick={() => goToPrevStep()}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 text-gray2 disabled:opacity-50"
        >
          Previous
        </Button>
      )}

      {ignoreSubmit ? (
        <button
          type="button"
          disabled={disabledNext || isSubmitting}
          className="px-4 py-1 text-sm font-semibold text-white rounded-lg h-9 bg-appPrimary hover:bg-appPrimary/80 disabled:opacity-50"
          onClick={handleContinueWithoutSubmit}
        >
          {isLastStep ? "Save & Finish" : "Save & Continue"}
        </button>
      ) : (
        <button
          type="submit"
          disabled={disabledNext || isSubmitting}
          className="px-4 py-1 text-sm font-semibold text-white rounded-lg h-9 bg-appPrimary hover:bg-appPrimary/80 disabled:opacity-50"
        >
          {isLastStep ? "Save & Finish" : "Save & Continue"}
        </button>
      )}
    </div>
  );
};
