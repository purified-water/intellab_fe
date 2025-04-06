import { TApiResponse, TSort, IPageable, TGetApiParams, TPostApiParams } from "@/types";
import { TComment } from "./comment";

type TUpvoteCommentResponse = TApiResponse<number>;

type TCancelUpvoteCommentResponse = TApiResponse<number>;

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

type TUpvoteCommentParams = TGetApiParams<
  {
    commentId: string;
  },
  number
>;

type TCancelUpvoteCommentParams = TGetApiParams<
  {
    commentId: string;
  },
  number
>;

type TModifyCommentParams = TPostApiParams<
  undefined,
  {
    commentId: string;
    content: string;
  },
  TComment
>;

type TGetCourseCommentsParams = TGetApiParams<
  {
    courseId: string;
    userUid: string | null;
    page: number | null;
    sort: string | null;
  },
  {
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
  }
>;

type TCreateCommentParams = TPostApiParams<
  {
    courseId: string;
  },
  {
    content: string;
    repliedCommentId: string | null;
    parentCommentId: string | null;
  },
  TComment
>;

type TGetCommentParams = TGetApiParams<
  {
    commentId: string;
    userUid: string | null;
    page: number | null;
    size: number | null;
    sort: string[] | null;
  },
  TComment
>;

type TGetCommentChildrenParams = TGetApiParams<
  {
    commentId: string;
    userUid: string | null;
    size: number | null;
  },
  {
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
  }
>;

type TDeleteCommentParams = TGetApiParams<
  {
    commentId: string;
  },
  boolean
>;

export type {
  TUpvoteCommentResponse,
  TCancelUpvoteCommentResponse,
  TModifyCommentResponse,
  TGetCourseCommentsResponse,
  TGetCommentResponse,
  TGetCommentChildrenResponse,
  TCreateCommentResponse,
  TDeleteCommentResponse,
  TUpvoteCommentParams,
  TCancelUpvoteCommentParams,
  TModifyCommentParams,
  TGetCourseCommentsParams,
  TCreateCommentParams,
  TGetCommentParams,
  TGetCommentChildrenParams,
  TDeleteCommentParams
};
