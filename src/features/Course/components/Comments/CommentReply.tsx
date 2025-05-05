import { useEffect, useState } from "react";
import { BiUpvote, BiSolidUpvote, BiShare } from "rocketicons/bi";
import { Button } from "@/components/ui";
import { AvatarIcon, AlertDialog } from "@/components/ui";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useToast } from "@/hooks/use-toast";
import { TComment } from "@/features/Course/types";
import { formatDateTime, showToastError, getUserIdFromLocalStorage, isEmptyString } from "@/utils";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { ICourse } from "@/types";
import { courseAPI } from "@/lib/api";
import * as commentStore from "@/redux/comment/commentSlice";
import { useCommentContext } from "@/hooks";

const parseReplyContent = (reply: string) => {
  const regex = /^\[@(.*?)\]\s(.*)$/;
  const match = reply.match(regex);
  if (match) {
    return {
      userName: match[1],
      replyContent: match[2]
    };
  }
  return null;
};

type CommentReplyProps = {
  replyComment: TComment;
  enrolledCourse: ICourse;
  deleteCommentAPI: (comment: TComment) => Promise<void>;
};

export const CommentReply = (props: CommentReplyProps) => {
  const { replyComment, enrolledCourse, deleteCommentAPI } = props;

  const { courseId, userEnrolled } = enrolledCourse;
  const {
    content,
    userName,
    avatarUrl,
    commentId,
    parentCommentId,
    repliedCommentId,
    isUpvoted,
    numberOfLikes,
    created,
    userUid
  } = replyComment;

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const reduxUser = useSelector((state: RootState) => state.user.user);

  const toast = useToast();
  const localUserUid = getUserIdFromLocalStorage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isOwner = userUid == localUserUid;

  const [isReply, setIsReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  // For highlighting redirected comment
  const redirectedCommentId = useCommentContext().commentId;

  const upvoteCommentAPI = async (commentId: string) => {
    await courseAPI.upvoteComment({
      query: { commentId },
      onStart: async () => setLoading(true),
      onSuccess: async (_numberOfLikes) => {
        dispatch(commentStore.upvoteComment(replyComment));
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
        dispatch(commentStore.cancelUpvoteComment(replyComment));
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
        setEditReplyContent("");
        dispatch(commentStore.editComment(data));
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
        setIsReply(false);
        setReplyContent("");
        dispatch(commentStore.createComment(data));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  useEffect(() => {
    setEditReplyContent(`${content} `);
    setReplyContent(`[@${userName}] `);
  }, [replyComment]);

  const handleUsernameClick = () => {
    navigate(`/profile/${userUid}`);
  };

  const renderReplyComment = () => {
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
      const handleUsernameClick = () => {
        navigate(`/profile/${userUid}`);
      };

      let actualContent = null;
      if (parentCommentId == repliedCommentId) {
        // reply is first level
        actualContent = content;
      } else {
        // reply is second level and above
        const parsedReply = parseReplyContent(content);
        actualContent = (
          <>
            <span
              className="font-semibold cursor-pointer text-appPrimary hover:text-opacity-80"
              onClick={handleUsernameClick}
            >
              @{parsedReply?.userName}
            </span>
            <span> {parsedReply?.replyContent}</span>
          </>
        );
      }

      return <div className="mt-2 text-sm">{actualContent}</div>;
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

      const renderReplyButton = () => {
        const handleReply = () => {
          if (!isAuthenticated) {
            showToastError({
              toast: toast.toast,
              title: "Login required",
              message: "You must be logged in to make reply"
            });
          } else if (!userEnrolled) {
            showToastError({
              toast: toast.toast,
              title: "Enrollment required",
              message: "You must enroll in this course to make reply"
            });
          } else {
            setIsReply(true);
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
            onConfirm={() => deleteCommentAPI(replyComment)}
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

    const renderReplyInput = () => {
      const handleCancel = () => {
        setIsReply(false);
        setReplyContent("");
      };

      const handleReply = () => {
        const parsedReply = parseReplyContent(replyContent);
        const actualContent = parsedReply!.replyContent.trim();
        const actualParentCommentId = parentCommentId ?? commentId;
        if (isEmptyString(actualContent)) {
          showToastError({ toast: toast.toast, message: "Reply cannot be empty" });
        } else {
          createCommentAPI(courseId, replyContent, actualParentCommentId, commentId);
        }
      };

      return (
        isReply && (
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
                onClick={handleReply}
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
        {renderReplyInput()}
      </div>
    );
  };

  const renderEditInput = () => {
    const handleCancel = () => {
      setIsEdit(false);
      if (parentCommentId == repliedCommentId) {
        setEditReplyContent(content);
      } else {
        const parsedReply = parseReplyContent(content);
        setEditReplyContent(parsedReply?.replyContent ?? "");
      }
    };

    const handleEdit = () => {
      const parsedEditComment = parseReplyContent(editReplyContent);
      const parsedComment = parseReplyContent(content);

      const actualEditContent = parsedEditComment!.replyContent.trim();
      const actualContent = parsedComment!.replyContent.trim();

      if (isEmptyString(actualEditContent)) {
        showToastError({ toast: toast.toast, message: "Comment cannot be empty" });
      } else if (actualEditContent == actualContent) {
        showToastError({ toast: toast.toast, message: "No changes detected" });
      } else {
        editCommentAPI(commentId, editReplyContent);
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
            value={editReplyContent}
            onChange={(e) => setEditReplyContent(e.target.value)}
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

  return isEdit ? renderEditInput() : renderReplyComment();
};
