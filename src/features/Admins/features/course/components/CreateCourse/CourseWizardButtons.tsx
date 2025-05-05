import { Button } from "@/components/ui";
import { useCourseWizardStep } from "../../hooks";
import { steps } from "../../constants";
import { useLocation } from "react-router-dom";

type CourseWizardButtonsProps = {
  isSubmitting?: boolean;
  showPrev?: boolean;
  customNextText?: string;
  disabledNext?: boolean;
  ignoreSubmit?: boolean;
  onCallback?: () => void;
};

export const CourseWizardButtons = ({
  isSubmitting = false,
  showPrev = true,
  customNextText,
  disabledNext = false,
  ignoreSubmit
}: CourseWizardButtonsProps) => {
  const location = useLocation();
  const { goToPrevStep, goToNextStep } = useCourseWizardStep();

  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="flex justify-end mt-6 space-x-8">
      {showPrev && (
        <Button
          variant="outline"
          onClick={goToPrevStep}
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
          onClick={() => {
            goToNextStep();
          }}
        >
          {customNextText || (isLastStep ? "Save & Finish" : "Save & Continue")}
        </button>
      ) : (
        <button
          type="submit"
          disabled={disabledNext || isSubmitting}
          className="px-4 py-1 text-sm font-semibold text-white rounded-lg h-9 bg-appPrimary hover:bg-appPrimary/80 disabled:opacity-50"
        >
          {customNextText || (isLastStep ? "Save & Finish" : "Save & Continue")}
        </button>
      )}
    </div>
  );
};
