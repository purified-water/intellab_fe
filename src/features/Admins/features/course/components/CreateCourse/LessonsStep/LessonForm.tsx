import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Textarea,
  Form,
  Switch
} from "@/components/ui/shadcn";
import { useForm } from "react-hook-form";
import { CreateLessonSchema, createLessonSchema } from "../../../schemas";
import { useCourseWizardStep, useCreateLesson } from "../../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequiredInputLabel } from "@/features/Admins/components";
import { AddMarkdownContent } from "@/features/Admins/components";
import { AddQuiz } from "./AddQuiz";
import { AddProblem } from "./AddProblem";
import { DEFAULT_QUIZ } from "../../../constants";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { setCreateCourse, updateLessonQuiz } from "@/redux/createCourse/createCourseSlice";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
interface LessonFormProps {
  onSave: (data: CreateLessonSchema) => void;
  onCancel: () => void;
  lessonId?: string;
  lessonActionType?: "create" | "view" | "edit";
}

export const LessonForm = ({ onSave, onCancel, lessonId, lessonActionType = "create" }: LessonFormProps) => {
  const courseData = useSelector((state: RootState) => state.createCourse);
  const lessonInCreation = useSelector((state: RootState) => state.createLesson); // For creating a new lesson
  const selectedLesson = courseData.courseLessons.find((lesson: CreateLessonSchema) => lesson.lessonId === lessonId); // For viewing/editing only
  const { goToStep } = useCourseWizardStep();
  const isReadOnly = lessonActionType === "view";
  const createCourseLesson = useCreateLesson(courseData.courseId, selectedLesson?.lessonId);
  const { data: lessonQuizFromServer } = createCourseLesson.getQuiz;
  const dispatch = useDispatch();
  // Track if the form is currently submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (lessonQuizFromServer) {
      dispatch(
        updateLessonQuiz({
          lessonId: selectedLesson?.lessonId || "",
          isQuizVisible: lessonQuizFromServer.isQuizVisible,
          lessonQuiz: lessonQuizFromServer
        })
      );
    }
  }, [lessonQuizFromServer, lessonId]);

  // defaultValues for the form based on the action type
  const defaultValues: CreateLessonSchema = useMemo(() => {
    if (lessonActionType === "create" && lessonInCreation.lessonId) {
      return {
        lessonId: lessonInCreation.lessonId,
        lessonName: "",
        lessonDescription: "",
        lessonContent: "",
        hasQuiz: false,
        lessonQuiz: DEFAULT_QUIZ, // Always provide a default structure
        hasProblem: false,
        lessonProblemId: "",
        lessonOrder: lessonInCreation.lessonOrder
      };
    }

    // For editing or viewing an existing lesson
    if (selectedLesson) {
      // Only provide quiz data if hasQuiz is true
      return {
        ...selectedLesson,
        // Only use quiz data if hasQuiz is true, otherwise set to undefined
        hasQuiz: !!lessonQuizFromServer?.isQuizVisible,
        lessonQuiz: lessonQuizFromServer?.isQuizVisible
          ? lessonQuizFromServer || selectedLesson.lessonQuiz || DEFAULT_QUIZ
          : undefined
      };
    }

    // Default empty form
    return {
      lessonId: "",
      lessonName: "",
      lessonDescription: "",
      lessonContent: "",
      hasQuiz: false,
      lessonQuiz: DEFAULT_QUIZ,
      hasProblem: false,
      lessonProblemId: "",
      lessonOrder: 0
    };
  }, [lessonActionType, selectedLesson, lessonInCreation.lessonId, lessonQuizFromServer]);

  // Initialize form with Zod validation
  const form = useForm<CreateLessonSchema>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (selectedLesson || (lessonActionType === "create" && lessonInCreation.lessonId)) {
      form.reset(defaultValues);
    }
  }, [defaultValues, selectedLesson, lessonActionType, lessonInCreation.lessonId]);

  const handleCancel = () => {
    form.reset();
    onCancel();
    goToStep(1);
  };

  const { hasQuiz, hasProblem } = form.watch();

  // Watch for hasQuiz changes and update the form state accordingly
  useEffect(() => {
    // When hasQuiz is turned off, set lessonQuiz to undefined to avoid validation errors
    if (!hasQuiz) {
      form.setValue("lessonQuiz", undefined);
    } else {
      // When hasQuiz is turned on, determine what quiz data to use
      let quizDataToUse = DEFAULT_QUIZ;
      console.log("lesson from server", lessonQuizFromServer);
      // Priority: 1. Quiz from server, 2. Quiz from selected lesson, 3. Default quiz
      if (lessonQuizFromServer) {
        quizDataToUse = lessonQuizFromServer;
      } else if (selectedLesson?.lessonQuiz) {
        quizDataToUse = selectedLesson.lessonQuiz;
      }

      // Always set the quiz data when toggling on
      form.setValue("lessonQuiz", quizDataToUse);
    }
  }, [hasQuiz, form, lessonQuizFromServer, selectedLesson?.lessonQuiz]);

  // Modified onSubmit handler to process form data before submission
  const handleSubmit = async (data: CreateLessonSchema) => {
    // If already submitting, prevent duplicate submissions
    if (isSubmitting) return;

    try {
      // Set loading state to prevent multiple submissions
      setIsSubmitting(true);

      // Create a clean submission data object
      let submissionData = { ...data };

      // If hasQuiz is false, explicitly set lessonQuiz to undefined
      // This ensures the validation will skip quiz validation
      if (!submissionData.hasQuiz) {
        submissionData = {
          ...submissionData,
          lessonQuiz: undefined
        };
      }

      // Call the onSave function and await for it to complete
      await onSave(submissionData);

      // If this is an edit, update the Redux state with the edited lesson data
      if (lessonActionType === "edit" && lessonId) {
        const updatedLesson = {
          ...submissionData, // Use submissionData to include the lessonQuiz modification
          lessonId: lessonId
        };

        // Find the lesson index in the courseLessons array
        const lessonIndex = courseData.courseLessons.findIndex(
          (lesson: CreateLessonSchema) => lesson.lessonId === lessonId
        );

        if (lessonIndex !== -1) {
          // Create a new array with the updated lesson
          const updatedLessons = [...courseData.courseLessons];
          updatedLessons[lessonIndex] = updatedLesson;

          // Update the Redux store
          dispatch(setCreateCourse({ courseLessons: updatedLessons }));
        }
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
    } finally {
      // Reset loading state
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.error("Form submission errors:", errors);

          // Force reset lessonQuiz if hasQuiz is false but we still have errors
          if (!form.getValues("hasQuiz") && errors.lessonQuiz) {
            console.log("Detected quiz validation errors when hasQuiz is false, resetting quiz data");
            form.setValue("lessonQuiz", undefined, { shouldValidate: true });
            return;
          }

          showToastError({ toast: toast.toast, message: "Please fix the errors in the form." });
        })}
        className="flex flex-col mx-auto gap-8 max-w-[1000px]"
      >
        <FormField
          control={form.control}
          name="lessonName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Lesson Name" />
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lessonDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Lesson Description" />
              </FormLabel>
              <FormControl>
                <Textarea className="h-24 max-h-48" {...field} disabled={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lessonContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Lesson Content" />
              </FormLabel>
              <FormControl>
                <AddMarkdownContent
                  value={field.value}
                  onChange={field.onChange}
                  readOnly={isReadOnly}
                  allowImage={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasQuiz"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Add Quiz</h2>
                  <Switch
                    className="checked:bg-appPrimary"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isReadOnly}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditionally render the quiz component, but always keep the field in the form */}
        {hasQuiz && (
          <FormField
            control={form.control}
            name="lessonQuiz"
            render={() => (
              <FormItem className="max-h-[800px] overflow-y-auto">
                <FormLabel>
                  <RequiredInputLabel label="Lesson Quiz" />
                </FormLabel>
                <FormControl>
                  <AddQuiz readOnly={isReadOnly} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="hasProblem"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Add Problem</h2>
                  <Switch
                    className="checked:bg-appPrimary"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isReadOnly}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasProblem && (
          <FormField
            control={form.control}
            name="lessonProblemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredInputLabel label="Lesson Problem" />
                </FormLabel>
                <FormControl>
                  <AddProblem value={field.value || ""} onChange={field.onChange} readOnly={isReadOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button type="button" className="mr-2" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-appPrimary hover:bg-appPrimary/80" disabled={isReadOnly || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Lesson"}{" "}
          </Button>
        </div>
      </form>
    </Form>
  );
};
