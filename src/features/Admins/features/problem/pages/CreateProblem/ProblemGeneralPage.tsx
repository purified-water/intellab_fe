import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Form,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  FormDescription
} from "@/components/ui/shadcn";
import { z } from "zod";
import { Spinner } from "@/components/ui";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { RequiredInputLabel } from "@/features/Admins/components";
import { createProblemSchema } from "../../schemas";
import { CourseCategoriesSelect } from "../../../course/components/CreateCourse";
import { ProblemWizardButtons } from "../../components/CreateProblem";
import { useDispatch, useSelector } from "react-redux";
import { setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { useCourseCategories } from "../../../course/hooks";
import { useProblemWizardStep, useEditingProblem } from "../../hooks";
import { RootState } from "@/redux/rootReducer";
import { adminProblemAPI } from "@/features/Admins/api";
import { CREATE_PROBLEM_STEP_NUMBERS } from "../../constants";
import { SEO } from "@/components/SEO";

const problemGeneralSchema = createProblemSchema.pick({
  problemId: true,
  problemName: true,
  problemCategories: true,
  problemLevel: true,
  problemScore: true,
  problemIsPublished: true
});

type ProblemGeneralSchema = z.infer<typeof problemGeneralSchema>;

export const ProblemGeneralPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { data: categories, isLoading: isLoadingCategories } = useCourseCategories(); // Use get course category for testing first
  const formData = useSelector((state: RootState) => state.createProblem);
  const { goToNextStep } = useProblemWizardStep();
  const { isEditingProblem } = useEditingProblem();

  // Initialize form with Zod validation
  const form = useForm<ProblemGeneralSchema>({
    resolver: zodResolver(problemGeneralSchema),
    defaultValues: {
      problemId: formData.problemId || "",
      problemName: formData.problemName || "",
      problemCategories: formData.problemCategories || [],
      problemLevel: formData.problemLevel || "Easy",
      problemScore: formData.problemScore || 1,
      problemIsPublished: formData.problemIsPublished || false
    }
  });

  const onSubmit = async (data: ProblemGeneralSchema) => {
    const editingProblem =
      (isEditingProblem && formData.currentCreationStep >= CREATE_PROBLEM_STEP_NUMBERS.GENERAL) ||
      formData.currentCreationStep > CREATE_PROBLEM_STEP_NUMBERS.GENERAL;

    // console.log("--> Editing in Problem General Page:", editingProblem);

    await adminProblemAPI.createProblemGeneralStep({
      body: {
        problemName: data.problemName,
        categories: data.problemCategories.map((category) => category.categoryId),
        problemLevel: data.problemLevel.toLowerCase(),
        score: data.problemScore,
        isPublished: data.problemIsPublished,
        problemId: editingProblem ? formData.problemId : undefined
      },
      onSuccess: async (problem) => {
        dispatch(
          setCreateProblem({
            ...data,
            problemId: editingProblem ? formData.problemId : problem.problemId
          })
        );
        goToNextStep();
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  const handleSubmitError = (errors: unknown) => {
    console.error("Form submission errors:", errors);
    console.log("Form data:", form.getValues());
    showToastError({ toast: toast.toast, message: "Please fix the errors in the form" });
  };

  return (
    <Form {...form}>
      <SEO title="Problem General | Intellab" />
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => handleSubmitError(errors))}
        className="flex flex-col mx-auto gap-8 max-w-[1000px]"
      >
        <FormField
          control={form.control}
          name="problemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Problem Name" />
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
          name="problemCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Categories" />
              </FormLabel>
              <FormControl>
                {isLoadingCategories ? (
                  <Spinner className="w-10 h-10 mx-auto" loading={isLoadingCategories} />
                ) : (
                  <CourseCategoriesSelect value={field.value} onChange={field.onChange} categories={categories} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="problemLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Level" />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="problemScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Score" />
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormDescription>
                Note: Easy should be from 1 to 5, Medium from 6 to 10, Hard from 11 to 20.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="problemIsPublished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Free" />
              </FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Note: If NOT free then users need to buy premium plan to unlock the problem.
              </FormDescription>
            </FormItem>
          )}
        />

        <ProblemWizardButtons isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};
