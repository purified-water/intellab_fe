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
  userUuid: string;
  userUid: string;
  courseId: string;
  createAt: string;
  lastModifiedAt: string;
  displayName: string;
  email: string;
  photoUrl: string;
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

export interface ReviewStatsResult {
  totalReviews: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  courseId: string;
  percentageFiveStar: number;
  percentageFourStar: number;
  percentageThreeStar: number;
  percentageTwoStar: number;
  percentageOneStar: number;
}

export interface ReviewStatsResponse {
  code: number;
  result: ReviewStatsResult;
}
