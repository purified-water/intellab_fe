import { FormField, FormItem, FormLabel, FormControl, FormMessage, Textarea, Form } from "@/components/ui/shadcn";
import { useForm } from "react-hook-form";
import { createTestcaseSchema, CreateTestcaseSchema } from "../../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequiredInputLabel } from "@/features/Admins/components";
import { Button } from "@/components/ui";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

interface ProblemTestcaseFormProps {
  onSave: (data: CreateTestcaseSchema) => void;
  testcaseId?: string;
  testcaseActionType?: "create" | "view" | "edit";
}

export const ProblemTestcaseForm = ({
  onSave,
  testcaseId,
  testcaseActionType = "create"
}: ProblemTestcaseFormProps) => {
  const testcaseList = useSelector((state: RootState) => state.createProblem.problemTestcases);
  const selectedTestcase = testcaseList.find((testcase: CreateTestcaseSchema) => testcase.testcaseId === testcaseId);

  const defaultValues: CreateTestcaseSchema = useMemo(() => {
    if (testcaseActionType === "create") {
      return {
        testcaseId: "",
        testcaseInput: "",
        expectedOutput: "",
        testcaseOrder: 0
      };
    } else if (testcaseActionType === "view" || (testcaseActionType === "edit" && selectedTestcase)) {
      console.log("selectedTestcase", selectedTestcase);
      return {
        testcaseId: selectedTestcase?.testcaseId || "",
        testcaseInput: selectedTestcase?.testcaseInput || "",
        expectedOutput: selectedTestcase?.expectedOutput || "",
        testcaseOrder: selectedTestcase?.testcaseOrder || 0
      };
    } else {
      return {
        testcaseId: "",
        testcaseInput: "",
        expectedOutput: "",
        testcaseOrder: 0
      };
    }
  }, [testcaseActionType, selectedTestcase]);

  const form = useForm<CreateTestcaseSchema>({
    resolver: zodResolver(createTestcaseSchema),
    defaultValues: defaultValues
  });

  const handleSubmit = (data: CreateTestcaseSchema) => {
    onSave({
      ...data,
      testcaseId: data.testcaseId || `testcase-${Date.now()}` // For testing: use a HARD-coded ID
    });
    form.reset();
  };

  // inside your component
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.log("form data:", form.getValues());
          console.log("Validation errors:", errors);
        })}
        className="flex flex-col mx-auto gap-8 max-w-[1000px]"
      >
        <FormField
          control={form.control}
          name="testcaseInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Input" />
              </FormLabel>
              <FormControl>
                <Textarea className="h-32 max-h-48" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedOutput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Expected output" />
              </FormLabel>
              <FormControl>
                <Textarea className="h-24 max-h-48" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="button" className="mr-2" variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button type="submit" className="bg-appPrimary hover:bg-appPrimary/80">
            Save Test Case
          </Button>
        </div>
      </form>
    </Form>
  );
};
