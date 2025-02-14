export interface RunCodeTestCase {
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  status: string;
  statusId: number;
  message: string;
  time: string;
  memoryUsage: string;
  error: string | null;
  compileOutput: string | null;
}

export interface RunCodeResponseType {
  runCodeId: string;
  code: string;
  programmingLanguage: string;
  problemId: string;
  userUid: string;
  testcases: RunCodeTestCase[];
}
