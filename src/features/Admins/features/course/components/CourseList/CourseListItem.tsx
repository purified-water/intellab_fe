import { ICourse } from "@/types";
import { MoreHorizontal, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@/components/ui";
import { Skeleton, Switch } from "@/components/ui/shadcn";
import { courseAPI } from "@/lib/api";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditingCourse } from "@/redux/course/courseSlice";
import { NA_VALUE } from "@/constants";

const DROP_DOWN_MENU_ITEMS = {
  VIEW: "View",
  MODIFY: "Modify",
  CONTINUE_EDIT: "Continue Edit",
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

  const updateCourseAvailabilityAPI = async () => {
    await courseAPI.updateCourseAvailability({
      query: { courseId: course.courseId, isAvailable: !course.isAvailable },
      onSuccess: async (response) => onToggleCourseAvailability(course.courseId, response.isAvailable),
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  const handleViewDetails = () => {
    dispatch(setEditingCourse(course));
    navigate(`/admin/courses/view/general`);
  };

  const handleDeleteCourse = () => {
    onDeleteCourse(course);
  };

  const renderDropdownMenu = () => {
    const handleDropdownMenuItemClick = async (action: string) => {
      switch (action) {
        case DROP_DOWN_MENU_ITEMS.VIEW:
          handleViewDetails();
          break;
        case DROP_DOWN_MENU_ITEMS.MODIFY:
          console.log("Modify clicked for item:");
          break;
        case DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT:
          console.log("Continue Edit clicked for item:");
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
          <Button variant="ghost" className="w-8 h-8 p-0">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-24 min-w-[130px] shadow-lg">
          {[
            DROP_DOWN_MENU_ITEMS.VIEW,
            course.isCompletedCreation ? DROP_DOWN_MENU_ITEMS.MODIFY : DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT,
            DROP_DOWN_MENU_ITEMS.DELETE
          ].map((action) => (
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
      <tr className="text-base border-b border-gray5">
        <td className="py-1 px-2 max-w-[100px] truncate">
          <Skeleton className="w-full h-4" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="w-3/4 h-4" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="w-1/2 h-4" />
        </td>
        <td className="px-2 py-1 text-center">
          <div className="flex justify-center">
            <Skeleton className="w-10 h-4" />
          </div>
        </td>
        <td className="px-2 py-1">
          <div className="flex justify-center">
            <Skeleton className="w-10 h-4" />
          </div>
        </td>
        <td className="px-2 py-1 text-center">
          <Skeleton className="w-1/4 h-4 mx-auto" />
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    let disPlayPrice = null;
    if (course.price == null) {
      disPlayPrice = NA_VALUE;
    } else if (course.price === 0) {
      disPlayPrice = "Free";
    } else {
      disPlayPrice = `${course.price.toLocaleString()} ${course.unitPrice}`;
    }

    return (
      <>
        <tr key={course.courseId} className="text-base border-b border-gray5">
          <td className="px-2 py-1">{course.courseName}</td>
          <td className="px-2 py-1">{course.level}</td>
          <td className="px-2 py-1">{disPlayPrice}</td>
          {course.isCompletedCreation && (
            <td className="px-2 py-1">
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
            <td className="px-2 py-1 text-center">{course.numberOfEnrolledStudents ?? 0}</td>
          )}
          {course.isCompletedCreation && (
            <td className="px-2 py-1 justify-items-center">
              <div className="flex items-center gap-1">
                <span className="">
                  {course.averageRating && course.averageRating > 0 ? course.averageRating.toFixed(1) : NA_VALUE}
                </span>
                <Star className="w-4 h-4 fill-appMedium text-appMedium" />
              </div>
              <span className="text-base font-light text-gray3">({course.reviewCount ?? 0} reviews)</span>
            </td>
          )}
          {!course.isCompletedCreation && <td className="px-2 py-1 text-center">{course.createdAt ?? NA_VALUE}</td>}
          {!course.isCompletedCreation && (
            <td className="px-2 py-1 text-center">{course.currentCreationStepDescription}</td>
          )}
          <td className="px-5 py-1">{renderDropdownMenu()}</td>
        </tr>
      </>
    );
  };

  return loading ? renderLoading() : renderContent();
}
