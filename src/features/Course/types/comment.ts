import { IPageable, TSort } from "@/types";

type TComment = {
  commentId: string;
  content: string;
  numberOfLikes: number;
  created: string;
  lastModified: string | null;
  userId: string;
  userUid: string;
  userName: string;
  avatarUrl: string;
  parentCommentId: string | null;
  repliedCommentId: string | null;
  isModified: boolean;
  isUpvoted: boolean;
  isOwner: boolean;
  comments: {
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
  };
};

export type { TComment };
