import { z } from "zod";

export const createTestcaseSchema = z.object({
  testcaseId: z.string(),
  testcaseInput: z.string().min(1, { message: "Testcase input is required" }),
  expectedOutput: z.string().min(1, { message: "Testcase output is required" }),
  testcaseOrder: z.number().min(1, { message: "Testcase order is required" })
});

export type CreateTestcaseSchema = z.infer<typeof createTestcaseSchema>;
