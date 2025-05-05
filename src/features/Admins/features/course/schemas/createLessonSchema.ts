import { z } from "zod";
import { createQuizSchema } from "./createQuizSchema";

export const createLessonSchema = z
  .object({
    lessonId: z.string(),
    lessonName: z.string().min(1, { message: "Lesson name is required" }).max(50, {
      message: "Lesson name must be less than 50 characters"
    }),
    lessonDescription: z.string().min(1, { message: "Lesson description is required" }).max(100, {
      message: "Lesson description must be less than 100 characters"
    }),
    lessonContent: z.string().min(1, { message: "Lesson content is required" }).max(3000, {
      message: "Lesson content must be less than 3000 characters"
    }),
    hasQuiz: z.boolean(),
    lessonQuiz: createQuizSchema.optional(),
    hasProblem: z.boolean(),
    lessonProblemId: z.string().optional(),
    lessonOrder: z.number().min(0, { message: "Lesson order must be a positive number" }).optional()
  })
  .superRefine((data, ctx) => {
    // Check if hasQuiz is true and validate lessonQuiz
    // If hasQuiz is true, lessonQuiz should not be empty
    if (data.hasQuiz === true) {
      const quiz = data.lessonQuiz;
      const shouldValidateQuiz =
        quiz && Object.values(quiz).some((v) => v !== undefined && v !== null && v.toString() !== "");

      if (!shouldValidateQuiz) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quiz data is required when hasQuiz is true",
          path: ["lessonQuiz"]
        });
      } else {
        const quizResult = createQuizSchema.safeParse(quiz);
        if (!quizResult.success) {
          for (const issue of quizResult.error.issues) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue.message,
              path: ["lessonQuiz", ...(issue.path || [])]
            });
          }
        }
      }
    }

    if (data.hasProblem === true && !data.lessonProblemId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A problem is required when hasProblem is true",
        path: ["lessonProblemId"]
      });
    }
  });

export type CreateLessonSchema = z.infer<typeof createLessonSchema>;
