import { Switch } from "@/components/ui/shadcn/switch";
import { ICourse } from "@/types";
import { MoreHorizontal, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/shadcn/Button";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { courseAPI } from "@/lib/api";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { useState } from "react";
import { DeleteCourseConfirmDialog } from "./DeleteCourseConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditingCourse } from "@/redux/course/courseSlice";

const DROP_DOWN_MENU_ITEMS = {
  VIEW: "View",
  EDIT: "Edit",
  DELETE: "Delete"
};

interface CourseListItemProps {
  course: ICourse;
  loading: boolean;
  onToggleCourseAvailability: (courseId: string, isAvailable: boolean) => void;
  onDeleteCourse: (course: ICourse) => void;
}

export function CourseListItem(props: CourseListItemProps) {
  const { course, loading, onToggleCourseAvailability, onDeleteCourse } = props;
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  const updateCourseAvailabilityAPI = async () => {
    await courseAPI.updateCourseAvailability({
      query: { courseId: course.courseId, isAvailable: !course.isAvailable },
      onSuccess: async (response) => onToggleCourseAvailability(course.courseId, response.isAvailable),
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  const deleteCourseAPI = async () => {
    await courseAPI.deleteCourse({
      query: { courseId: course.courseId },
      onSuccess: async (result) => {
        if (result) {
          setOpenDeleteConfirmDialog(false);
          onDeleteCourse(course);
        } else {
          showToastError({ toast: toast.toast, message: "Failed to delete course" });
        }
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  const handleViewDetails = () => {
    dispatch(setEditingCourse(course));
    navigate(`/admin/courses/view/general`);
  };

  const handleDeleteCourse = () => {
    setOpenDeleteConfirmDialog(true);
  };

  const renderDropdownMenu = () => {
    const handleDropdownMenuItemClick = async (action: string) => {
      switch (action) {
        case DROP_DOWN_MENU_ITEMS.VIEW:
          handleViewDetails();
          break;
        case DROP_DOWN_MENU_ITEMS.EDIT:
          console.log("Modify clicked for item:");
          break;
        case DROP_DOWN_MENU_ITEMS.DELETE:
          handleDeleteCourse();
          break;
        default:
          break;
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-24 min-w-[130px] shadow-lg">
          {[DROP_DOWN_MENU_ITEMS.VIEW, DROP_DOWN_MENU_ITEMS.EDIT, DROP_DOWN_MENU_ITEMS.DELETE].map((action) => (
            <DropdownMenuItem
              key={action}
              onClick={() => handleDropdownMenuItemClick(action)}
              className="text-sm py-1.5 px-3 cursor-pointer  focus:bg-gray6"
            >
              {action}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderLoading = () => {
    return (
      <tr className="border-b border-gray5 text-base">
        <td className="py-1 px-2 max-w-[100px] truncate">
          <Skeleton className="h-4 w-full" />
        </td>
        <td className="py-1 px-2">
          <Skeleton className="h-4 w-3/4" />
        </td>
        <td className="py-1 px-2">
          <Skeleton className="h-4 w-1/2" />
        </td>
        <td className="py-1 px-2">
          <Skeleton className="h-4 w-1/3" />
        </td>
        <td className="py-1 px-2">
          <div className="flex justify-center">
            <Skeleton className="h-6 w-10" />
          </div>
        </td>
        <td className="py-1 px-2 text-center">
          <Skeleton className="h-4 w-1/4 mx-auto" />
        </td>
        <td className="py-1 px-2 justify-items-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-3 w-1/2 mt-1" />
        </td>
        <td className="py-1 px-2">
          <Skeleton className="h-8 w-8" />
        </td>
      </tr>
    );
  };

  const renderDeleteCourseConfirmDialog = () => {
    return (
      <DeleteCourseConfirmDialog
        isOpen={openDeleteConfirmDialog}
        onClose={() => setOpenDeleteConfirmDialog(false)}
        onDelete={deleteCourseAPI}
      />
    );
  };

  const renderContent = () => {
    return (
      <>
        <tr key={course.courseId} className="border-b border-gray5 text-base">
          <td className="py-1 px-2 max-w-[100px] truncate">{course.courseId}</td>
          <td className="py-1 px-2">{course.courseName}</td>
          <td className="py-1 px-2">{course.level}</td>
          <td className="py-1 px-2">
            {course.price == 0 ? "Free" : `${course.price.toLocaleString()} ${course.unitPrice}`}
          </td>
          {course.isCompletedCreation && (
            <td className="py-1 px-2">
              <div className="flex justify-center">
                <Switch
                  checked={course.isAvailable}
                  onCheckedChange={updateCourseAvailabilityAPI}
                  className="data-[state=checked]:bg-appPrimary data-[state=unchecked]:bg-gray5"
                />
              </div>
            </td>
          )}
          {course.isCompletedCreation && (
            <td className="py-1 px-2 text-center">{course.numberOfEnrolledStudents ?? 0}</td>
          )}
          {course.isCompletedCreation && (
            <td className="py-1 px-2 justify-items-center">
              <div className="flex items-center gap-1">
                <span className="">
                  {course.averageRating && course.averageRating > 0 ? course.averageRating.toFixed(1) : "NA"}
                </span>
                <Star className="h-4 w-4 fill-appMedium text-appMedium" />
              </div>
              <span className="font-light text-base text-gray3">({course.reviewCount ?? 0} reviews)</span>
            </td>
          )}
          <td className="py-1 px-5">{renderDropdownMenu()}</td>
          <td>{renderDeleteCourseConfirmDialog()}</td>
        </tr>
      </>
    );
  };

  return loading ? renderLoading() : renderContent();
}
