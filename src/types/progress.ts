type TProgress = {
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

type TRankLanguages = {
  top1: {
    solved: number;
    name: string;
  };
  top2: {
    solved: number;
    name: string;
  };
  top3: {
    solved: number;
    name: string;
  };
};

export type { TProgress, TRankLanguages };
