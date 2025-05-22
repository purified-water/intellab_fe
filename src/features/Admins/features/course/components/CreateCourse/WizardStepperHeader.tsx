import { steps, CREATE_COURSE_STEP_NUMBERS } from "../../constants";
import { useCourseWizardStep, useEditingCourse } from "../../hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

// This component is used to display the stepper header for the course creation wizard.
export const WizardStepperHeader = () => {
  const { goToStep, currentStepIndex } = useCourseWizardStep();
  const { isEditingCourse } = useEditingCourse();
  const createCourse = useSelector((state: RootState) => state.createCourse);

  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        let isClickable = false;
        if (isEditingCourse) {
          if (createCourse.currentCreationStep === CREATE_COURSE_STEP_NUMBERS.PREVIEW) {
            isClickable = true;
          } else {
            isClickable = index < createCourse.currentCreationStep;
          }
        } else {
          isClickable = index < createCourse.currentCreationStep;
        }

        return (
          <div
            key={step.path}
            onClick={() => isClickable && goToStep(index)}
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
