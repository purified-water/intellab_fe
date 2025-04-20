import { createContext, useContext } from "react";

export const CommentContext = createContext<{ commentId: string } | null>(null);

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useCommentContext must be used within a CommentContext.Provider");
  }
  return context;
};

// Parent Comment ID Context
export const ParentCommentContext = createContext<{ parentCommentId: string | null } | null>(null);
export const useParentCommentContext = () => {
  const context = useContext(ParentCommentContext);
  if (!context) {
    throw new Error("useParentCommentContext must be used within a ParentCommentContext.Provider");
  }
  return context;
};
