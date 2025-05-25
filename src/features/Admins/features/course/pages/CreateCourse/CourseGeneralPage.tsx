import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema } from "../../schemas";
import { CourseWizardButtons, CourseCategoriesSelect } from "../../components/CreateCourse";
import {
  useChangeCourseImageLink,
  useCourseCategories,
  useCourseWizardStep,
  useEditCourseGeneral,
  useEditingCourse,
  useUploadCourseImage,
  useUploadImage
} from "../../hooks";
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
import { ImageUploadForm, Spinner } from "@/components/ui";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { RootState } from "@/redux/rootReducer";
import { useCreateCourseGeneral } from "../../hooks";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { CreateCourseGeneralStepPayload } from "@/types";
import { RequiredInputLabel } from "@/features/Admins/components";
import { CREATE_COURSE_STEP_NUMBERS } from "../../constants";

const courseGeneralSchema = createCourseSchema.pick({
  courseId: true,
  courseName: true,
  courseDescription: true,
  courseCategories: true,
  courseLevel: true,
  courseThumbnail: true
});

type CourseGeneralSchema = z.infer<typeof courseGeneralSchema>;

export const CourseGeneralPage = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.createCourse);
  const toast = useToast();

  const { data: categories, isLoading: loadingCategories } = useCourseCategories();
  const createCourse = useCreateCourseGeneral();
  const editCoursse = useEditCourseGeneral();
  const uploadThumbnail = useUploadCourseImage();
  const changeCourseImageLink = useChangeCourseImageLink();
  const uploadImage = useUploadImage();
  const { goToNextStep } = useCourseWizardStep();
  const { isEditingCourse } = useEditingCourse();

  // Initialize form with Zod validation
  const form = useForm<CourseGeneralSchema>({
    resolver: zodResolver(courseGeneralSchema),
    defaultValues: {
      courseId: formData.courseId || "",
      courseName: formData.courseName || "",
      courseDescription: formData.courseDescription || "",
      courseCategories: formData.courseCategories || [],
      courseLevel: formData.courseLevel || "Beginner",
      courseThumbnail: formData.courseThumbnail || null
    }
  });

  const onSubmit = async (data: CourseGeneralSchema) => {
    dispatch(setCreateCourse(data)); // Set data to redux store

    const formatPayload: CreateCourseGeneralStepPayload = {
      courseName: data.courseName,
      description: data.courseDescription,
      level: data.courseLevel,
      categoryIds: data.courseCategories.map((category) => category.categoryId.toString())
    };

    if (
      (isEditingCourse && formData.currentCreationStep >= CREATE_COURSE_STEP_NUMBERS.GENERAL) ||
      formData.currentCreationStep > CREATE_COURSE_STEP_NUMBERS.GENERAL
    ) {
      try {
        if (data.courseThumbnail != formData.courseThumbnail) {
          const imageLink = await uploadImage.mutateAsync({ file: data.courseThumbnail! });
          await changeCourseImageLink.mutateAsync({ courseId: data.courseId, imageLink: imageLink });
        }
        const course = await editCoursse.mutateAsync({ courseId: formData.courseId!, payload: formatPayload });
        dispatch(setCreateCourse({ courseId: course.courseId }));
        goToNextStep();
      } catch (error) {
        console.error("Error in updating course:", error);
        showToastError({ toast: toast.toast, message: "Error editing general information" });
      }
    } else {
      try {
        const course = await createCourse.mutateAsync(formatPayload);
        dispatch(setCreateCourse({ courseId: course.courseId }));
        if (data.courseThumbnail) {
          uploadThumbnail.mutateAsync({
            courseId: course.courseId,
            file: data.courseThumbnail!
          });
        }
        goToNextStep();
      } catch (error) {
        console.error("Error in creating course:", error);
        showToastError({ toast: toast.toast, message: "Error uploading general information" });
      }
    }
  };

  return (
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
                {loadingCategories ? (
                  <Spinner className="w-10 h-10 mx-auto" loading={loadingCategories} />
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
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
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
