import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/shadcn";
import { z } from "zod";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { AddMarkdownContent, RequiredInputLabel } from "@/features/Admins/components";
import { createProblemSchema } from "../../schemas";
import { ProblemWizardButtons } from "../../components/CreateProblem";
import { useDispatch, useSelector } from "react-redux";
import { setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { useProblemWizardStep } from "../../hooks";
import { RootState } from "@/redux/rootReducer";
import { isTestcasesStepValid } from "../../utils";
import { StepGuard } from "../../../course/components/StepGuard";

const problemSolutionSchema = createProblemSchema.pick({
  problemSolution: true
});

type ProblemSolutionSchema = z.infer<typeof problemSolutionSchema>;

export const ProblemSolutionPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { goToNextStep } = useProblemWizardStep();
  const formData = useSelector((state: RootState) => state.createProblem);

  // Initialize form with Zod validation
  const form = useForm<ProblemSolutionSchema>({
    resolver: zodResolver(problemSolutionSchema),
    defaultValues: {
      problemSolution: formData.problemSolution || ""
    }
  });

  const onSubmit = async (data: ProblemSolutionSchema) => {
    dispatch(setCreateProblem(data));
    goToNextStep(); // This should be called in mutation function rather than here
  };

  return (
    <StepGuard checkValid={isTestcasesStepValid} redirectTo="/admin/problems/create/testcase">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Form submission errors:", errors);
            console.log("Form data:", form.getValues());
            showToastError({ toast: toast.toast, message: "Please fix the errors in the form" });
          })}
          className="flex flex-col mx-auto gap-8 max-w-[1000px]"
        >
          <FormField
            control={form.control}
            name="problemSolution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Problem Solution" />
                </FormLabel>
                <FormControl>
                  <AddMarkdownContent value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProblemWizardButtons isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </StepGuard>
  );
};
