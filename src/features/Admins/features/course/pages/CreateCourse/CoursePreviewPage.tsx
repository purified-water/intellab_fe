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
import { useCreateLesson, useEditingCourse, useUpdatePreviewStep } from "../../hooks";
import { CourseWizardButtons, PreviewCourse } from "../../components/CreateCourse";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { setCreateCourse, setCurrentCreationStep } from "@/redux/createCourse/createCourseSlice";
import { CreateCoursePreviewStepPayload } from "@/types";
// StepGuard
import { StepGuard } from "../../components/StepGuard";
import { isFinalStepValid } from "../../utils/courseStepGuard";
import { useEffect } from "react";
import { RequiredInputLabel } from "@/features/Admins/components";
import { CREATE_COURSE_STEP_NUMBERS } from "../../constants";

const coursePreviewSchema = createCourseSchema.pick({
  courseMakeAvailable: true
});

type CoursePreviewSchema = z.infer<typeof coursePreviewSchema>;

export const CoursePreviewPage = () => {
  const courseData = useSelector((state: RootState) => state.createCourse);
  const dispatch = useDispatch();
  const createCoursePreview = useUpdatePreviewStep(courseData.courseId);
  const createCourseLesson = useCreateLesson(courseData.courseId);
  const { data: lessonsFromServer = [] } = createCourseLesson.getLessonList;

  const { isEditingCourse } = useEditingCourse();

  const createCourse = useSelector((state: RootState) => state.createCourse);

  useEffect(() => {
    if (createCourse.currentCreationStep < CREATE_COURSE_STEP_NUMBERS.PREVIEW) {
      dispatch(setCurrentCreationStep(CREATE_COURSE_STEP_NUMBERS.PREVIEW));
    }
  }, []);

  // In case the lessons order is changed but redux hasnt, we need to update the courseLessons in redux
  useEffect(() => {
    if (lessonsFromServer.length > 0) {
      dispatch(setCreateCourse({ courseLessons: lessonsFromServer }));
    }
  }, [lessonsFromServer, courseData.courseLessons.length, dispatch]);

  const form = useForm<CoursePreviewSchema>({
    resolver: zodResolver(coursePreviewSchema),
    defaultValues: {
      courseMakeAvailable: courseData.courseMakeAvailable || false
    }
  });

  const onSubmit = (data: CoursePreviewSchema) => {
    dispatch(setCreateCourse(data));
    const formatPayload: CreateCoursePreviewStepPayload = {
      availableStatus: data.courseMakeAvailable
    };
    createCoursePreview.mutateAsync(formatPayload);
  };

  let redirectUrl = "/admin/courses/create/final-steps";
  if (isEditingCourse) {
    redirectUrl += "?editCourse=true";
  }

  return (
    <StepGuard checkValid={isFinalStepValid} redirectTo={redirectUrl}>
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

          <Card className="p-4 border rounded-lg border-gray4">
            <PreviewCourse />
          </Card>

          <CourseWizardButtons isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </StepGuard>
  );
};
