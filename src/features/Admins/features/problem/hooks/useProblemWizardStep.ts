import { useNavigate, useLocation } from "react-router-dom";
import { steps } from "../constants";

type ProblemWizardMode = "create" | "edit";
// Separate the wizard navigation and data management logic from UI
export const useProblemWizardStep = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const currentStep = steps[currentStepIndex];

  const escapeForm = () => {
    navigate("/admin/problems/", { replace: true });
  };

  const goToStep = (index: number, type: ProblemWizardMode = "create") => {
    if (index >= 0 && index < steps.length) {
      navigate(`/admin/problems/${type}/${steps[index].path}`);
    } else if (index >= steps.length) {
      navigate("/admin/problems", { replace: true });
      return; // Prevent going to undefined step
    }
  };

  const goToNextStep = (type?: ProblemWizardMode) => {
    goToStep(currentStepIndex + 1, type);
  };

  const goToPrevStep = (type?: ProblemWizardMode) => {
    goToStep(currentStepIndex - 1, type);
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
