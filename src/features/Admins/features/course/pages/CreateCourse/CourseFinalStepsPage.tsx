import { z } from "zod";
import { createCourseSchema } from "../../schemas";
import {
  AddCertificateTemplate,
  AddSummaryMarkdown,
  CourseWizardButtons,
  RequiredInputLabel
} from "../../components/CreateCourse";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Form,
  FormDescription
} from "@/components/ui/shadcn";
import { useCourseWizardStep } from "../../hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { RootState } from "@/redux/rootReducer";

const courseFinalStepsSchema = createCourseSchema.pick({
  coursePrice: true,
  courseSummary: true,
  courseCertificate: true
});

type CourseFinalStepsSchema = z.infer<typeof courseFinalStepsSchema>;

export const CourseFinalStepsPage = () => {
  const { goToNextStep } = useCourseWizardStep();
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.createCourse);

  // Initialize form with Zod validation
  const form = useForm<CourseFinalStepsSchema>({
    resolver: zodResolver(courseFinalStepsSchema),
    defaultValues: {
      coursePrice: formData.coursePrice || 0,
      courseSummary: formData.courseSummary || "",
      courseCertificate: {
        template: formData.courseCertificate?.template || ""
      }
    }
  });

  const onSubmit = (data: CourseFinalStepsSchema) => {
    console.log("Form data:", data);
    dispatch(setCreateCourse(data));
    // Call goToNextStep after successful form submission
    goToNextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mx-auto gap-8 max-w-[1000px]">
        <FormField
          control={form.control}
          name="coursePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Course Price" />
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
              <FormDescription>Note: Price is marked in VND (Vietnamese Dong).</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseSummary"
          render={({ field }) => (
            <FormItem>
              <AddSummaryMarkdown value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Chooose certificate template here */}
        <FormField
          control={form.control}
          name="courseCertificate.template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Certificate Template" />
              </FormLabel>
              <FormControl>
                <AddCertificateTemplate value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CourseWizardButtons isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};
