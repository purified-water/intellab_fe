import { useNavigate, useLocation } from "react-router-dom";
import { steps } from "../constants";
import { useEditingCourse } from ".";
import { useDispatch } from "react-redux";
import { resetCreateCourse } from "@/redux/createCourse/createCourseSlice";

// Separate the wizard navigation and data management logic from UI
export const useCourseWizardStep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const currentStep = steps[currentStepIndex];
  const { isEditingCourse } = useEditingCourse();

  const escapeForm = () => {
    // Clear the Redux state first to prevent StepGuard redirects
    dispatch(resetCreateCourse());
    // Navigate to courses list and ensure we don't carry over any query parameters
    navigate("/admin/courses", { replace: true });
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      let navigatingUrl = `/admin/courses/create/${steps[index].path}`;
      if (isEditingCourse) {
        navigatingUrl += `?editCourse=true`;
      }
      navigate(navigatingUrl);
    } else if (index >= steps.length) {
      navigate("/admin/courses", { replace: true });
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
