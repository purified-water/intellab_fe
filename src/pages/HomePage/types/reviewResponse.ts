export interface ISortType {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface IPageableType {
  offset: number;
  sort: ISortType;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface IReview {
  reviewId: string;
  rating: number;
  comment: string;
  userUid: string;
  courseId: string;
}

export interface IReviewsResult {
  totalPages: number;
  totalElements: number;
  size: number;
  content: IReview[];
  number: number;
  sort: ISortType;
  pageable: IPageableType;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface IReviewsResponse {
  code: number;
  message: string;
  result: IReviewsResult;
}
