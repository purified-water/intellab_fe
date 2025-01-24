export interface TestCaseType {
  testCaseId: string;
  input: string;
  output: string;
  order: number;
  userId: string | null;
  submitOutputs: string[];
}
export interface TestCaseOutputType {
  testcaseId: string;
  input: string;
  output: string;
  order: number;
  userId: string | null;
  submitOutputs: TestCaseSubmitOutput[];
}

export interface TestCaseSubmitOutput {
  testCaseOutputID: TestCaseOutputID;
  token: string;
  runtime: number;
  submission_output: string | null;
  result_status: string;
}

export interface TestCaseOutputID {
  submission_id: string;
  testcase_id: string;
}
