import { useEffect, useState } from "react";
import { CourseComment } from "./CourseComment";
import { Button } from "@/components/ui/shadcn/Button";
import { Spinner, SortByButton, ISortByItem, Pagination } from "@/components/ui";
import { TComment } from "@/features/Course/types";
import { useToast } from "@/hooks/use-toast";
import { courseAPI } from "@/lib/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { showToastError, getUserIdFromLocalStorage, isEmptyString } from "@/utils";
import { ICourse } from "@/types";
import * as commentStore from "@/redux/comment/commentSlice";

const SORT_ITEMS: ISortByItem[] = [
  {
    value: "created,desc",
    label: "Most Recent"
  },
  {
    value: "numberOfLikes,desc",
    label: "Most Upvoted"
  },
  {
    value: "created,asc",
    label: "Oldest"
  }
];

type CourseCommentSectionProps = {
  course: ICourse;
};

export const CourseCommentSection = (props: CourseCommentSectionProps) => {
  const { course } = props;
  const { courseId, userEnrolled } = course;

  const comments = useSelector((state: RootState) => state.comment.comments);

  const toast = useToast();
  const dispatch = useDispatch();
  const userUid = getUserIdFromLocalStorage();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [sortingValue, setSortingValue] = useState(SORT_ITEMS[0].value);
  const [loading, setLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const getCommentsAPI = async (page: number) => {
    await courseAPI.getCourseComments({
      query: {
        courseId,
        userUid,
        page,
        sort: sortingValue
      },
      onStart: async () => setSpinnerVisible(true),
      onSuccess: async (data) => {
        setCurrentPage(data.number);
        if (!totalPages) {
          setTotalPages(data.totalPages);
        } else {
          if (data.totalPages == 0) {
            setTotalPages(null);
          } else if (data.totalPages != totalPages) {
            setTotalPages(data.totalPages);
          }
        }
        dispatch(commentStore.setComments(data.content));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setSpinnerVisible(false)
    });
  };

  const createCommentAPI = async (courseId: string, content: string) => {
    const actualContent = content.trim();
    await courseAPI.createComment({
      query: { courseId },
      body: {
        content: actualContent,
        repliedCommentId: null,
        parentCommentId: null
      },
      onStart: async () => setLoading(true),
      onSuccess: async (data) => {
        setCommentContent("");
        dispatch(commentStore.createComment(data));
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  const deleteCommentAPI = async (comment: TComment) => {
    await courseAPI.deleteComment({
      query: { commentId: comment.commentId },
      onStart: async () => setLoading(true),
      onSuccess: async (data) => {
        if (data) {
          if (comment.parentCommentId) {
            // the comment is a child comment
            dispatch(commentStore.deleteComment(comment));
          } else {
            // the comment is a parent comment
            await getCommentsAPI(currentPage);
          }
        } else {
          showToastError({ toast: toast.toast, message: "Error deleting comment" });
        }
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  useEffect(() => {
    return () => {
      dispatch(commentStore.setComments([]));
    };
  }, []);

  useEffect(() => {
    getCommentsAPI(currentPage);
  }, [sortingValue, isAuthenticated]);

  const renderCommentInput = () => {
    const handleCreateComment = (content: string) => {
      if (!isAuthenticated) {
        showToastError({ toast: toast.toast, title: "Login required", message: "You must be logged in to comment" });
      } else if (!userEnrolled) {
        showToastError({
          toast: toast.toast,
          title: "Enrollment required",
          message: "You must enroll in this course to comment"
        });
      } else if (isEmptyString(content)) {
        showToastError({ toast: toast.toast, message: "Comment cannot be empty" });
      } else {
        createCommentAPI(courseId, content);
      }
    };

    return (
      <div>
        <textarea
          placeholder="Type your comment..."
          className="w-full text-sm px-4 py-2 bg-white border rounded-lg resize-none max-h-[300px] overflow-y-scroll border-gray4/60 focus:outline-none"
          rows={1}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end">
          <Button
            className="px-4 py-2 mt-2 font-semibold text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
            onClick={() => handleCreateComment(commentContent)}
            disabled={loading}
          >
            Comment
          </Button>
        </div>
      </div>
    );
  };

  const renderSortingButton = () => {
    return <SortByButton items={SORT_ITEMS} selectedValue={sortingValue} onSelect={setSortingValue} />;
  };

  const renderComments = () => {
    let content = null;

    if (!loading || comments.length > 0) {
      if (comments.length == 0) {
        content = (
          <div className="justify-items-center">
            <p className="mt-10 text-xl text-gray3">No comments yet</p>
          </div>
        );
      } else {
        content = (
          <div className="space-y-8">
            {comments.map((comment, index) => (
              <CourseComment
                key={index}
                comment={comment}
                enrolledCourse={course}
                deleteCommentAPI={deleteCommentAPI}
              />
            ))}
          </div>
        );
      }
    }
    return content;
  };

  const renderPagination = () => {
    let content = null;
    if (totalPages && totalPages != 0) {
      content = (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => getCommentsAPI(page)} />
      );
    }

    return content;
  };

  const renderSpinner = () => {
    return <Spinner loading={spinnerVisible} overlay />;
  };

  return (
    <div>
      <div className="px-6 space-y-3 overflow-y-auto">
        {renderCommentInput()}
        {renderSortingButton()}
        {renderComments()}
        {renderPagination()}
      </div>
      {renderSpinner()}
    </div>
  );
};
