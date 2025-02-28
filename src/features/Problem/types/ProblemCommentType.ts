// Only have data inside comment
export interface ProblemCommentType {
  commentId: string;
  content: string;
  numberOfLikes: number;
  problemId: string;
  userUid: string;
  userUuid: string;
  parentCommentId: string | null;
  replyToCommentId: string | null;
  createdAt: string;
  lastModifiedAt: string;
  username: string;
  userAvatar: string;
  userEmail: string;
  isModified: boolean;
  isUpVoted: boolean;
  childrenComments: ProblemCommentsResponse | null; // Hỗ trợ pagination lồng
}
// With pagination and stuff
export interface ProblemCommentsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ProblemCommentType[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
