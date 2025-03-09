import { useState, useEffect } from "react";
import { CommentReply } from "./CommentReply";
import { BiUpvote, BiSolidUpvote, BiShare } from "rocketicons/bi";
import { FaRegComment } from "rocketicons/fa6";
import { Button } from "@/components/ui/shadcn/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useToast } from "@/hooks/use-toast";
import { TComment, ICourse } from "@/features/Course/types";
import { formatDateTime } from "@/utils";
import { showToastError } from "@/utils/toastUtils";
import { courseAPI } from "@/lib/api";
import { API_RESPONSE_CODE } from "@/constants";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AvatarIcon } from "@/components/ui";
import { getUserIdFromLocalStorage } from "@/utils";
import * as commentStore from "@/redux/comment/commentSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";

type CourseCommentProps = {
  comment: TComment;
  enrolledCourse: ICourse;
  createCommentAPI: (
    courseId: string,
    content: string,
    replyCommentId: string | null,
    parentCommentId: string | null,
    onSuccess: () => void
  ) => Promise<void>;
  deleteCommentAPI: (deleteComment: TComment) => Promise<void>;
  editCommentAPI: (commentId: string, content: string, onSuccess: () => void) => Promise<void>;
  getRepliesAPI: (commentId: string, size: number) => Promise<void>;
};

export const CourseComment = (props: CourseCommentProps) => {
  const { comment, enrolledCourse, createCommentAPI, deleteCommentAPI, editCommentAPI, getRepliesAPI } = props;

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

  const totalReplies = replies.totalElements;

  useEffect(() => {
    setEditContent(`${content} `);
  }, [content]);

  const upvoteCommentAPI = async (commentId: string) => {
    try {
      const response = await courseAPI.upvoteComment(commentId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        dispatch(commentStore.upvoteComment(result));
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error upvoting comment" });
      }
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error upvoting comment" });
    }
  };

  const cancelUpvoteCommentAPI = async (commentId: string) => {
    try {
      const response = await courseAPI.cancelUpvoteComment(commentId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        dispatch(commentStore.cancelUpvoteComment(result));
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error canceling upvote comment" });
      }
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error canceling upvote comment" });
    }
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
          if (isAuthenticated) {
            if (userEnrolled) {
              if (isUpvoted) {
                cancelUpvoteCommentAPI(commentId);
              } else {
                upvoteCommentAPI(commentId);
              }
            } else {
              showToastError({ toast: toast.toast, message: "You need to enroll in the course to upvote comments" });
            }
          } else {
            showToastError({ toast: toast.toast, message: "Login required" });
          }
        };

        let content = null;
        if (isUpvoted) {
          content = <BiSolidUpvote className="w-4 h-4 icon-appPrimary" />;
        } else {
          content = <BiUpvote className="w-4 h-4 icon-gray3 hover:text-black" />;
        }

        return (
          <div className="flex items-center space-x-1 cursor-pointer" onClick={handleToggleUpvote}>
            {content}
            <p className="text-xs text-gray2 hover:text-black">{numberOfLikes}</p>
          </div>
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
          if (isAuthenticated) {
            if (userEnrolled) {
              setShowReplyInput(!showReplyInput);
            } else {
              showToastError({ toast: toast.toast, message: "You must enroll in this course to comment" });
            }
          } else {
            showToastError({ toast: toast.toast, message: "Login required" });
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
            <div className="hidden group-hover:flex space-x-4">
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
          <div className="ml-8 mt-4 space-y-4">
            <div className="space-y-4">
              {replies.content.slice(0, shownRepliesNumber).map((reply, index) => (
                <CommentReply
                  key={index}
                  replyComment={reply}
                  enrolledCourse={enrolledCourse}
                  createCommentAPI={createCommentAPI}
                  deleteCommentAPI={deleteCommentAPI}
                  editCommentAPI={editCommentAPI}
                  upvoteCommentAPI={upvoteCommentAPI}
                  cancelUpvoteCommentAPI={cancelUpvoteCommentAPI}
                />
              ))}
            </div>
            {shownRepliesNumber < totalReplies && (
              <p
                className="cursor-pointer text-appPrimary font-semibold"
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
        const handleSuccess = () => {
          setShowReplyInput(false);
          setReplyContent("");
          setShowReplies(true);
        };
        createCommentAPI(courseId, actualContent, commentId, actualParentCommentId, handleSuccess);
      };

      return (
        showReplyInput && (
          <div className="mt-4 ml-8 space-y-2">
            <div className="flex items-start space-x-2">
              <AvatarIcon src={reduxUser?.photoUrl ?? DEFAULT_AVATAR} alt={userName} />
              <textarea
                placeholder="Type your reply..."
                className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-white border-gray4/60 text-justify"
                rows={1}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant={"outline"}
                className="px-4 py-2 rounded-lg text-appPrimary border-appPrimary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
                onClick={handleCreateComment}
              >
                Reply
              </Button>
            </div>
          </div>
        )
      );
    };

    return (
      <div>
        {renderUserInformation()}
        {renderContent()}
        {renderActions()}
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

      const handleSuccess = () => {
        setIsEdit(false);
        setEditContent("");
      };
      editCommentAPI(commentId, actualContent, handleSuccess);
    };

    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-start space-x-2">
          <AvatarIcon src={avatarUrl} alt={userName} />
          <textarea
            placeholder="Type your edit..."
            className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-white border-gray4/60 text-justify"
            rows={1}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant={"outline"}
            className="px-4 py-2 rounded-lg text-appPrimary border-appPrimary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button className="px-4 py-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90" onClick={handleEdit}>
            Edit
          </Button>
        </div>
      </div>
    );
  };

  return <div>{isEdit ? renderEditInput() : renderComment()}</div>;
};
