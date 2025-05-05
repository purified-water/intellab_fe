import { useState, useEffect } from "react";
import { CommentReply } from "./CommentReply";
import { BiUpvote, BiSolidUpvote, BiShare } from "rocketicons/bi";
import { FaRegComment } from "rocketicons/fa6";
import { Button } from "@/components/ui";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useToast } from "@/hooks/use-toast";
import { TComment } from "@/features/Course/types";
import { formatDateTime, showToastError, getUserIdFromLocalStorage, isEmptyString } from "@/utils";
import { courseAPI } from "@/lib/api";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AvatarIcon } from "@/components/ui";
import * as commentStore from "@/redux/comment/commentSlice";
import { useNavigate } from "react-router-dom";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { ICourse } from "@/types";
import { useCommentContext, useParentCommentContext } from "@/hooks/useCommentContext";

type CourseCommentProps = {
  comment: TComment;
  enrolledCourse: ICourse;
  deleteCommentAPI: (comment: TComment) => Promise<void>;
};

export const CourseComment = (props: CourseCommentProps) => {
  const { comment, enrolledCourse, deleteCommentAPI } = props;

  const { courseId, userEnrolled } = enrolledCourse;
  const {
    commentId,
    content,
    numberOfLikes,
    userName,
    avatarUrl,
    parentCommentId,
    isUpvoted,
    comments: replies,
    created,
    userUid
  } = comment;

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const reduxUser = useSelector((state: RootState) => state.user.user);

  const toast = useToast();
  const dispatch = useDispatch();
  const localUserUid = getUserIdFromLocalStorage();
  const navigate = useNavigate();

  const isOwner = userUid === localUserUid;

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [shownRepliesNumber, setShownRepliesNumber] = useState(5);
  const [loading, setLoading] = useState(false);

  const totalReplies = replies.totalElements;

  // For highlighting redirected comment
  const redirectedCommentId = useCommentContext().commentId;
  const redirectedParentCommentId = useParentCommentContext().parentCommentId;

  useEffect(() => {
    setEditContent(`${content} `);
  }, [content]);

  useEffect(() => {
    if (redirectedParentCommentId !== null) {
      setShowReplies(true);
    }
  }, [redirectedCommentId]);

  const upvoteCommentAPI = async (commentId: string) => {
    await courseAPI.upvoteComment({
      query: { commentId },
      onStart: async () => setLoading(true),
      onSuccess: async (_numberOfLikes) => {
        dispatch(commentStore.upvoteComment(comment));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  const cancelUpvoteCommentAPI = async (commentId: string) => {
    await courseAPI.cancelUpvoteComment({
      query: { commentId },
      onStart: async () => setLoading(true),
      onSuccess: async (_numberOfLikes) => {
        dispatch(commentStore.cancelUpvoteComment(comment));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  const editCommentAPI = async (commentId: string, content: string) => {
    await courseAPI.modifyComment({
      body: { commentId, content },
      onStart: async () => setLoading(true),
      onSuccess: async (data) => {
        setIsEdit(false);
        setEditContent("");
        dispatch(commentStore.editComment(data));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  const getRepliesAPI = async (commentId: string, size: number) => {
    await courseAPI.getCommentChildren({
      query: { commentId, userUid, size },
      onStart: async () => setLoading(true),
      onSuccess: async (data) => {
        dispatch(commentStore.setReplies({ commentId, replies: data.content }));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  const createCommentAPI = async (
    courseId: string,
    content: string,
    parentCommentId: string | null,
    repliedCommentId: string | null
  ) => {
    await courseAPI.createComment({
      query: { courseId },
      body: { content, parentCommentId, repliedCommentId },
      onStart: async () => setLoading(true),
      onSuccess: async (data) => {
        setShowReplyInput(false);
        setReplyContent("");
        setShowReplies(true);
        dispatch(commentStore.createComment(data));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  const renderComment = () => {
    const handleUsernameClick = () => {
      navigate(`/profile/${userUid}`);
    };

    const renderUserInformation = () => {
      return (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <AvatarIcon src={avatarUrl} alt={userName} />
            <p className="text-lg font-semibold cursor-pointer hover:text-appPrimary" onClick={handleUsernameClick}>
              {userName}
            </p>
          </div>
          <p className="text-sm font-medium text-gray3">{formatDateTime(created)}</p>
        </div>
      );
    };

    const renderContent = () => {
      return <p className="mt-2 text-sm">{content}</p>;
    };

    const renderActions = () => {
      const renderUpvoteButton = () => {
        const handleToggleUpvote = () => {
          if (!isAuthenticated) {
            showToastError({
              toast: toast.toast,
              title: "Login required",
              message: "You must be logged in to upvote comments"
            });
          } else if (!userEnrolled) {
            showToastError({
              toast: toast.toast,
              title: "Enrollment required",
              message: "You must enroll in this course to upvote comments"
            });
          } else {
            if (isUpvoted) {
              cancelUpvoteCommentAPI(commentId);
            } else {
              upvoteCommentAPI(commentId);
            }
          }
        };

        let content = null;
        if (isUpvoted) {
          content = <BiSolidUpvote className="w-4 h-4 icon-appPrimary" />;
        } else {
          content = <BiUpvote className="w-4 h-4 icon-gray3 hover:text-black" />;
        }

        return (
          <button
            className="flex items-center space-x-1 cursor-pointer"
            onClick={handleToggleUpvote}
            disabled={loading}
          >
            {content}
            <p className="text-xs text-gray2 hover:text-black">{numberOfLikes}</p>
          </button>
        );
      };

      const renderShowRepliesButton = () => {
        const handleShowReplies = async () => {
          if (!showReplies) {
            await getRepliesAPI(commentId, totalReplies);
          } else {
            setShownRepliesNumber(5);
          }
          setShowReplies(!showReplies);
        };

        return (
          <div onClick={handleShowReplies} className="flex items-center space-x-1 cursor-pointer">
            <FaRegComment className="w-4 h-4 icon-gray3 hover:text-black" />
            <p className="text-xs text-gray2 hover:text-black">
              {showReplies ? `Hide ${totalReplies} replies` : `Show ${totalReplies} replies`}
            </p>
          </div>
        );
      };

      const renderReplyButton = () => {
        const handleReply = () => {
          if (!isAuthenticated) {
            showToastError({
              toast: toast.toast,
              title: "Login required",
              message: "You must be logged in to comment"
            });
          } else if (!userEnrolled) {
            showToastError({
              toast: toast.toast,
              title: "Enrollment required",
              message: "You must enroll in this course to comment"
            });
          } else {
            setShowReplyInput(!showReplyInput);
          }
        };

        return (
          <div onClick={handleReply} className="flex items-center space-x-1 cursor-pointer">
            <BiShare className="w-5 h-5 icon-gray3 hover:text-black" />
            <p className="text-xs text-gray2 hover:text-black">Reply</p>
          </div>
        );
      };

      const renderEditButton = () => {
        const handleEdit = () => {
          setIsEdit(true);
        };

        return (
          <div className="flex items-center space-x-1 cursor-pointer" onClick={handleEdit}>
            <Pencil className="w-4 h-4 text-gray3" />
            <p className="text-xs text-gray2 hover:text-black">Edit</p>
          </div>
        );
      };

      const renderDeleteButton = () => {
        return (
          <AlertDialog
            title={"Delete comment"}
            message={"Are you sure you want to delete this comment?"}
            onConfirm={() => deleteCommentAPI(comment)}
          >
            <div className="flex items-center space-x-1 cursor-pointer">
              <Trash2 className="w-4 h-4 text-gray3" />
              <p className="text-xs text-gray2 hover:text-black">Delete</p>
            </div>
          </AlertDialog>
        );
      };

      return (
        <div id="comment-actions" className="flex items-center mt-2 space-x-4 group">
          {renderUpvoteButton()}
          {replies && replies.content.length > 0 && renderShowRepliesButton()}
          {renderReplyButton()}
          {isOwner && (
            //{(isOwner ?? true) && ( // NOTE: for testing
            <div className="hidden space-x-4 group-hover:flex">
              {renderEditButton()}
              {renderDeleteButton()}
            </div>
          )}
        </div>
      );
    };

    const renderReplies = () => {
      return (
        showReplies && (
          <div className="mt-4 ml-8 space-y-4">
            <div className="space-y-4">
              {replies.content.slice(0, shownRepliesNumber).map((reply, index) => (
                <CommentReply
                  key={index}
                  replyComment={reply}
                  enrolledCourse={enrolledCourse}
                  deleteCommentAPI={deleteCommentAPI}
                />
              ))}
            </div>
            {shownRepliesNumber < totalReplies && (
              <p
                className="font-semibold cursor-pointer text-appPrimary"
                onClick={() => setShownRepliesNumber((prev) => prev + 5)}
              >
                Load more replies
              </p>
            )}
          </div>
        )
      );
    };

    const renderReplyInput = () => {
      const handleCancel = () => {
        setShowReplyInput(false);
        setReplyContent("");
      };

      const handleCreateComment = () => {
        const actualContent = `${replyContent.trim()}`;
        const actualParentCommentId = parentCommentId ?? commentId;
        if (isEmptyString(actualContent)) {
          showToastError({ toast: toast.toast, message: "Comment content cannot be empty" });
        } else {
          createCommentAPI(courseId, actualContent, commentId, actualParentCommentId);
        }
      };

      return (
        showReplyInput && (
          <div className="mt-4 ml-8 space-y-2">
            <div className="flex items-start space-x-2">
              <AvatarIcon src={reduxUser?.photoUrl ?? DEFAULT_AVATAR} alt={userName} />
              <textarea
                placeholder="Type your reply..."
                className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-white border-gray4/60 text-justify focus:outline-none"
                rows={1}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant={"outline"}
                className="px-4 py-2 rounded-lg text-appPrimary border-appPrimary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
                onClick={handleCreateComment}
                disabled={loading}
              >
                Reply
              </Button>
            </div>
          </div>
        )
      );
    };

    return (
      <div id={`comment-${commentId}`}>
        <div className={`${redirectedCommentId === commentId ? "bg-appInfo/10 p-4 rounded-lg" : ""}`}>
          {renderUserInformation()}
          {renderContent()}
          {renderActions()}
        </div>
        {replies && renderReplies()}
        {renderReplyInput()}
      </div>
    );
  };

  const renderEditInput = () => {
    const handleCancel = () => {
      setIsEdit(false);
      setEditContent(content);
    };

    const handleEdit = () => {
      const actualContent = `${editContent.trim()}`;
      if (isEmptyString(actualContent)) {
        showToastError({ toast: toast.toast, message: "Comment content cannot be empty" });
      } else if (actualContent === content) {
        showToastError({ toast: toast.toast, message: "No changes detected" });
      } else {
        editCommentAPI(commentId, actualContent);
      }
    };

    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-start space-x-2">
          <AvatarIcon src={avatarUrl} alt={userName} />
          <textarea
            placeholder="Type your edit..."
            className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-white border-gray4/60 text-justify focus:outline-none"
            rows={1}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant={"outline"}
            className="px-4 py-2 rounded-lg text-appPrimary border-appPrimary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
            onClick={handleEdit}
            disabled={loading}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  };

  return <div>{isEdit ? renderEditInput() : renderComment()}</div>;
};
