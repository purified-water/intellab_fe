export interface TestCaseType {
  testCaseId: string;
  input: string;
  output: string;
  order: number;
  userId: string | null;
  submitOutputs: string[];
}
