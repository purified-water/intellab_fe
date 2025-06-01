import { useSearchParams } from "react-router-dom";

export function useEditingProblem() {
  const [searchParams] = useSearchParams();
  const isEditingProblem = searchParams.get("editProblem") !== null;
  return { isEditingProblem };
}
