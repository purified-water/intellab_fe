export interface AssignmentDetailRequest {
  answer: string;
  unitScore: number;
  questionId: string;
}

export interface SubmitQuizType {
  score: number;
  exerciseId: string;
  learningId: string;
  assignmentDetailRequests: AssignmentDetailRequest[];
}
