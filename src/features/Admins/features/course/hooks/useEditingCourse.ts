import { useSearchParams } from "react-router-dom";

export function useEditingCourse() {
  const [searchParams] = useSearchParams();
  const isEditingCourse = searchParams.get("editCourse") !== null;
  return { isEditingCourse };
}
