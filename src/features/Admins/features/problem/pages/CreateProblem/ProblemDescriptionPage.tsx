import { useEffect } from "react";
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
import { useProblemWizardStep, useEditingProblem } from "../../hooks";
import { RootState } from "@/redux/rootReducer";
import { StepGuard } from "../../../course/components/StepGuard";
import { isGeneralStepValid } from "../../utils";
import { adminProblemAPI } from "@/features/Admins/api";
import { CREATE_PROBLEM_STEP_NUMBERS } from "../../constants";
import { SEO } from "@/components/SEO";

const problemDescriptionSchema = createProblemSchema.pick({
  problemDescription: true
});

type ProblemDescriptionSchema = z.infer<typeof problemDescriptionSchema>;

export const ProblemDescriptionPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { goToNextStep } = useProblemWizardStep();
  const formData = useSelector((state: RootState) => state.createProblem);
  const { isEditingProblem } = useEditingProblem();

  useEffect(() => {
    if (formData.currentCreationStep < CREATE_PROBLEM_STEP_NUMBERS.DESCRIPTION) {
      dispatch(setCreateProblem({ currentCreationStep: CREATE_PROBLEM_STEP_NUMBERS.DESCRIPTION }));
    }
  }, []);

  // Initialize form with Zod validation
  const form = useForm<ProblemDescriptionSchema>({
    resolver: zodResolver(problemDescriptionSchema),
    defaultValues: {
      problemDescription: formData.problemDescription || ""
    }
  });

  const onSubmit = async (data: ProblemDescriptionSchema) => {
    // const editingProblem =
    //   (isEditingProblem && formData.currentCreationStep >= CREATE_PROBLEM_STEP_NUMBERS.DESCRIPTION) ||
    //   formData.currentCreationStep > CREATE_PROBLEM_STEP_NUMBERS.DESCRIPTION;
    // console.log("--> Editing in Problem Description Page:", editingProblem);

    await adminProblemAPI.createProblemDescriptionStep({
      body: {
        problemId: formData.problemId,
        description: data.problemDescription
      },
      onSuccess: async (problem) => {
        dispatch(setCreateProblem({ problemDescription: problem.description }));
        goToNextStep();
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  let redirectUtl = "/admin/problems/create/general";
  if (isEditingProblem) {
    redirectUtl += "?editProblem=true";
  }

  return (
    <StepGuard checkValid={isGeneralStepValid} redirectTo={redirectUtl}>
      <SEO title="Problem Description | Intellab" />

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
