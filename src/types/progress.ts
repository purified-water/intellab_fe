export type Progress = {
  totalProblems: number;
  easy: {
    solved: number;
    max: number;
  };
  medium: {
    solved: number;
    max: number;
  };
  hard: {
    solved: number;
    max: number;
  };
};
