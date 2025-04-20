import { ProblemComment } from "./ProblemComment";
import { Button } from "@/components/ui/Button";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { useEffect, useState } from "react";
import { ProblemCommentsResponse, ProblemCommentType } from "@/features/Problem/types/ProblemCommentType";
import { useParams } from "react-router-dom";
import { problemAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/user/userSlice";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { RootState } from "@/redux/rootReducer";
import { ParentCommentContext, useCommentContext } from "@/hooks";

interface ISortBy {
  value: string;
  label: string;
}

export const ProblemCommentSection = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const sortBys: ISortBy[] = [
    {
      value: "createdAt,desc",
      label: "Most Recent"
    },
    {
      value: "numberOfLikes,desc",
      label: "Most Upvoted"
    },
    {
      value: "createdAt,asc",
      label: "Oldest"
    }
  ];
  const [sortByOpen, setSortByOpen] = useState(false);
  const [sortBy, setSortBy] = useState(sortBys[0].value);
  const [problemComments, setProblemComments] = useState<ProblemCommentType[]>([]);
  const [userComment, setUserComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const userId = useSelector(selectUserId); // Get userid from redux is faster than from localstorage
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect comment id
  const redirectedCommentId = useCommentContext().commentId;
  const [redirectedParentCommentId, setRedirectedParentCommentId] = useState<string | null>(null);

  const getComments = async (pageNumber: number = 0) => {
    if (!problemId) return;
    setIsLoading(true);

    // Fetch comments from API
    try {
      const response = await problemAPI.getProblemComments(userId, problemId, [sortBy], pageNumber); // Only single sort by
      const responseResult: ProblemCommentsResponse = response.result;
      const data = responseResult.content;

      setProblemComments(data);
      setCurrentPage(responseResult.number);
      setTotalPages(responseResult.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (redirectedCommentId) {
      // If redirectedCommentId is present, fetch the specific comment and its replies
      const fetchCommentAndReplies = async () => {
        try {
          if (!userId) return;
          const response = await problemAPI.getCommentParentAndChildren(redirectedCommentId, userId);
          const data = response.result;
          if (data.parentCommentId) {
            setRedirectedParentCommentId(data.parentCommentId);
            console.log("Parent comment ID:", data.parentCommentId);
            // If the comment has a parent, fetch the parent comment
            const parentResponse = await problemAPI.getCommentParentAndChildren(data.parentCommentId, userId);
            console.log("Parent comment response:", parentResponse);
            const parentData = parentResponse.result;

            setProblemComments([parentData]);
          } else {
            // If the comment does not have a parent, set it directly
            console.log("Parent comment ID not found");
            setProblemComments([data]);
          }
          setTotalPages(1);
        } catch (error) {
          console.error("Error fetching comment:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCommentAndReplies();
    } else {
      getComments();
    }
  }, [sortBy]);

  const handleSubmitComment = async () => {
    try {
      if (!problemId) return;

      if (!userComment) {
        toast({
          title: "Failed to comment",
          description: `Please type something to comment.`,
          variant: "destructive"
        });
        return;
      }

      if (!isAuthenticated) {
        toast({
          title: "Failed to comment",
          description: `Please log in to comment.`,
          variant: "destructive"
        });
      }

      const postCommentResponse = await problemAPI.postComment(userComment, problemId, null, null);
      const newTemporaryMessage: ProblemCommentType = {
        ...postCommentResponse.result,
        childrenComments: postCommentResponse.result.childrenComments || { content: [] } // Ensure childrenComments exists
      };

      // Dont have to refetch comments, just add new comment to the top
      // Use functional update to avoid potential state mutation issues
      setProblemComments((prevComments) => [newTemporaryMessage, ...prevComments]);
      setUserComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const refreshCommentReplies = async (commentId: string) => {
    try {
      if (!userId) return;

      const response = await problemAPI.getCommentParentAndChildren(commentId, userId);
      const updatedComment: ProblemCommentType = {
        ...response.result,
        childrenComments: response.result.childrenComments || { content: [] }
      };
      // Find and update the comment in the list with the new replies
      setProblemComments((prevComments) => {
        const updatedComments = prevComments.map((comment) =>
          comment.commentId === commentId ? { ...updatedComment } : comment
        );

        return [...updatedComments]; // Ensuring new reference
      });
    } catch (error) {
      console.log("Error refreshing comment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner loading />
      </div>
    );
  }

  return (
    <ParentCommentContext.Provider value={{ parentCommentId: redirectedParentCommentId }}>
      <div id="problem-comment-section" className="h-full px-6 py-6 overflow-y-auto">
        <div className="">
          <textarea
            placeholder="Type your comment..."
            className="w-full text-sm px-4 py-2 bg-white border rounded-lg resize-none max-h-[300px] overflow-y-scroll border-gray4/60 focus:outline-none"
            rows={1}
            value={userComment}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            onChange={(e) => setUserComment(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.ctrlKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => handleSubmitComment()}
              className="px-4 py-2 mt-2 font-semibold text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
            >
              Comment
            </Button>
          </div>
        </div>

        {/* SORT BY BUTTON */}
        <Popover open={sortByOpen} onOpenChange={setSortByOpen}>
          <PopoverTrigger asChild>
            <div
              role="combobox"
              aria-expanded={sortByOpen}
              className="w-[200px] flex text-sm space-x-2 items-center cursor-pointer"
            >
              <span className="font-normal">Sorted by:</span>
              <span className="font-semibold ">{sortBys.find((sortByItem) => sortByItem.value === sortBy)?.label}</span>
              <ChevronDown className="w-4 opacity-50" />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No sort item found.</CommandEmpty>
                <CommandGroup>
                  {sortBys.map((sortByItem) => (
                    <CommandItem
                      key={sortByItem.value}
                      value={sortByItem.value}
                      onSelect={(currentValue) => {
                        setSortBy(currentValue === sortBy ? "" : currentValue);
                        setSortByOpen(false);
                      }}
                    >
                      {sortByItem.label}
                      <Check className={sortBy === sortByItem.value ? "opacity-100" : "opacity-0"} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="mt-4">
          {problemComments.map((comment) => (
            <ProblemComment
              key={comment.commentId}
              comment={comment}
              updateCommentList={getComments}
              refreshCommentReplies={refreshCommentReplies}
            />
          ))}
        </div>

        {!problemComments.length && (
          <div>
            <p className="text-center text-gray3">No comments yet</p>
          </div>
        )}

        <div className="mb-12">
          {totalPages != 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => getComments(page)} />
          )}
        </div>
      </div>
    </ParentCommentContext.Provider>
  );
};
