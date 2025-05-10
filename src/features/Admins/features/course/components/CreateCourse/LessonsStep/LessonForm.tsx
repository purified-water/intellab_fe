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
import { RequiredInputLabel } from "../RequiredInputLabel";
import { AddLessonMarkdown } from "./AddLessonMarkdown";
import { AddQuiz } from "./AddQuiz";
import { AddProblem } from "./AddProblem";
import { DEFAULT_QUIZ } from "../../../constants";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { updateLessonQuiz } from "@/redux/createCourse/createCourseSlice";

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
  // console.log("lessonQuiz from BE", lessonQuizFromServer);

  useEffect(() => {
    if (lessonQuizFromServer) {
      console.log("lessonQuiz after reformat", lessonQuizFromServer);
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
  const handleSubmit = (data: CreateLessonSchema) => {
    // If hasQuiz is false, set lessonQuiz to undefined for API calls
    // but keep the form state with DEFAULT_QUIZ for the component
    const submissionData = {
      ...data,
      lessonQuiz: data.hasQuiz ? data.lessonQuiz : undefined
    };

    onSave(submissionData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.log("form data:", form.getValues());
          console.log("Validation errors:", errors);
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
                <AddLessonMarkdown value={field.value} onChange={field.onChange} readOnly={isReadOnly} />
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
          <Button type="submit" className="bg-appPrimary hover:bg-appPrimary/80" disabled={isReadOnly}>
            Save Lesson
          </Button>
        </div>
      </form>
    </Form>
  );
};
