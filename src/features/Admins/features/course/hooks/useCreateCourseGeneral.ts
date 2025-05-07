import { useMutation, useQuery } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";
import { Category } from "@/types/createCourseTypes";

export const useCourseCategories = () =>
  useQuery<Category[]>({
    queryKey: ["createCourseCategories"],
    queryFn: adminCourseAPI.getCreateCourseCategories
  });

export const useCreateCourseGeneral = () => useMutation({ mutationFn: adminCourseAPI.postCreateCourseGeneralStep });

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
