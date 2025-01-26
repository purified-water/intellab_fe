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
export interface IQuizResponse {
  order: number;
  questionId: string;
  questionContent: string;
  status: string;
  correctAnswer: string;
  answer: string;
  questionType: string;
  options: IOption[];
  unitScore: number;
}
