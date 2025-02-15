export interface SubmissionHistoryType {
  submissionId: string;
  status: string;
  submitDate: string | null;
  programmingLanguage: string;
  runtime: number;
  memory: number;
}
