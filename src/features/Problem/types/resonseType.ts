export interface SortType {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface PageableType {
  offset: number;
  sort: SortType;
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface Category {
  categoryId: string;
  name: string;
}

export interface Problem {
  problemId: string;
  problemName: string;
  level: string;
  acceptanceRate: number;
  hintCount: number;
  categories: Category[];
  isDone: boolean;
  isPublished: boolean;
}

export interface ProblemsResult {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Problem[];
  number: number;
  sort: SortType;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableType;
  empty: boolean;
}

export interface ProblemsResponse {
  code: number;
  message: string;
  result: ProblemsResult;
}
