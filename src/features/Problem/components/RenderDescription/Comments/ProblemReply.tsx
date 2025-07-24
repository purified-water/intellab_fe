import { ProblemCommentType } from "@/features/Problem/types/ProblemCommentType";
import { formatDateInProblem } from "@/utils";
import { useState } from "react";
import { BiUpvote, BiSolidUpvote, BiShare } from "rocketicons/bi";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/user/userSlice";
import { problemAPI } from "@/lib/api/problemApi";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/rootReducer";
import { AvatarIcon } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useCommentContext } from "@/hooks";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
interface ProblemReplyProps {
  reply: ProblemCommentType;
  updateCommentList: () => void;
  refreshCommentReplies: (commentId: string) => void;
}

export const ProblemReply = ({ reply, updateCommentList, refreshCommentReplies }: ProblemReplyProps) => {
  const userId = useSelector(selectUserId);
  const { problemId } = useParams<{ problemId: string }>();
  const { toast } = useToast();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);
  // Upvote
  const [upVoted, setUpVoted] = useState(reply.isUpVoted);
  const [temporaryUpvoteCount, setTemporaryUpvoteCount] = useState(reply.numberOfLikes);
  // Replying second level comments
  const [secondLevelReplyContent, setSecondLevelReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  // For editing comment
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);

  const navigate = useNavigate();

  // Highlight comment
  const redirectedCommentId = useCommentContext().commentId;

  const handleUpvote = async () => {
    if (userId === reply.userUid) return;

    try {
      if (upVoted) {
        await problemAPI.postRemoveUpvoteComment(reply.commentId);
        setTemporaryUpvoteCount((prev) => prev - 1);
      } else {
        await problemAPI.postUpvoteComment(reply.commentId);
        setTemporaryUpvoteCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
      return;
    }
    setUpVoted(!upVoted);
  };

  const handleSecondLevelCommentReply = async () => {
    if (!reply || !problemId) return;

    if (!secondLevelReplyContent) {
      toast({
        title: "Failed to comment",
        description: `Please type something to comment.`,
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Failed to reply",
        description: "Login to reply",
        variant: "destructive"
      });
    }

    try {
      // parentCommentID is the main comment
      // replyingToCommentID is the second level comment that we're replying to
      await problemAPI.postComment(secondLevelReplyContent, problemId, reply.parentCommentId, reply.commentId);

      // Update the comment reply list only
      refreshCommentReplies(reply.parentCommentId!);

      // Update UI
      setIsReplying(false);
      setSecondLevelReplyContent("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to reply",
        description: "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleEditComment = async () => {
    try {
      if (!editedContent) {
        toast({
          title: "Failed to edit comment",
          description: `Please type something to edit.`,
          variant: "destructive"
        });
        return;
      }

      const response = await problemAPI.putEditComment(reply.commentId, editedContent);
      // Can call updateCommentList() here to update the comment list but we gonna use the editedContent state to save the edit
      // If user refresh - the comment will be updated, rather update right after every edit
      setIsEditing(false);
      setEditedContent(response.result.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveComment = async () => {
    if (!reply) return;
    try {
      await problemAPI.deleteComment(reply.commentId);
      // Call updateCommentList right after deleting the comment to show new state
      updateCommentList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUsernameClick = () => {
    if (reply.userUid) {
      navigate(`/profile/${reply.userUid}`);
    }
  };

  const renderUserReply = () => {
    return (
      <div className="mt-4">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray5">
            {user?.photoUrl ? <AvatarIcon src={user.photoUrl} alt="Avatar" /> : null}
          </div>

          <textarea
            placeholder="Type your reply..."
            className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-hidden bg-white border-gray4/60 text-justify focus:outline-none"
            rows={1}
            value={secondLevelReplyContent} // Ensure value is controlled
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              const newHeight = e.currentTarget.scrollHeight;
              const maxHeight = 300; // 300px to match max-h-[300px]

              if (newHeight <= maxHeight) {
                e.currentTarget.style.height = `${newHeight}px`;
                e.currentTarget.style.overflowY = "hidden";
              } else {
                e.currentTarget.style.height = `${maxHeight}px`;
                e.currentTarget.style.overflowY = "auto";
              }
            }}
            onChange={(e) => setSecondLevelReplyContent(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                handleSecondLevelCommentReply();
              }
            }}
          />
        </div>
        <div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setIsReplying(false);
                setSecondLevelReplyContent("");
              }}
              variant={"outline"}
              className="px-4 py-2 mt-2 rounded-lg text-appPrimary border-appPrimary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSecondLevelCommentReply}
              className="px-4 py-2 mt-2 font-semibold text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col mt-4 ml-8">
      <div
        id={`comment-${reply.commentId}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`flex items-start space-x-2 reply-component ${redirectedCommentId === reply.commentId ? "bg-appInfo/10 rounded-lg p-2" : ""}`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray5">
          {reply.userAvatar ? (
            <img
              src={reply.userAvatar}
              alt="Avatar"
              className="object-cover w-full h-full rounded-full"
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            />
          ) : (
            <img src={DEFAULT_AVATAR} alt="Avatar" className="object-cover w-full h-full rounded-full" />
          )}
        </div>

        <div className="flex-col w-full gap-y-4">
          <div className="w-full text-sm px-4 py-2 border rounded-lg resize-none max-h-[300px] overflow-y-auto bg-gray6">
            <div id="reply-info" className="flex items-center justify-between">
              <p onClick={handleUsernameClick} className="font-semibold cursor-pointer hover:text-appPrimary">
                {reply.username ? reply.username : "User"}
              </p>
              <p className="text-xs font-medium text-gray3">
                {reply.isModified
                  ? `Edited at ${formatDateInProblem(reply.lastModifiedAt, { monthFormat: "short" })}`
                  : formatDateInProblem(reply.createdAt, { monthFormat: "short" })}
              </p>
            </div>
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-hidden bg-white border-gray4/60 focus:outline-none"
                  value={editedContent}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    const newHeight = e.currentTarget.scrollHeight;
                    const maxHeight = 300; // 300px to match max-h-[300px]

                    if (newHeight <= maxHeight) {
                      e.currentTarget.style.height = `${newHeight}px`;
                      e.currentTarget.style.overflowY = "hidden";
                    } else {
                      e.currentTarget.style.height = `${maxHeight}px`;
                      e.currentTarget.style.overflowY = "auto";
                    }
                  }}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={2}
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(reply.content);
                    }}
                    variant="outline"
                    className="px-4 py-2 rounded-lg text-appPrimary border-appPrimary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditComment}
                    className="px-4 py-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-black">
                {editedContent.split(/\[@(.*?)\]/g).map((part, index) =>
                  editedContent.includes(`[@${part}]`) ? (
                    <span key={index} className="font-semibold text-appPrimary">
                      @{part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </p>
            )}
          </div>

          <div id="comment-actions" className="flex items-center mt-2 space-x-4">
            {/* Upvote Button */}
            <div className="flex items-center space-x-1 cursor-pointer" onClick={handleUpvote}>
              {upVoted ? (
                <BiSolidUpvote className="w-4 h-4 icon-appPrimary" />
              ) : (
                <BiUpvote className="w-4 h-4 icon-gray3 hover:text-black" />
              )}
              <p className="text-xs text-gray2 hover:text-black">{temporaryUpvoteCount}</p>
            </div>

            {/* Share Button */}
            <div
              onClick={() => {
                if (!userId) return;
                setIsReplying(true);
                setSecondLevelReplyContent(`[@${reply.username ? reply.username : "user"}] `); // Prepend the format [@<username>]
              }}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <BiShare className="w-5 h-5 icon-gray3 hover:text-black" />
              <p className="text-xs text-gray2 hover:text-black">Reply</p>
            </div>
            {isHovering && userId === reply.userUid && (
              <div className="flex space-x-4 edit-delete-buttons">
                <div onClick={() => setIsEditing(true)} className="flex items-center space-x-1 cursor-pointer">
                  <Pencil className="w-4 h-4 text-gray3 hover:text-black" />
                  <p className="text-xs text-gray2 hover:text-black">Edit</p>
                </div>

                <div onClick={handleRemoveComment} className="flex items-center space-x-1 cursor-pointer">
                  <Trash2 className="w-4 h-4 text-gray3 hover:text-black" />
                  <p className="text-xs text-gray2 hover:text-black">Delete</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Reply */}
      {isReplying && renderUserReply()}
    </div>
  );
};
