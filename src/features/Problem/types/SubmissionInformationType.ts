import { TestCaseOutputType, TestCaseSubmitOutput } from "./TestCaseType";

export interface ViewTestCaseDetailProps {
  testCase: TestCaseOutputType;
  onBack: () => void;
}

export interface ViewAllTestCaseResultListProps {
  testCases: TestCaseOutputType[];
  onTestCaseClick: (testCase: TestCaseOutputType) => void;
  onBack: () => void;
}

export interface SubmissionResultsProps {
  isPassed: boolean;
  onViewAllTestCases: () => void;
  submittedCode: string;
  language: string;
}

export interface SubmissionInformationProps {
  isPassed: boolean;
}
