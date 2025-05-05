import { ICourse, TCourseFilter } from "@/types";
import { ListFilter } from "lucide-react";
import { CourseListItem } from "./CourseListItem";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks";
import { courseAPI } from "@/lib/api";
import { showToastError } from "@/utils";
import { DeleteSuccessfulDialog } from "./DeleteSuccessfulDialog";

const TABLE_HEADERS = {
  ID: "ID",
  COURSE_NAME: "Course Name",
  LEVEL: "Level",
  PRICE: "Price",
  AVAILABLE: "Available",
  ENROLLMENTS: "Enrollments",
  RATING: "Rating"
};

interface CourseListProps {
  filter: TCourseFilter;
}

export function CourseList(props: CourseListProps) {
  const { filter } = props;
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteSuccessfulDialog, setOpenDeleteSuccessfulDialog] = useState(false);

  const toast = useToast();

  const getCourseForAdminAPI = async () => {
    await courseAPI.getCourseForAdmin({
      query: { filter: filter },
      onStart: async () => setLoading(true),
      onSuccess: async (response) => setCourses(response.content),
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  useEffect(() => {
    getCourseForAdminAPI();
  }, [filter]);

  const handleToggleCourseAvailability = (courseId: string, isAvailable: boolean) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.courseId === courseId) {
          return { ...course, isAvailable: !isAvailable };
        }
        return course;
      })
    );
  };

  const handleDeleteCourse = (deleteCourse: ICourse) => {
    setCourses((prevCourses) => prevCourses.filter((course) => course.courseId !== deleteCourse.courseId));
    setOpenDeleteSuccessfulDialog(true);
  };

  const renderHeader = () => {
    return (
      <thead>
        <tr className="border-b border-gray5">
          <th className="text-left py-3 px-2 font-medium text-base border-t">
            <div className="flex items-center gap-2">
              {TABLE_HEADERS.ID}
              <ListFilter className="h-4 w-4" />
            </div>
          </th>
          <th className="text-left py-3 px-2 font-medium text-base border-t">
            <div className="flex items-center gap-2">
              {TABLE_HEADERS.COURSE_NAME}
              <ListFilter className="h-4 w-4" />
            </div>
          </th>
          <th className="text-left py-3 px-2 font-medium text-base border-t">
            <div className="flex items-center gap-2">
              {TABLE_HEADERS.LEVEL}
              <ListFilter className="h-4 w-4" />
            </div>
          </th>
          <th className="text-left py-3 px-2 font-medium text-base border-t">
            <div className="flex items-center gap-2">
              {TABLE_HEADERS.PRICE}
              <ListFilter className="h-4 w-4" />
            </div>
          </th>
          {filter.isCompletedCreation && (
            <th className="text-left py-3 px-2 font-medium text-base border-t">
              <div className="flex items-center justify-center gap-2">
                {TABLE_HEADERS.AVAILABLE}
                <ListFilter className="h-4 w-4" />
              </div>
            </th>
          )}
          {filter.isCompletedCreation && (
            <th className="text-left py-3 px-2 font-medium text-base border-t">
              <div className="flex items-center justify-center gap-2">
                {TABLE_HEADERS.ENROLLMENTS}
                <ListFilter className="h-4 w-4" />
              </div>
            </th>
          )}
          {filter.isCompletedCreation && (
            <th className="text-left py-3 px-2 font-medium text-base border-t">
              <div className="flex items-center justify-center gap-2">
                {TABLE_HEADERS.RATING}
                <ListFilter className="h-4 w-4" />
              </div>
            </th>
          )}
          <th className="text-left py-3 px-2 font-medium text-base border-t" />
        </tr>
      </thead>
    );
  };

  const renderEmpty = () => {
    return (
      <tr className="font-semibold text-2xl">
        <td colSpan={8} className="py-5 text-center">
          No courses found
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

  const renderDeleteSuccessfulDialog = () => {
    return (
      <DeleteSuccessfulDialog
        isOpen={openDeleteSuccessfulDialog}
        onClose={() => setOpenDeleteSuccessfulDialog(false)}
      />
    );
  };

  return (
    <div className="p-0">
      <table className="w-full">
        {renderHeader()}
        {renderBody()}
      </table>
      {renderDeleteSuccessfulDialog()}
    </div>
  );
}
