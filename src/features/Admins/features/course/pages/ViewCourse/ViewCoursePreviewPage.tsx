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
// import { useCourseWizardStep } from "../../hooks";
import { CourseWizardButtons, PreviewCourse, RequiredInputLabel } from "../../components/ViewCourse";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";

const _coursePreviewSchema = createCourseSchema.pick({
  courseMakeAvailable: true
});

type ViewCoursePreviewSchema = z.infer<typeof _coursePreviewSchema>;

export const ViewCoursePreviewPage = () => {
  const viewingCourse = useSelector((state: RootState) => state.course.editingCourse);
  const navigate = useNavigate();

  const form = useForm<ViewCoursePreviewSchema>({
    defaultValues: {
      courseMakeAvailable: viewingCourse!.isAvailable
    }
  });

  const onFinish = () => {
    navigate("/admin/courses");
  };

  return (
    <Form {...form}>
      <div className="flex flex-col mx-auto gap-8 max-w-[1000px]">
        <form className="flex flex-col gap-8">
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
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={true} />
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
            <PreviewCourse course={viewingCourse!} />
          </Card>
        </form>

        <CourseWizardButtons isSubmitting={form.formState.isSubmitting} type="view" onCallback={onFinish} />
      </div>
    </Form>
  );
};
