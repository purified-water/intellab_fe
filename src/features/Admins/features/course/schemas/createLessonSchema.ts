import { z } from "zod";
import { createQuizSchema } from "./createQuizSchema";
import { MAX_LESSON_CONTENT_WORD_COUNT } from "@/constants";

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

export const createLessonSchema = z
  .object({
    lessonId: z.string(),
    lessonName: z.string().min(1, { message: "Lesson name is required" }).max(300, {
      message: "Lesson name must be less than 300 characters"
    }),
    lessonDescription: z.string().min(1, { message: "Lesson description is required" }).max(800, {
      message: "Lesson description must be less than 800 characters"
    }),
    lessonContent: z
      .string()
      .min(1, { message: "Lesson content is required" })
      .refine(
        (content) => {
          const wordCount = countWords(content);
          return wordCount <= MAX_LESSON_CONTENT_WORD_COUNT; // Maximum 10,000 words
        },
        { message: `Lesson content must not exceed ${MAX_LESSON_CONTENT_WORD_COUNT} words` }
      ),
    hasQuiz: z.boolean(),
    // Keep lessonQuiz as optional in the schema
    lessonQuiz: createQuizSchema.optional(),
    hasProblem: z.boolean(),
    lessonProblemId: z.string().optional().nullable(),
    lessonOrder: z.number().min(0, { message: "Lesson order must be a positive number" }).optional()
  })
  .superRefine((data, ctx) => {
    // Check if hasQuiz is true and validate lessonQuiz
    if (data.hasQuiz === true) {
      // Make sure lessonQuiz is defined when hasQuiz is true
      if (!data.lessonQuiz) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quiz data is required when hasQuiz is true",
          path: ["lessonQuiz"]
        });
        return;
      }

      // Only validate non-empty quiz content when hasQuiz is true
      const quizResult = createQuizSchema.safeParse(data.lessonQuiz);
      if (!quizResult.success) {
        for (const issue of quizResult.error.issues) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: issue.message,
            path: ["lessonQuiz", ...(issue.path || [])]
          });
        }
      }
    } else {
      // When hasQuiz is false, we should not validate the quiz fields
      // We explicitly set lessonQuiz to undefined for the validation to pass
      data.lessonQuiz = undefined;
    }

    // Problem validation
    if (data.hasProblem === true && !data.lessonProblemId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A problem is required when hasProblem is true",
        path: ["lessonProblemId"]
      });
    }
  });

export type CreateLessonSchema = z.infer<typeof createLessonSchema>;
