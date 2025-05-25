import { useMutation, useQuery } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";
import { Category, CreateCourseGeneralStepPayload } from "@/types/createCourseTypes";

export const useCourseCategories = () =>
  useQuery<Category[]>({
    queryKey: ["createCourseCategories"],
    queryFn: adminCourseAPI.getCreateCourseCategories
  });

export const useCreateCourseGeneral = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: adminCourseAPI.postCreateCourseGeneralStep,
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Update general step successfully" });
    }
  });
};

export const useEditCourseGeneral = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: ({ courseId, payload }: { courseId: string; payload: CreateCourseGeneralStepPayload }) =>
      adminCourseAPI.putCreateCourseGeneralStep(courseId, payload),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Update general step successfully" });
    }
  });
};

export const useUploadCourseImage = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: ({ courseId, file }: { courseId: string; file: File }) =>
      adminCourseAPI.postCreateCourseThumbnail(courseId, file),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Image uploaded successfully" });
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

export const useChangeCourseImageLink = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: ({ courseId, imageLink }: { courseId: string; imageLink: string }) =>
      adminCourseAPI.changeCourseImageLink(courseId, imageLink),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Changed image link successfully" });
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

export const useUploadImage = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: ({ file }: { file: File }) => adminCourseAPI.uploadImage(file),
    onSuccess: () => {
      showToastSuccess({ toast: toast.toast, message: "Image uploaded successfully" });
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
