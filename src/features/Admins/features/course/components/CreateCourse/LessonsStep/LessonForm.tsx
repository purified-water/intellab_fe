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

interface LessonFormProps {
  onSave: (data: CreateLessonSchema) => void;
  lessonId?: string;
  lessonActionType?: "create" | "view" | "edit";
}

export const LessonForm = ({ onSave, lessonId, lessonActionType = "create" }: LessonFormProps) => {
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

  useEffect(() => {
    if (lessonQuizFromServer) {
      dispatch(
        updateLessonQuiz({
          lessonId: selectedLesson?.lessonId || "",
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
      return {
        ...selectedLesson,
        // Ensure lessonQuiz has a default structure if it's undefined
        lessonQuiz: lessonQuizFromServer || selectedLesson.lessonQuiz || DEFAULT_QUIZ
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
  }, [lessonActionType, selectedLesson, lessonInCreation.lessonId]);

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
    if (lessonActionType === "view") {
      form.reset();
      goToStep(1);
      return;
    }
    form.reset();
    goToStep(1);
  };

  const { hasQuiz, hasProblem } = form.watch();

  // Modified onSubmit handler to process form data before submission
  const handleSubmit = async (data: CreateLessonSchema) => {
    // If already submitting, prevent duplicate submissions
    if (isSubmitting) return;

    try {
      // Set loading state to prevent multiple submissions
      setIsSubmitting(true);

      // If hasQuiz is false, set lessonQuiz to undefined for API calls
      // but keep the form state with DEFAULT_QUIZ for the component
      const submissionData = {
        ...data,
        lessonQuiz: data.hasQuiz ? data.lessonQuiz : undefined
      };

      // Call the onSave function and await for it to complete
      await onSave(submissionData);

      // If this is an edit, update the Redux state with the edited lesson data
      if (lessonActionType === "edit" && lessonId) {
        const updatedLesson = {
          ...data,
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
              <FormItem>
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
