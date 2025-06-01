import { useNavigate, useLocation } from "react-router-dom";
import { steps } from "../constants";
import { useEditingProblem } from ".";

// Separate the wizard navigation and data management logic from UI
export const useProblemWizardStep = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const currentStep = steps[currentStepIndex];
  const { isEditingProblem } = useEditingProblem();

  const escapeForm = () => {
    navigate("/admin/problems/", { replace: true });
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      let navigatingUrl = `/admin/problems/create/${steps[index].path}`;
      if (isEditingProblem) {
        navigatingUrl += `?editProblem=true`;
      }
      navigate(navigatingUrl);
    } else if (index >= steps.length) {
      navigate("/admin/problems", { replace: true });
      return; // Prevent going to undefined step
    }
  };

  const goToNextStep = () => {
    goToStep(currentStepIndex + 1);
  };

  const goToPrevStep = () => {
    goToStep(currentStepIndex - 1);
  };

  return {
    currentStepIndex,
    currentStep,
    goToStep,
    goToNextStep,
    goToPrevStep,
    escapeForm
  };
};
