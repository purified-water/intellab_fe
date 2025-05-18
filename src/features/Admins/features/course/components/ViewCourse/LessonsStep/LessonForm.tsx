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
import { useCourseWizardStep } from "../../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequiredInputLabel } from "../RequiredInputLabel";
import { AddMarkdownContent } from "@/features/Admins/components";
import { AddQuiz } from "./AddQuiz";
import { AddProblem } from "./AddProblem";
import { DEFAULT_QUIZ } from "../../../constants";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

interface LessonFormProps {
  onSave: (data: CreateLessonSchema) => void;
  lessonId?: string;
  lessonActionType?: "create" | "view" | "edit";
}

export const LessonForm = ({ onSave, lessonId, lessonActionType = "create" }: LessonFormProps) => {
  const lessonList = useSelector((state: RootState) => state.createCourse.courseLessons);
  const selectedLesson = lessonList.find((lesson) => lesson.lessonId === lessonId);
  const { goToStep } = useCourseWizardStep();
  const isReadOnly = lessonActionType === "view";

  // Use memo to only change when lessonActionType or selectedLesson changes
  const defaultValues = useMemo(() => {
    if (lessonActionType === "create") {
      return {
        lessonId: "",
        lessonName: "",
        lessonDescription: "",
        lessonContent: "",
        hasQuiz: false,
        lessonQuiz: DEFAULT_QUIZ,
        hasProblem: false,
        lessonProblemId: ""
      };
    }
    return selectedLesson || {};
  }, [lessonActionType, selectedLesson]);

  // Initialize form with Zod validation
  const form = useForm<CreateLessonSchema>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: defaultValues
  });

  const handleCancel = () => {
    if (lessonActionType === "view") {
      goToStep(1);
      return;
    }
    form.reset();
    goToStep(1);
  };

  const { hasQuiz, hasProblem } = form.watch();

  // Reset quiz data if hasQuiz is false, set to undefined so it doesn't validate
  useEffect(() => {
    if (!hasQuiz) {
      form.setValue("lessonQuiz", undefined);
      console.log("Quiz disabled, resetting quiz data");
    }
  }, [hasQuiz]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave, (errors) => console.log("Validation errors:", errors))}
        className="flex flex-col mx-auto gap-8 max-w-[1000px]"
      >
        <FormField
          control={form.control}
          name="lessonId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredInputLabel label="Lesson ID" />
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
                <AddMarkdownContent value={field.value} onChange={field.onChange} readOnly={isReadOnly} />
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
