import { useEffect, useState } from "react";
import { CourseComment } from "./CourseComment";
import { Button } from "@/components/ui/shadcn/Button";
import { Spinner, SortByButton, ISortByItem, Pagination } from "@/components/ui";
import { ICourse, TComment } from "@/features/Course/types";
import { useToast } from "@/hooks/use-toast";
import { courseAPI } from "@/lib/api";
import { API_RESPONSE_CODE } from "@/constants";
import { showToastError } from "@/utils/toastUtils";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { getUserIdFromLocalStorage } from "@/utils";
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

  const getCommentsAPI = async (page: number) => {
    if (!loading) {
      setLoading(true);
    }
    try {
      const response = await courseAPI.getCourseComments(courseId, userUid, page, sortingValue);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS && result) {
        dispatch(commentStore.setComments(result.content));
        setCurrentPage(result.number);
        if (!totalPages) {
          setTotalPages(result.totalPages);
        }
      } else {
        if (comments.length > 0) {
          dispatch(commentStore.setComments([]));
        }
        showToastError({ toast: toast.toast, message: message ?? "Error fetching comments" });
      }
    } catch (e: any) {
      if (comments.length > 0) {
        dispatch(commentStore.setComments([]));
      }
      showToastError({ toast: toast.toast, message: e.message ?? "Error fetching comments" });
    } finally {
      setLoading(false);
    }
  };

  const createCommentAPI = async (
    courseId: string,
    content: string,
    repliedCommentId: string | null,
    parentCommentId: string | null,
    onSuccess: () => void
  ) => {
    const actualContent = content.trim();
    setLoading(true);
    try {
      const response = await courseAPI.createComment(courseId, actualContent, repliedCommentId, parentCommentId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS && result) {
        onSuccess();
        dispatch(commentStore.createComment(result));
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error creating comment" });
        setLoading(false);
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error creating comment" });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteCommentAPI = async (comment: TComment) => {
    setLoading(true);
    try {
      const response = await courseAPI.deleteComment(comment.commentId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS && result) {
        if (comment.parentCommentId) {
          // the comment is a child comment
          dispatch(commentStore.deleteComment(comment));
          setLoading(false);
        } else {
          // the comment is a parent comment
          getCommentsAPI(currentPage);
        }
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error deleting comment" });
        setLoading(false);
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error deleting comment" });
      setLoading(false);
    }
  };

  const editCommentAPI = async (commentId: string, content: string, onSuccess: () => void) => {
    setLoading(true);
    try {
      const response = await courseAPI.modifyComment(commentId, content);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS && result) {
        onSuccess();
        dispatch(commentStore.editComment(result));
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error editing comment" });
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error editing comment" });
    } finally {
      setLoading(false);
    }
  };

  const getRepliesAPI = async (commentId: string, size: number) => {
    setLoading(true);
    try {
      const response = await courseAPI.getCommentChildren(commentId, userUid, size);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS && result) {
        dispatch(commentStore.setReplies({ commentId, replies: result.content }));
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error fetching replies" });
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error fetching replies" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(commentStore.setComments([]));
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      getCommentsAPI(currentPage);
    }
  }, [sortingValue, isAuthenticated]);

  const renderCommentInput = () => {
    const handleCreateComment = (content: string) => {
      const handleSuccess = () => {
        setCommentContent("");
      };

      if (isAuthenticated) {
        if (userEnrolled) {
          if (content.length > 0) {
            createCommentAPI(courseId, content, null, null, handleSuccess);
          } else {
            showToastError({ toast: toast.toast, message: "Comment cannot be empty" });
          }
        } else {
          showToastError({ toast: toast.toast, message: "You must enroll in this course to comment" });
        }
      } else {
        showToastError({ toast: toast.toast, message: "Login required" });
      }
    };

    return (
      <div>
        <textarea
          placeholder="Type your comment..."
          className="w-full text-sm px-4 py-2 bg-white border rounded-lg resize-none max-h-[300px] overflow-y-scroll border-gray4/60"
          rows={1}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            className="px-4 py-2 mt-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90"
            onClick={() => handleCreateComment(commentContent)}
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
                createCommentAPI={createCommentAPI}
                deleteCommentAPI={deleteCommentAPI}
                editCommentAPI={editCommentAPI}
                getRepliesAPI={getRepliesAPI}
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
    return <Spinner loading={loading} overlay />;
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
