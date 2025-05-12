// useUpdatePreviewStep.ts
import { useMutation } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { CreateCoursePreviewStepPayload } from "@/types";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";
import { useDispatch } from "react-redux";
import { useCourseWizardStep } from "./useCourseWizardStep";
import { resetCreateCourse } from "@/redux/createCourse/createCourseSlice";

export const useUpdatePreviewStep = (courseId: string) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { goToNextStep } = useCourseWizardStep();

  return useMutation({
    mutationFn: (payload: CreateCoursePreviewStepPayload) =>
      adminCourseAPI.putCreateCoursePreviewStep(courseId, payload),
    onSuccess: () => {
      goToNextStep();
      showToastSuccess({ toast: toast.toast, message: "Update preview step successfully" });
      setTimeout(() => dispatch(resetCreateCourse()), 150); // Defer reset
    },
    onError: (error) => {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message });
      } else {
        showToastError({ toast: toast.toast, message: "An unexpected error occurred" });
      }
    }
  });
};
