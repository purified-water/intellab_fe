import { steps } from "../../constants";
import { useCourseWizardStep } from "../../hooks";
import { AdminCourseViewTypes } from "@/features/Admins/features/course/constants";

interface WizardStepperHeaderProps {
  type?: AdminCourseViewTypes;
}

// This component is used to display the stepper header for the course creation wizard.
export const WizardStepperHeader = (props: WizardStepperHeaderProps) => {
  const { type = "create" } = props;

  const { goToStep, currentStepIndex } = useCourseWizardStep();

  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isClickable = true; // in "view" and "edit" mode, all steps are clickable

        return (
          <div
            key={step.path}
            onClick={() => isClickable && goToStep(index, type)}
            className={`flex items-center space-x-2 text-xs cursor-pointer select-none ${
              isClickable ? "opacity-100" : "opacity-50 pointer-events-none"
            }`}
          >
            <div
              className={`size-6 flex justify-center items-center rounded-full font-medium transition-all ${
                isActive
                  ? "bg-appPrimary text-white"
                  : isClickable
                    ? "bg-appFadedPrimary/50 text-white"
                    : "border text-gray3"
              }`}
            >
              {index + 1}
            </div>
            <p>{step.label}</p>
            {index < steps.length - 1 && <span>→</span>}
          </div>
        );
      })}
    </div>
  );
};
