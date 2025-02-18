import { useState } from "react";
import { ProblemReply } from "./ProblemReply";
import { BiUpvote, BiSolidUpvote, BiShare } from "rocketicons/bi";
import { FaRegComment } from "rocketicons/fa6";
import { Button } from "@/components/ui/shadcn/Button";

interface ProblemCommentProps {
  avatar: string;
  name: string;
  date: string;
  content: string;
  replies: { name: string; content: string; date: string }[];
}

export const ProblemComment = ({ avatar, name, date, content, replies }: ProblemCommentProps) => {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(100); // Default upvote count
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleUpvote = () => {
    setUpvoted(!upvoted);
    setUpvoteCount((prev) => (upvoted ? prev - 1 : prev + 1));
  };

  const renderUserReply = () => {
    return (
      <div className="mt-4 ml-8">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray5">
            {avatar ? <img src={avatar} alt="Avatar" className="object-cover w-full h-full rounded-full" /> : null}
          </div>

          <textarea
            placeholder="Type your reply..."
            className="w-full text-sm p-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-white border-gray4/60 text-justify"
            rows={1}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
          />
        </div>
        <div>
          <div className="flex justify-end space-x-2">
            <Button variant={"outline"} className="px-4 py-2 mt-2 rounded-lg text-appPrimary border-appPrimary">
              Cancel
            </Button>
            <Button className="px-4 py-2 mt-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90">
              Comment
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray5">
            {avatar ? <img src={avatar} alt="Avatar" className="object-cover w-full h-full rounded-full" /> : null}
          </div>
          <p className="text-lg font-semibold">{name}</p>
        </div>
        <p className="text-sm font-medium text-gray3">{date}</p>
      </div>

      {/* Comment Content */}
      <p className="mt-2 text-sm">{content}</p>

      {/* Actions (Upvote, Reply, Share) */}
      <div id="comment-actions" className="flex items-center mt-2 space-x-4">
        {/* Upvote Button */}
        <div className="flex items-center space-x-1 cursor-pointer" onClick={handleUpvote}>
          {upvoted ? (
            <BiSolidUpvote className="w-4 h-4 icon-appPrimary" />
          ) : (
            <BiUpvote className="w-4 h-4 icon-gray3 hover:text-black" />
          )}
          <p className="text-xs text-gray2 hover:text-black">{upvoteCount}</p>
        </div>

        {/* Show Replies Button */}
        <div onClick={() => setShowReplies(!showReplies)} className="flex items-center space-x-1 cursor-pointer">
          <FaRegComment className="w-4 h-4 icon-gray3 hover:text-black" />
          <p className="text-xs text-gray2 hover:text-black">
            {showReplies ? `Hide ${replies.length} replies` : `Show ${replies.length} replies`}
          </p>
        </div>

        {/* Share Button */}
        <div onClick={() => setIsReplying(!isReplying)} className="flex items-center space-x-1 cursor-pointer">
          <BiShare className="w-5 h-5 icon-gray3 hover:text-black" />
          <p className="text-xs text-gray2 hover:text-black">Reply</p>
        </div>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="mt-2">
          {replies.map((reply, index) => (
            <ProblemReply key={index} avatar={""} name={reply.name} content={reply.content} date={reply.date} />
          ))}
        </div>
      )}

      {/* User Reply */}
      {isReplying && renderUserReply()}
    </div>
  );
};
