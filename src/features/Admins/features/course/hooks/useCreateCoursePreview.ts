// useUpdatePreviewStep.ts
import { useMutation } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { CreateCoursePreviewStepPayload } from "@/types";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";

export const useUpdatePreviewStep = (courseId: string) => {
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateCoursePreviewStepPayload) =>
      adminCourseAPI.putCreateCoursePreviewStep(courseId, payload),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Preview step updated successfully" });
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
