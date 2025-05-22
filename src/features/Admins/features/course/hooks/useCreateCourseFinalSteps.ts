// useCreateFinalStep.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { CreateCourseFinalStepPayload } from "@/types";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";
import { AxiosError } from "axios";
import { useCourseWizardStep } from "./useCourseWizardStep";

export const useCreateFinalStep = (courseId: string, templateIndex: number) => {
  const toast = useToast();
  const { goToNextStep } = useCourseWizardStep();

  const submitFinalStep = useMutation({
    mutationFn: (payload: CreateCourseFinalStepPayload) => adminCourseAPI.postCreateCourseFinalStep(courseId, payload),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Update final steps successfully" });
      goToNextStep();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        showToastError({ toast: toast.toast, message: error.message });
      } else {
        showToastError({ toast: toast.toast, message: "An unexpected error occurred" });
      }
    }
  });

  const EditFinalStep = useMutation({
    mutationFn: (payload: CreateCourseFinalStepPayload) => adminCourseAPI.putCreateCourseFinalStep(courseId, payload),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Update final steps successfully" });
      goToNextStep();
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

  return { submitFinalStep, EditFinalStep, getCertificateTemplates };
};
