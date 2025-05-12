import { useForm } from "react-hook-form";
import { createCourseSchema } from "../../schemas";
import { CourseWizardButtons, RequiredInputLabel, CourseCategoriesSelect } from "../../components/ViewCourse";
import { useCourseWizardStep } from "../../hooks";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Textarea,
  Form,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/shadcn";
import { z } from "zod";
import { ImageUploadForm } from "@/components/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

const _courseGeneralSchema = createCourseSchema.pick({
  courseName: true,
  courseDescription: true,
  courseCategories: true,
  courseLevel: true,
  courseThumbnail: true
});

type ViewCourseGeneralSchema = z.infer<typeof _courseGeneralSchema>;

export const ViewCourseGeneralPage = () => {
  const { goToNextStep } = useCourseWizardStep();
  const viewingCourse = useSelector((state: RootState) => state.course.editingCourse);

  const form = useForm<ViewCourseGeneralSchema>({
    defaultValues: {
      courseName: viewingCourse!.courseName,
      courseDescription: viewingCourse!.description,
      courseCategories: viewingCourse!.categories
      //courseLevel: viewingCourse!.level,
      //courseThumbnail: viewingCourse!.courseImage
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
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Course Name" />
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Course Description" />
                </FormLabel>
                <FormControl>
                  <Textarea className="h-24 max-h-48" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseCategories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Categories" />
                </FormLabel>
                <FormControl>
                  <CourseCategoriesSelect value={field.value} onChange={field.onChange} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Level" />
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advance">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseThumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Thumbnail</FormLabel>
                <FormControl>
                  <ImageUploadForm value={field.value ?? null} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <CourseWizardButtons ignoreSubmit isSubmitting={form.formState.isSubmitting} type="view" />
      </Form>
    </div>
  );
};
