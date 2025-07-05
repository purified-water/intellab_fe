import { ICourse, TCourseFilter } from "@/types";
import { CourseListItem } from "./CourseListItem";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks";
import { courseAPI } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/utils";
import { AlertDialog, EmptyList, Pagination } from "@/components/ui";
import { useDeleteCourseImage } from "../../hooks";

const TABLE_HEADERS = {
  COURSE_NAME: "Course Name",
  LEVEL: "Level",
  PRICE: "Price",
  AVAILABLE: "Published",
  ENROLLMENTS: "Enrollments",
  RATING: "Rating",
  CREATED_AT: "Created At",
  CURRENT_STEP: "Current Step"
};

interface CourseListProps {
  filter: TCourseFilter;
}

export function CourseList(props: CourseListProps) {
  const { filter } = props;
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<ICourse | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();
  const deleteCourseImage = useDeleteCourseImage();

  const filterCoursesByPrice = (courses: ICourse[]) => {
    if (!filter.priceRange) {
      return courses;
    } else {
      return courses.filter((course) => {
        const isValid =
          course.price && course.price >= filter.priceRange!.min! && course.price <= filter.priceRange!.max!;
        return isValid;
      });
    }
  };

  const getCourseForAdminAPI = async (page: number) => {
    await courseAPI.getCourseForAdmin({
      query: { filter: filter, page },
      onStart: async () => setLoading(true),
      onSuccess: async (response) => {
        setCurrentPage(response.number);
        if (!totalPages) {
          setTotalPages(response.totalPages);
        } else {
          if (response.totalPages == 0) {
            setTotalPages(null);
          } else if (response.totalPages != totalPages) {
            setTotalPages(response.totalPages);
          }
        }
        setCourses(response.content);
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  const deleteCourseAPI = async (course: ICourse) => {
    setDeleting(true);
    if (course.courseImage) {
      await deleteCourseImage.mutateAsync({ courseId: course.courseId });
    }
    await courseAPI.deleteCourse({
      query: { courseId: course.courseId },
      onSuccess: async (result) => {
        if (result) {
          setCourses((prevCourses) => prevCourses.filter((item) => item.courseId !== course.courseId));
          setOpenDeleteDialog(false);
          showToastSuccess({ toast: toast.toast, message: result });
        } else {
          showToastError({ toast: toast.toast, message: "Failed to delete course" });
        }
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
    setDeleting(false);
  };

  useEffect(() => {
    getCourseForAdminAPI(currentPage);
  }, [filter]);

  // Handling when switching to other tab with invalid page number
  useEffect(() => {
    if (totalPages && currentPage >= totalPages) {
      setCurrentPage(0);
      getCourseForAdminAPI(0);
    }
  }, [currentPage, totalPages]);

  const handleToggleCourseAvailability = (courseId: string, newAvailableStatus: boolean) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.courseId === courseId) {
          return { ...course, isAvailable: newAvailableStatus };
        }
        return course;
      })
    );
  };

  const handleDeleteCourse = (course: ICourse) => {
    setDeletingCourse(course);

    // Prevent focus management conflict between the alert-dialog and dropdown-menu of shadcn
    // If don't use setTimeout, the app will lose all focus after opening the alert-dialog
    setTimeout(() => {
      setOpenDeleteDialog(true);
    }, 0);
  };

  const renderHeader = () => {
    return (
      <thead>
        <tr className="font-normal text-left border-t border-b border-gray5">
          <th className="py-4">
            <div className="flex items-center">{TABLE_HEADERS.COURSE_NAME}</div>
          </th>
          <th>
            <div className="flex items-center">{TABLE_HEADERS.LEVEL}</div>
          </th>
          <th>
            <div className="flex items-center">{TABLE_HEADERS.PRICE}</div>
          </th>
          {filter.isCompletedCreation && (
            <th>
              <div className="flex items-center justify-center">{TABLE_HEADERS.AVAILABLE}</div>
            </th>
          )}
          {filter.isCompletedCreation && (
            <th>
              <div className="flex items-center justify-center">{TABLE_HEADERS.ENROLLMENTS}</div>
            </th>
          )}
          {filter.isCompletedCreation && (
            <th>
              <div className="flex items-center justify-center">{TABLE_HEADERS.RATING}</div>
            </th>
          )}
          {!filter.isCompletedCreation && (
            <th>
              <div className="flex items-center justify-center">{TABLE_HEADERS.CREATED_AT}</div>
            </th>
          )}
          {!filter.isCompletedCreation && (
            <th>
              <div className="flex items-center justify-center">{TABLE_HEADERS.CURRENT_STEP}</div>
            </th>
          )}
          <th />
        </tr>
      </thead>
    );
  };

  const renderEmpty = () => {
    return (
      <tr className="text-base font-normal text-gray3">
        <td colSpan={8} className="py-5 text-center">
          <EmptyList message="No courses found." />
        </td>
      </tr>
    );
  };

  const renderLoading = () => {
    const placeHolder = [0, 1, 2, 3, 4];
    return placeHolder.map((_, index) => (
      <CourseListItem
        key={index}
        course={{} as ICourse}
        loading={true}
        onToggleCourseAvailability={handleToggleCourseAvailability}
        onDeleteCourse={handleDeleteCourse}
      />
    ));
  };

  const renderItems = () => {
    return courses.map((course) => (
      <CourseListItem
        key={course.courseId}
        course={course}
        loading={false}
        onToggleCourseAvailability={handleToggleCourseAvailability}
        onDeleteCourse={handleDeleteCourse}
      />
    ));
  };

  const renderBody = () => {
    let content = null;
    if (loading) {
      content = renderLoading();
    } else if (courses.length === 0) {
      content = renderEmpty();
    } else {
      content = renderItems();
    }

    return <tbody>{content}</tbody>;
  };

  const renderDeleteDialog = () => {
    return (
      <AlertDialog
        open={openDeleteDialog}
        title="You are about to delete the course"
        message="This action is irreversible. Once the course is deleted, it cannot be recovered."
        onConfirm={() => deleteCourseAPI(deletingCourse!)}
        onCancel={() => setOpenDeleteDialog(false)}
        processing={deleting}
      />
    );
  };

  const renderPagination = () => {
    let content = null;
    if (totalPages && totalPages != 0) {
      content = (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => getCourseForAdminAPI(page)}
        />
      );
    }

    return content;
  };

  return (
    <div className="p-0">
      <table className="w-full">
        {renderHeader()}
        {renderBody()}
      </table>
      {renderPagination()}
      {renderDeleteDialog()}
    </div>
  );
}
