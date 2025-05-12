import { useNavigate, useLocation } from "react-router-dom";
import { steps } from "../constants";
import { AdminCourseViewTypes } from "../constants";

// Separate the wizard navigation and data management logic from UI
export const useCourseWizardStep = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const currentStep = steps[currentStepIndex];

  const escapeForm = () => {
    navigate("/admin/courses/", { replace: true });
  };

  const goToStep = (index: number, type: AdminCourseViewTypes = "create") => {
    if (index >= 0 && index < steps.length) {
      navigate(`/admin/courses/${type}/${steps[index].path}`);
    } else if (index >= steps.length) {
      navigate("/admin/courses", { replace: true });
      return; // Prevent going to undefined step
    }
  };

  const goToNextStep = (type?: AdminCourseViewTypes) => {
    goToStep(currentStepIndex + 1, type);
  };

  const goToPrevStep = (type?: AdminCourseViewTypes) => {
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
