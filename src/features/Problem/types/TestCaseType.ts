export interface TestCaseType {
  // For getting normal test cases to show in Test case tab
  testCaseId: string;
  input: string;
  output: string;
  order: number;
  userId: string | null;
  submitOutputs: string[];
}
export interface TestCaseResultWithIO {
  // To get the test case detail
  testcaseId: string;
  input: string;
  output: string;
  order: number;
  userId: string | null;
  submitOutputs: TestCaseAfterSubmit[];
}

export interface TestCaseAfterSubmit {
  // When submitting code, this is the output of the test case
  testCaseOutputID: TestCaseOutputID;
  token: string;
  runtime: number;
  submission_output: string | null;
  result_status: string;
}

export interface TestCaseOutputID {
  // For getting the output of the test case
  submission_id: string;
  testcase_id: string;
}
