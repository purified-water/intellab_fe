import { useEffect, useState } from "react";
import { BiUpvote, BiSolidUpvote, BiShare } from "rocketicons/bi";
import { Button } from "@/components/ui/shadcn/Button";
import { AvatarIcon, AlertDialog } from "@/components/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useToast } from "@/hooks/use-toast";
import { TComment, ICourse } from "@/features/Course/types";
import { formatDateTime } from "@/utils";
import { showToastError } from "@/utils/toastUtils";
import { Trash2, Pencil } from "lucide-react";
import { getUserIdFromLocalStorage } from "@/utils";
import { useNavigate } from "react-router-dom";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";

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
  createCommentAPI: (
    courseId: string,
    content: string,
    replyCommentId: string | null,
    parentCommentId: string | null,
    onSuccess: () => void
  ) => Promise<void>;
  deleteCommentAPI: (comment: TComment) => Promise<void>;
  editCommentAPI: (commentId: string, content: string, onSuccess: () => void) => Promise<void>;
  upvoteCommentAPI: (commentId: string) => Promise<void>;
  cancelUpvoteCommentAPI: (commentId: string) => Promise<void>;
};

export const CommentReply = (props: CommentReplyProps) => {
  const {
    replyComment,
    enrolledCourse,
    createCommentAPI,
    deleteCommentAPI,
    editCommentAPI,
    upvoteCommentAPI,
    cancelUpvoteCommentAPI
  } = props;

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

  const isOwner = userUid == localUserUid;

  const [isReply, setIsReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editReplyContent, setEditReplyContent] = useState("");

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
      let actualContent = null;
      if (parentCommentId == repliedCommentId) {
        // reply is first level
        actualContent = content;
      } else {
        // reply is second level and above
        const parsedReply = parseReplyContent(content);
        actualContent = (
          <>
            <span className="font-semibold text-appPrimary">@{parsedReply?.userName}</span>
            <span> {parsedReply?.replyContent}</span>
          </>
        );
      }

      return <div className="mt-2 text-sm">{actualContent}</div>;
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
              showToastError({ toast: toast.toast, message: "Please enroll in the course to upvote" });
            }
          } else {
            showToastError({ toast: toast.toast, message: "Please login to upvote" });
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

      const renderReplyButton = () => {
        const handleReply = () => {
          if (isAuthenticated) {
            if (userEnrolled) {
              setIsReply(true);
            } else {
              showToastError({ toast: toast.toast, message: "Please enroll in the course to reply" });
            }
          } else {
            showToastError({ toast: toast.toast, message: "Please login to reply" });
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
        const actualContent = replyContent.trim();
        const actualParentCommentId = parentCommentId ?? commentId;
        const handleSuccess = () => {
          setIsReply(false);
          setReplyContent("");
        };
        createCommentAPI(courseId, actualContent, commentId, actualParentCommentId, handleSuccess);
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
                onClick={handleReply}
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
      const actualContent = editReplyContent.trim();

      const handleSuccess = () => {
        setIsEdit(false);
        setEditReplyContent("");
      };
      editCommentAPI(commentId, actualContent, handleSuccess);
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

  return isEdit ? renderEditInput() : renderReplyComment();
};
