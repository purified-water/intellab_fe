import { z } from "zod";

export const testCaseSchema = z.object({
  input: z.string().min(1, { message: "Input is required" }).max(1000, {
    message: "Input must be less than 1000 characters"
  }),
  output: z.string().min(1, { message: "Output is required" }).max(1000, {
    message: "Output must be less than 1000 characters"
  })
});

export const createProblemSchema = z.object({
  problemId: z.string().min(1, { message: "Problem ID is required" })
  // problemName: z.string().min(1, { message: "Problem name is required" }).max(50, {
  //   message: "Problem name must be less than 50 characters"
  // }),
  // problemDescription: z.string().min(1, { message: "Problem description is required" }).max(100, {
  //   message: "Problem description must be less than 100 characters"
  // }),
  // problemCategories: z
  //   .array(
  //     z.object({
  //       id: z.string(),
  //       name: z.string()
  //     })
  //   )
  //   .refine((categories) => categories.length > 0, {
  //     message: "At least one category is required"
  //   }),
  // problemLevel: z.enum(["easy", "medium", "hard"])
});

export type CreateProblemSchema = z.infer<typeof createProblemSchema>;
export type TestCaseSchema = z.infer<typeof testCaseSchema>;
