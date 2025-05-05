import { z } from "zod";

export const quizQuestionSchema = z.object({
  questionId: z.string(),
  questionTitle: z.string().max(100, {
    message: "Question must be less than 100 characters"
  }),
  correctAnswer: z
    .number()
    .min(1, { message: "Correct answer must be at least 1" })
    .max(4, { message: "Correct answer must be at most 4" }),
  options: z
    .array(
      z.object({
        order: z.number(),
        option: z.string().min(1, { message: "Option is required" }).max(100, {
          message: "Option must be less than 100 characters"
        })
      })
    )
    .refine((options) => options.length > 0, {
      message: "At least one option is required"
    })
});

export const createQuizSchema = z.object({
  totalQuestions: z.number().min(1, { message: "Total questions must be at least 1" }),
  displayedQuestions: z.number().min(1, { message: "Displayed questions must be at least 1" }),
  requiredCorrectQuestions: z.number().min(1, { message: "Required correct questions must be at least 1" }),
  quizQuestions: z.array(quizQuestionSchema).refine((questions) => questions.length > 0, {
    message: "At least one question is required"
  })
});

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;
