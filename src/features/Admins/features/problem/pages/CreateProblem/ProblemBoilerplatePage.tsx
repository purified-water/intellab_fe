import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  Input,
  FormDescription
} from "@/components/ui/shadcn";
import { z } from "zod";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { RequiredInputLabel } from "@/features/Admins/components";
import { createProblemSchema } from "../../schemas";
import { ProblemWizardButtons } from "../../components/CreateProblem";
import { BoilerplateDataItemList } from "../../components/CreateProblem";
import { useDispatch, useSelector } from "react-redux";
import { setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { useProblemWizardStep } from "../../hooks";
import { RootState } from "@/redux/rootReducer";
import { StepGuard } from "../../../course/components/StepGuard";
import { isDescriptionStepValid } from "../../utils";

const problemBoilerplateSchema = createProblemSchema.pick({
  problemStructure: true
});

type ProblemBoilerplateSchema = z.infer<typeof problemBoilerplateSchema>;

export const ProblemBoilerplatePage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { goToNextStep } = useProblemWizardStep();
  const formData = useSelector((state: RootState) => state.createProblem);

  // Initialize form with Zod validation
  const form = useForm<ProblemBoilerplateSchema>({
    resolver: zodResolver(problemBoilerplateSchema),
    defaultValues: {
      problemStructure: {
        functionName: formData.problemStructure.functionName || "",
        inputStructure: formData.problemStructure.inputStructure || [],
        outputStructure: formData.problemStructure.outputStructure || []
      }
    }
  });

  const onSubmit = async (data: ProblemBoilerplateSchema) => {
    dispatch(setCreateProblem(data));
    goToNextStep(); // This should be called in muatation function rather than here
  };

  return (
    <StepGuard checkValid={isDescriptionStepValid} redirectTo="/admin/problems/create/description">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Form submission errors:", errors);
            console.log("Form data:", form.getValues());
            showToastError({ toast: toast.toast, message: "Please fix the errors in the form" });
          })}
          className="flex flex-col mx-auto gap-8 max-w-[1000px]"
        >
          <div className="text-sm">
            <span className="font-medium text-gray1">Instruction: </span>
            <span className="text-gray3">
              To create the function boilerplate for this problem, write the basic structure of the function by
              including the function name, input type and name, and output type and name that the user will use when
              submitting their solution.
            </span>
          </div>

          <FormField
            control={form.control}
            name="problemStructure.functionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Function Name" />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problemStructure.inputStructure"
            render={() => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Input Structure" />
                </FormLabel>
                <FormControl>
                  <BoilerplateDataItemList namePrefix="problemStructure.inputStructure" mode="input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problemStructure.outputStructure"
            render={() => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Output Structure" />
                </FormLabel>
                <FormControl>
                  <BoilerplateDataItemList namePrefix="problemStructure.outputStructure" mode="output" />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Note: The data types follow Python standards (e.g., int, string, list, etc.). These will be
                  automatically converted to equivalent types in other languages like Java, C++, or JavaScript.
                </FormDescription>
              </FormItem>
            )}
          />

          <ProblemWizardButtons isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </StepGuard>
  );
};
