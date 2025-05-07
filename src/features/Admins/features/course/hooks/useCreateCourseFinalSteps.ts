// useCreateFinalStep.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { CreateCourseFinalStepPayload } from "@/types";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";
import { AxiosError } from "axios";

export const useCreateFinalStep = (courseId: string, templateIndex: number) => {
  const toast = useToast();

  const submitFinalStep = useMutation({
    mutationFn: (payload: CreateCourseFinalStepPayload) => adminCourseAPI.postCreateCourseFinalStep(courseId, payload),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Course created successfully" });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        showToastError({ toast: toast.toast, message: error.message });
      } else {
        showToastError({ toast: toast.toast, message: "An unexpected error occurred" });
      }
    }
  });
  const getCertificateTemplates = useQuery({
    queryKey: ["course", templateIndex, "certificates"],
    queryFn: () => adminCourseAPI.getCreateCourseCertificateTemplates(templateIndex)
  });

  return { submitFinalStep, getCertificateTemplates };
};
