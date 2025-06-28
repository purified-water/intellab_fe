import { SubmissionTypeNoProblem } from "./SubmissionType";
import { TestCaseResultWithIO, TestCaseAfterSubmit } from "./TestCaseType";

export interface ViewTestCaseDetailProps {
  testCaseDetail: TestCaseResultWithIO;
  onBack: () => void;
}

export interface ViewAllTestCaseResultListProps {
  testCases: TestCaseAfterSubmit[];
  onTestCaseClick: (testCase: TestCaseAfterSubmit) => void;
  onBack: () => void;
}

export interface SubmissionResultsProps {
  isPassed: boolean;
  viewingPage: boolean;
  onViewAllTestCases: () => void;
  submittedCode: string;
  language: string;
  submissionResult: SubmissionTypeNoProblem;
}

export interface SubmissionInformationProps {
  isPassed: boolean;
  historyInformation?: SubmissionTypeNoProblem | null;
  onBack?: () => void;
  viewingPage?: boolean;
}
