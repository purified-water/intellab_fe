interface Answer {
  label: string;
  content: string;
  isCorrect: boolean;
}

interface IQuiz {
  question: string;
  answers: Answer[];
}

export type { IQuiz, Answer };
