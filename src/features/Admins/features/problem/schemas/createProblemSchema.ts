import { z } from "zod";
import { BoilerplateDataTypes } from "../constants/BoilerplateDataTypes";
import { createTestcaseSchema } from "./createTestcaseSchema";

export const createInputSchema = z.object({
  inputName: z
    .string()
    .min(1, { message: "Input name is required" })
    .max(50, { message: "Input name must be less than 50 characters" }),
  inputType: z.enum(BoilerplateDataTypes)
});

export const createOutputSchema = z.object({
  outputName: z
    .string()
    .min(1, { message: "Output name is required" })
    .max(50, { message: "Output name must be less than 50 characters" }),
  outputType: z.enum(BoilerplateDataTypes)
});

export const createProblemSchema = z.object({
  problemId: z.string(),
  problemName: z
    .string()
    .min(1, { message: "Problem name is required" })
    .max(100, { message: "Problem name must be less than 100 characters" }),
  problemCategories: z
    .array(
      z.object({
        categoryId: z.number(),
        name: z.string()
      })
    )
    .refine((categories) => categories.length > 0, {
      message: "At least one category is required"
    }),
  problemLevel: z.enum(["Easy", "Medium", "Hard"]),
  problemScore: z.number().min(1, { message: "Problem score is required" }),
  problemIsPublished: z.boolean(),
  problemDescription: z
    .string()
    .min(1, { message: "Problem description is required" })
    .max(800, { message: "Problem description must be less than 800 characters" }),
  problemStructure: z.object({
    functionName: z
      .string()
      .min(1, { message: "Function name is required" })
      .max(50, { message: "Function name must be less than 50 characters" }),
    inputStructure: z.array(createInputSchema).refine((inputs) => inputs.length > 0, {
      message: "At least one input is required"
    }),
    outputStructure: z.array(createOutputSchema).refine((outputs) => outputs.length > 0, {
      message: "At least one output is required"
    })
  }),
  problemTestcases: z.array(createTestcaseSchema).refine((testcases) => testcases.length > 0, {
    message: "At least one testcase is required"
  }),
  problemSolution: z
    .string()
    .min(1, { message: "Problem solution is required" })
    .max(1000, { message: "Problem solution must be less than 1000 characters" })
});

export type CreateProblemSchema = z.infer<typeof createProblemSchema>;
