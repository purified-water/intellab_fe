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
import { StepGuard } from "../../../course/components/StepGuard";
import { isGeneralStepValid } from "../../utils";

const problemDescriptionSchema = createProblemSchema.pick({
  problemDescription: true
});

type ProblemDescriptionSchema = z.infer<typeof problemDescriptionSchema>;

export const ProblemDescriptionPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { goToNextStep } = useProblemWizardStep();
  const formData = useSelector((state: RootState) => state.createProblem);

  // Initialize form with Zod validation
  const form = useForm<ProblemDescriptionSchema>({
    resolver: zodResolver(problemDescriptionSchema),
    defaultValues: {
      problemDescription: formData.problemDescription || ""
    }
  });

  const onSubmit = async (data: ProblemDescriptionSchema) => {
    dispatch(setCreateProblem(data));
    goToNextStep(); // This should be called in muatation function rather than here
  };

  return (
    <StepGuard checkValid={isGeneralStepValid} redirectTo="/admin/problems/create/general">
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
            name="problemDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Problem Description" />
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
