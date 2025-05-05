import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Switch,
  FormMessage,
  Form,
  FormDescription,
  Card
} from "@/components/ui/shadcn";
import { z } from "zod";
import { createCourseSchema } from "../../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useCourseWizardStep } from "../../hooks";
import { CourseWizardButtons, PreviewCourse, RequiredInputLabel } from "../../components/CreateCourse";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { setCreateCourse } from "@/redux/createCourse/createCourseSlice";

const coursePreviewSchema = createCourseSchema.pick({
  courseMakeAvailable: true
});

type CoursePreviewSchema = z.infer<typeof coursePreviewSchema>;

export const CoursePreviewPage = () => {
  // const { goToNextStep } = useCourseWizardStep();
  const formData = useSelector((state: RootState) => state.createCourse); // For testing purposes
  const dispatch = useDispatch();

  const form = useForm<CoursePreviewSchema>({
    resolver: zodResolver(coursePreviewSchema),
    defaultValues: {
      courseMakeAvailable: formData.courseMakeAvailable || false
    }
  });

  const onSubmit = (data: CoursePreviewSchema) => {
    // Call goToNextStep after successful form submission
    // goToNextStep();
    console.log("Complete form data:", { ...formData, ...data });
    dispatch(setCreateCourse(data));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mx-auto gap-8 max-w-[1000px]">
        <FormField
          control={form.control}
          name="courseMakeAvailable"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <FormLabel>
                  <RequiredInputLabel label="Available" />
                </FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage />
              <FormDescription>
                Note: By making the course available, students will have access to this course.
              </FormDescription>
            </FormItem>
          )}
        />

        <Card className="p-4 border border-gray-300 rounded-lg">
          <PreviewCourse />
        </Card>

        <CourseWizardButtons isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};
