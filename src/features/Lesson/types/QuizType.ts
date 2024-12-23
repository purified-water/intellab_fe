export interface IOption {
  order: number;
  content: string;
}
export interface IQuiz {
  questionId: string;
  questionContent: string;
  status: string;
  correctAnswer: string;
  questionType: string;
  options: IOption[];
}
