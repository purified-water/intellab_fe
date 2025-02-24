import { ProblemComment } from "./ProblemComment";
import { Button } from "@/components/ui/shadcn/button";
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
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
interface ISortBy {
  value: string,
  label: string
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
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getComments = async (pageNumber: number = 0) => {
    if (!problemId) return;
    setIsLoading(true);

    // Fetch comments from API
    try {
      const response = await problemAPI.getProblemComments(userId, problemId, [sortBy], pageNumber); // Only single sort by
      const responseResult: ProblemCommentsResponse = response.result;
      const data = responseResult.content;
      console.log("Comments", data);

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
    getComments();
  }, [sortBy]);

  const handleSubmitComment = async () => {
    try {
      if (!problemId) return;

      if (!userComment) {
        toast({
          title: 'Failed to comment',
          description: `Please type something to comment.`,
          variant: 'destructive',
        });
        return;
      }

      if (!userId) {
        toast({
          title: 'Failed to comment',
          description: `Please log in to comment.`,
          variant: 'destructive',
        });
      }

      await problemAPI.postComment(userComment, problemId, null, null);

      // Update comments
      getComments();
    } catch (error) {
      console.log(error);
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
    <div id="problem-comment-section" className="h-full px-6 py-6 overflow-y-auto">
      <div className="">
        <textarea
          placeholder="Type your comment..."
          className="w-full text-sm px-4 py-2 bg-white border rounded-lg resize-none max-h-[300px] overflow-y-scroll border-gray4/60"
          rows={1}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          onChange={(e) => setUserComment(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmitComment();
            }
          }}
        />
        <div className="flex justify-end">
          <Button
            onClick={() => handleSubmitComment()}
            className="px-4 py-2 mt-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
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
        {problemComments.map((comment, index) => (
          <ProblemComment key={index} comment={comment} updateCommentList={getComments} />
        ))}
      </div>
      <div className="mb-12">
        {totalPages != 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => getComments(page)}
          />
        )}
      </div>
    </div>
  );
};
