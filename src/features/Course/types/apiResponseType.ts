import { TApiResponse, TSort, IPageable } from "@/types";
import { TComment } from "./comment";

type TUpvoteCommentResponse = TApiResponse<TComment>;

type TCancelUpvoteCommentResponse = TApiResponse<TComment>;

type TModifyCommentResponse = TApiResponse<TComment>;

type TGetCourseCommentsResponse = TApiResponse<{
  totalPages: number;
  totalElements: number;
  size: number;
  content: TComment[];
  number: number;
  sort: TSort;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}>;

type TCreateCommentResponse = TApiResponse<TComment>;

type TGetCommentResponse = TApiResponse<TComment>;

type TGetCommentChildrenResponse = TApiResponse<{
  totalPages: number;
  totalElements: number;
  size: number;
  content: TComment[];
  number: number;
  sort: TSort;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}>;

type TDeleteCommentResponse = TApiResponse<boolean>;

export type {
  TUpvoteCommentResponse,
  TCancelUpvoteCommentResponse,
  TModifyCommentResponse,
  TGetCourseCommentsResponse,
  TGetCommentResponse,
  TGetCommentChildrenResponse,
  TCreateCommentResponse,
  TDeleteCommentResponse
};
