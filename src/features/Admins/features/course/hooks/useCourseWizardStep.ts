import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { steps } from "../constants";
// import { setCourseStepData } from "../store/courseSlice";
import { AdminCourseViewTypes } from "../constants";

// Separate the wizard navigation and data management logic from UI
export const useCourseWizardStep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const currentStep = steps[currentStepIndex];

  const goToStep = (index: number) => {
    if (index === steps.length) {
      // Finsish, return to course page
      navigate("/admin/courses");
    } else if (index >= 0 && index < steps.length) {
      navigate(`/admin/courses/create/${steps[index].path}`);
    }
  };

  const goToNextStep = (type?: AdminCourseViewTypes) => {
    goToStep(currentStepIndex + 1, type);
  };

  const goToPrevStep = (type?: AdminCourseViewTypes) => {
    goToStep(currentStepIndex - 1, type);
  };

  const saveStepData = () => {
    // dispatch(setCourseStepData({ step: stepKey, data }));
    console.log("Saving step data...");
  };

  return {
    currentStepIndex,
    currentStep,
    goToStep,
    goToNextStep,
    goToPrevStep,
    saveStepData
  };
};
