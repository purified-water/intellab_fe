import { useMutation } from "@tanstack/react-query";
import { adminCourseAPI } from "@/features/Admins/api";

export function useCourseMutation(step: string) {
  return useMutation({
    mutationFn: (data: FormData) => adminCourseAPI.postCreateCourseWithStep(step, data)
  });
}
