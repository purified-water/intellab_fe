import { useState, useEffect } from "react";
import { ProblemReply } from "./ProblemReply";
import { BiUpvote, BiSolidUpvote, BiShare } from "rocketicons/bi";
import { Pencil, Trash2 } from "lucide-react";
import { FaRegComment } from "rocketicons/fa6";
import { Button, AlertDialog, AvatarIcon } from "@/components/ui";
import { ProblemCommentType, ProblemCommentsResponse } from "@/features/Problem/types/ProblemCommentType";
import { formatDateInProblem } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/user/userSlice";
import { problemAPI } from "@/lib/api/problemApi";
import { useParams } from "react-router-dom";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";
import { useCommentContext, useParentCommentContext } from "@/hooks";

interface ProblemCommentProps {
  comment: ProblemCommentType;
  updateCommentList: () => void;
  refreshCommentReplies: (commentId: string) => void;
}

export const ProblemComment = ({ comment, updateCommentList, refreshCommentReplies }: ProblemCommentProps) => {
  const { toast } = useToast();
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);

  const { problemId } = useParams<{ problemId: string }>();
  // Upvote
  const [upVoted, setUpVoted] = useState(comment.isUpVoted);
  const [temporaryUpvoteCount, setTemporaryUpvoteCount] = useState(comment.numberOfLikes);
  const [showReplies, setShowReplies] = useState(false);
  // Replying comment
  const [isReplying, setIsReplying] = useState(false);
  const [mainReplyContent, setMainReplyContent] = useState("");
  let commentReplyList: ProblemCommentType[] = [];
  // For editing comment
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [replyList, setReplyList] = useState<ProblemCommentType[]>(comment.childrenComments?.content || []);
  // Pagination
  const [currentPage, setCurrentPage] = useState(comment.childrenComments?.number ?? 0);
  const [totalPages] = useState(comment.childrenComments?.totalPages ?? 0);
  // Navigation
  const navigate = useNavigate();

  // For highlighting the comment when redirected
  const redirectedCommentId = useCommentContext().commentId;
  const redirectedParentCommentId = useParentCommentContext().parentCommentId;

  const handleLoadMoreReplies = async (pageNumber: number = 0) => {
    try {
      const response = await problemAPI.getSecondLevelReplies(comment.commentId, pageNumber);
      const responseResult: ProblemCommentsResponse = response.result;
      const data = responseResult.content;

      setReplyList((prev) => [...prev, ...data]);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  if (comment.childrenComments) {
    const commentReplyResult: ProblemCommentsResponse = comment.childrenComments;
    commentReplyList = commentReplyResult.content;
  }

  const handleUpvote = async () => {
    if (userId === comment.userUid) return;

    try {
      if (upVoted) {
        await problemAPI.postRemoveUpvoteComment(comment.commentId);
        setTemporaryUpvoteCount((prev) => prev - 1);
      } else {
        await problemAPI.postUpvoteComment(comment.commentId);
        setTemporaryUpvoteCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
      return;
    }
    setUpVoted(!upVoted);
  };

  useEffect(() => {
    // This will update the UI when a new reply is added, ensure React re-renders the component
    setReplyList(comment.childrenComments?.content || []);
  }, [comment.childrenComments]);

  useEffect(() => {
    if (redirectedParentCommentId !== null) {
      setShowReplies(true);
    }
  }, [redirectedCommentId]);

  const handleMainCommentReply = async () => {
    if (!comment || !problemId) return;

    if (!mainReplyContent) {
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
      // parentCommentID = replyingToCommentID because we're replying to the parent comment
      await problemAPI.postComment(mainReplyContent, problemId, comment.commentId, comment.commentId);
      // Cant direcly use the response from the post request because it doesn't return the childrenComments
      // Small delay to ensure API updates before fetching
      setTimeout(() => {
        refreshCommentReplies(comment.commentId); // Get the latest replies
      }, 100);
      // Update UI
      setIsReplying(false);
      setShowReplies(true);
      setMainReplyContent("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to reply",
        description: "An error occured",
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

      const response = await problemAPI.putEditComment(comment.commentId, editedContent);
      // Can call updateCommentList() here to update the comment list but we gonna use the editedContent state to save the edit
      // If user refresh - the comment will be updated, rather update right after every edit
      setIsEditing(false);
      setEditedContent(response.result.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveComment = async () => {
    if (!comment) return;
    try {
      await problemAPI.deleteComment(comment.commentId);
      // Call updateCommentList right after deleting the comment to show new state
      updateCommentList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUsernameClick = () => {
    if (comment.userUid) {
      navigate(`/profile/${comment.userUid}`);
    }
  };

  const renderCommentReplies = () => {
    return (
      showReplies &&
      commentReplyList &&
      commentReplyList.length > 0 && (
        <>
          <div className="mt-2">
            {replyList.map((reply, index) => (
              <ProblemReply
                key={index}
                reply={reply}
                updateCommentList={updateCommentList}
                refreshCommentReplies={refreshCommentReplies}
              />
            ))}
          </div>

          {comment.childrenComments && totalPages > 1 && currentPage < totalPages && (
            <div className="flex justify-center mt-2">
              <div
                onClick={() => handleLoadMoreReplies(currentPage)}
                className="px-4 py-2 text-sm cursor-pointer text-appPrimary"
              >
                Load More Replies
              </div>
            </div>
          )}
        </>
      )
    );
  };

  const renderUserReply = () => {
    return (
      <div className="mt-4 ml-8">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray5">
            {user?.photoUrl ? <AvatarIcon src={user.photoUrl} alt="Avatar" /> : null}
          </div>

          <textarea
            placeholder="Type your reply..."
            className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-white border-gray4/60 text-justify focus:outline-none"
            rows={1}
            value={mainReplyContent}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            onChange={(e) => setMainReplyContent(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                handleMainCommentReply();
              }
            }}
          />
        </div>
        <div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setIsReplying(false)}
              variant="outline"
              className="px-4 py-2 mt-2 rounded-lg text-appPrimary border-appPrimary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMainCommentReply}
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
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="mb-8 comment-component"
      id={`comment-${comment.commentId}`}
    >
      <div className={`${redirectedCommentId === comment.commentId ? "bg-appInfo/10 rounded-lg p-4" : ""}`}>
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray5">
              {comment.userAvatar ? (
                <img src={comment.userAvatar} alt="Avatar" className="object-cover w-full h-full rounded-full" />
              ) : null}
            </div>
            <p onClick={handleUsernameClick} className="text-lg font-semibold cursor-pointer hover:text-appPrimary">
              {comment.username ? comment.username : "User"}
            </p>
          </div>
          <p className="text-sm font-medium text-gray3">
            {comment.isModified
              ? `Edited at ${formatDateInProblem(comment.lastModifiedAt, { monthFormat: "short" })}`
              : formatDateInProblem(comment.createdAt, { monthFormat: "short" })}
          </p>
        </div>

        {/* Comment Content / Edit Mode */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-white border-gray4/60 focus:outline-none"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={2}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <Button
                onClick={() => setIsEditing(false)}
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
          <p className="mt-2 text-sm">{editedContent}</p>
        )}

        {/* Actions (Upvote, Reply, Share) */}
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

          {/* Show Replies Button */}
          <div onClick={() => setShowReplies(!showReplies)} className="flex items-center space-x-1 cursor-pointer">
            <FaRegComment className="w-4 h-4 icon-gray3 hover:text-black" />
            {replyList.length > 0 ? (
              <p className="text-xs text-gray2 hover:text-black">
                {showReplies ? `Hide ${commentReplyList.length} replies` : `Show ${commentReplyList.length} replies`}
              </p>
            ) : null}
          </div>

          {/* Share Button */}
          <div
            onClick={() => {
              if (!userId) return;
              setIsReplying(true);
            }}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <BiShare className="w-5 h-5 icon-gray3 hover:text-black" />
            <p className="text-xs text-gray2 hover:text-black">Reply</p>
          </div>

          {isHovering && userId === comment.userUid && (
            <div className="flex space-x-4 edit-delete-buttons">
              <div onClick={() => setIsEditing(true)} className="flex items-center space-x-1 cursor-pointer">
                <Pencil className="w-4 h-4 text-gray3 hover:text-black" />
                <p className="text-xs text-gray2 hover:text-black">Edit</p>
              </div>

              <AlertDialog
                title={"Delete comment"}
                message={"Are you sure you want to delete this comment?"}
                onConfirm={() => handleRemoveComment()}
              >
                <div className="flex items-center space-x-1 cursor-pointer">
                  <Trash2 className="w-4 h-4 text-gray3 hover:text-black" />
                  <p className="text-xs text-gray2 hover:text-black">Delete</p>
                </div>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      {/* Replies Section */}
      {renderCommentReplies()}

      {/* User Reply */}
      {isReplying && renderUserReply()}
    </div>
  );
};
