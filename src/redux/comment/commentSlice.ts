import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentState } from "./commentType";
import { TComment } from "@/features/Course/types";

const initialState: CommentState = {
  comments: []
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // Comment actions
    setComments(state, action: PayloadAction<TComment[]>) {
      state.comments = action.payload;
    },

    setReplies(state, action: PayloadAction<{ commentId: string; replies: TComment[] }>) {
      state.comments = state.comments.map((comment) => {
        if (comment.commentId == action.payload.commentId) {
          return {
            ...comment,
            comments: {
              ...comment.comments,
              content: action.payload.replies
            }
          };
        }
        return comment;
      });
    },

    createComment(state, action: PayloadAction<TComment>) {
      if (action.payload.parentCommentId) {
        // the comment is a child comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.parentCommentId) {
            return {
              ...comment,
              comments: {
                ...comment.comments,
                totalElements: comment.comments.totalElements + 1,
                content: [action.payload, ...comment.comments.content]
              }
            };
          }
          return comment;
        });
      } else {
        // the comment is a parent comment
        state.comments = [
          {
            ...action.payload,
            comments: {
              // NOTE: the BE does not return the comments of the new comment
              ...action.payload.comments,
              totalElements: 0,
              content: []
            }
          },
          ...state.comments
        ];
      }
    },

    editComment(state, action: PayloadAction<TComment>) {
      if (action.payload.parentCommentId) {
        // the comment is a child comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.parentCommentId) {
            return {
              ...comment,
              comments: {
                ...comment.comments,
                content: comment.comments.content.map((childComment) => {
                  if (childComment.commentId == action.payload.commentId) {
                    return action.payload;
                  }
                  return childComment;
                })
              }
            };
          }
          return comment;
        });
      } else {
        // the comment is a parent comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.commentId) {
            return {
              ...comment,
              // NOTE: the return value of the API is not consistent with the old comment object
              content: action.payload.content,
              lastModified: action.payload.lastModified
            };
          }
          return comment;
        });
      }
    },

    deleteComment(state, action: PayloadAction<TComment>) {
      if (action.payload.parentCommentId) {
        // the comment is a child comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.parentCommentId) {
            return {
              ...comment,
              comments: {
                ...comment.comments,
                totalElements: comment.comments.totalElements - 1,
                content: comment.comments.content.filter(
                  (childComment) => childComment.commentId != action.payload.commentId
                )
              }
            };
          }
          return comment;
        });
      } else {
        // the comment is a parent comment
        state.comments = state.comments.filter((comment) => comment.commentId != action.payload.commentId);
      }
    },

    upvoteComment(state, action: PayloadAction<TComment>) {
      if (action.payload.parentCommentId) {
        // the comment is a child comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.parentCommentId) {
            return {
              ...comment,
              comments: {
                ...comment.comments,
                content: comment.comments.content.map((childComment) => {
                  if (childComment.commentId == action.payload.commentId) {
                    return {
                      ...childComment,
                      isUpvoted: true,
                      numberOfLikes: childComment.numberOfLikes + 1
                    };
                  }
                  return childComment;
                })
              }
            };
          }
          return comment;
        });
      } else {
        // the comment is a parent comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.commentId) {
            return {
              ...comment,
              isUpvoted: true,
              numberOfLikes: comment.numberOfLikes + 1
            };
          }
          return comment;
        });
      }
    },

    cancelUpvoteComment(state, action: PayloadAction<TComment>) {
      if (action.payload.parentCommentId) {
        // the comment is a child comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.parentCommentId) {
            return {
              ...comment,
              comments: {
                ...comment.comments,
                content: comment.comments.content.map((childComment) => {
                  if (childComment.commentId == action.payload.commentId) {
                    return {
                      ...childComment,
                      isUpvoted: false,
                      numberOfLikes: childComment.numberOfLikes - 1
                    };
                  }
                  return childComment;
                })
              }
            };
          }
          return comment;
        });
      } else {
        // the comment is a parent comment
        state.comments = state.comments.map((comment) => {
          if (comment.commentId == action.payload.commentId) {
            return {
              ...comment,
              isUpvoted: false,
              numberOfLikes: comment.numberOfLikes - 1
            };
          }
          return comment;
        });
      }
    }
  }
});

export const {
  setComments,
  createComment,
  editComment,
  deleteComment,
  upvoteComment,
  cancelUpvoteComment,
  setReplies
} = commentSlice.actions;
export default commentSlice.reducer;
