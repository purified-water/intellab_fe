import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema } from "../../schemas";
import { CourseWizardButtons, RequiredInputLabel, CourseCategoriesSelect } from "../../components/CreateCourse";
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
import { useDispatch, useSelector } from "react-redux";
import { setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { RootState } from "@/redux/rootReducer";

const courseGeneralSchema = createCourseSchema.pick({
  courseName: true,
  courseDescription: true,
  courseCategories: true,
  courseLevel: true,
  courseThumbnail: true
});

type CourseGeneralSchema = z.infer<typeof courseGeneralSchema>;

export const CourseGeneralPage = () => {
  const { goToNextStep } = useCourseWizardStep();
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.createCourse);
  // Initialize form with Zod validation
  const form = useForm<CourseGeneralSchema>({
    resolver: zodResolver(courseGeneralSchema),
    defaultValues: {
      courseName: formData.courseName || "",
      courseDescription: formData.courseDescription || "",
      courseCategories: formData.courseCategories || [],
      courseLevel: formData.courseLevel || "beginner",
      courseThumbnail: formData.courseThumbnail || ""
    }
  });

  const onSubmit = (data: CourseGeneralSchema) => {
    dispatch(setCreateCourse(data));
    // Call goToNextStep after successful form submission
    goToNextStep();
  };

  console.log("Form data:", form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col mx-auto gap-8 max-w-[1000px]">
        <FormField
          control={form.control}
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Course Name" />
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
          name="courseDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Course Description" />
              </FormLabel>
              <FormControl>
                <Textarea className="h-24 max-h-48" {...field} />
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
                <CourseCategoriesSelect value={field.value} onChange={field.onChange} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advance">Advanced</SelectItem>
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

        <CourseWizardButtons isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};
