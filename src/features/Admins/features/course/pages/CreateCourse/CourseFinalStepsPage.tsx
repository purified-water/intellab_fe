import { z } from "zod";
import { createCourseSchema } from "../../schemas";
import { AddCertificateTemplate, AddSummaryMarkdown, CourseWizardButtons } from "../../components/CreateCourse";
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
import { useCreateFinalStep, useEditingCourse } from "../../hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCourse, setCurrentCreationStep } from "@/redux/createCourse/createCourseSlice";
import { RootState } from "@/redux/rootReducer";
import { CreateCourseFinalStepPayload } from "@/types";
// StepGuard
import { StepGuard } from "../../components/StepGuard";
import { isLessonsStepValid } from "../../utils/courseStepGuard";
import { RequiredInputLabel } from "@/features/Admins/components";
import { CREATE_COURSE_STEP_NUMBERS } from "../../constants";
import { useEffect } from "react";

const courseFinalStepsSchema = createCourseSchema.pick({
  coursePrice: true,
  courseSummary: true,
  courseCertificate: true
});

type CourseFinalStepsSchema = z.infer<typeof courseFinalStepsSchema>;

export const CourseFinalStepsPage = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.createCourse);
  const courseId = useSelector((state: RootState) => state.createCourse.courseId);

  const createCourse = useSelector((state: RootState) => state.createCourse);

  const { isEditingCourse } = useEditingCourse();

  const createCourseFinalStep = useCreateFinalStep(courseId, isEditingCourse ? createCourse.currentCreationStep : 0);

  useEffect(() => {
    if (createCourse.currentCreationStep < CREATE_COURSE_STEP_NUMBERS.FINAL) {
      dispatch(setCurrentCreationStep(CREATE_COURSE_STEP_NUMBERS.FINAL));
    }
  }, []);

  // Initialize form with Zod validation
  const form = useForm<CourseFinalStepsSchema>({
    resolver: zodResolver(courseFinalStepsSchema),
    defaultValues: {
      coursePrice: formData.coursePrice || 0,
      courseSummary: formData.courseSummary || "",
      courseCertificate: formData.courseCertificate || 1
    }
  });

  const onSubmit = (data: CourseFinalStepsSchema) => {
    const formatPayload: CreateCourseFinalStepPayload = {
      price: data.coursePrice || 0,
      unitPrice: "VND",
      templateCode: data.courseCertificate,
      aiSummaryContent: data.courseSummary
    };

    dispatch(setCreateCourse(data));

    if (
      (isEditingCourse &&
        createCourse.currentCreationStep >= CREATE_COURSE_STEP_NUMBERS.FINAL &&
        createCourse.courseSummary != undefined &&
        createCourse.courseCertificate != undefined) ||
      createCourse.currentCreationStep > CREATE_COURSE_STEP_NUMBERS.FINAL
    ) {
      createCourseFinalStep.EditFinalStep.mutateAsync(formatPayload);
    } else {
      createCourseFinalStep.submitFinalStep.mutateAsync(formatPayload);
    }
  };

  let redirectUrl = "/admin/courses/create/general";
  if (isEditingCourse) {
    redirectUrl += "?editCourse=true";
  }

  const handleCheckValid = (state: RootState) => {
    // When editing draft course, user might be redirect to this page.
    // The process is too fast, hence the lesson list is not updated yet (api is still fetching) leading to wrong validation.
    // So we need to skip the validation for this case
    if (isEditingCourse && createCourse.currentCreationStep >= CREATE_COURSE_STEP_NUMBERS.FINAL) {
      return true;
    } else {
      return isLessonsStepValid(state);
    }
  };

  return (
    <StepGuard checkValid={handleCheckValid} redirectTo={redirectUrl}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (error) => {
            console.log("Error: ", error);
          })}
          className="flex flex-col mx-auto gap-8 max-w-[1000px]"
        >
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

          {/* Choose certificate template here */}
          <FormField
            control={form.control}
            name="courseCertificate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Certificate Template" />
                </FormLabel>
                <FormControl>
                  <AddCertificateTemplate value={field.value} onChange={(val) => field.onChange(Number(val))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CourseWizardButtons isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </StepGuard>
  );
};
