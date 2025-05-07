import { z } from "zod";
import { createCourseSchema } from "../../schemas";
import {
  AddCertificateTemplate,
  AddSummaryMarkdown,
  CourseWizardButtons,
  RequiredInputLabel
} from "../../components/ViewCourse";
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

const _courseFinalStepsSchema = createCourseSchema.pick({
  coursePrice: true,
  courseSummary: true,
  courseCertificate: true
});

type ViewCourseFinalStepsSchema = z.infer<typeof _courseFinalStepsSchema>;

export const ViewCourseFinalStepsPage = () => {
  const { goToNextStep } = useCourseWizardStep();

  const viewingCourse = useSelector((state: RootState) => state.course.editingCourse);

  const form = useForm<ViewCourseFinalStepsSchema>({
    defaultValues: {
      coursePrice: viewingCourse!.price,
      courseSummary: "Summary placeholder",
      courseCertificate: {
        template: "Certificate template placeholder"
      }
    }
  });

  const onSubmit = () => {
    goToNextStep("view");
  };

  return (
    <div className="flex flex-col mx-auto gap-8 max-w-[1000px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <FormField
            control={form.control}
            name="coursePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Course Price" />
                </FormLabel>
                <FormControl>
                  <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} disabled />
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
                <AddSummaryMarkdown value={field.value} onChange={field.onChange} disabled />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Choose certificate template here */}
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
        </form>
      </Form>
      <CourseWizardButtons ignoreSubmit isSubmitting={form.formState.isSubmitting} type="view" />
    </div>
  );
};
